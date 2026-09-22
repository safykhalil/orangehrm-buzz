---
name: playwright-automation
description: "Write and run real Playwright test automation for the test cases marked Needs Automation = Yes, using intelligence from the execution report's locator hazards, heal any broken locators found during runs, and produce an automation execution HTML report plus a healing-log.md documenting every healing attempt and its methodology. WHEN: automate the test cases, write Playwright scripts, Milestone 5, run automation, heal broken tests."
metadata:
  version: "2.0"
---

# Playwright Test Automation

Turns the test cases marked `Needs Automation = Yes` in the test-design CSV
into real, runnable Playwright test code (`@playwright/test`, not MCP
browser-driving), runs it, and produces an evidence-backed HTML report —
plus a separate healing log documenting any locator/script fixes made
along the way, with the reasoning behind each fix.

## Inputs (ask if not given)

- Application URL.
- The test-design CSV, filtered to `Needs Automation = Yes`.
- The Milestone 4 execution report (`execution/execution-report.html`) —
  read its "Findings Summary" / "Locator hazards" notes first; they
  contain real, already-discovered automation-readiness intelligence
  (element quirks, non-unique IDs, overlay click targets, modal dismissal
  behavior) that should inform script design from the start, not be
  rediscovered the hard way. It also names DEFECT-001 — see Regression
  Probes below for how to handle it specifically.
- The PRD and exploration findings, for expected-result context.
- Where to write: test code (default `automation/tests/`, page objects in
  `automation/pages/`, shared helpers in `automation/utils/`), the HTML
  report (default `automation/reports/automation-execution-report.html`),
  and the healing log (default `automation/reports/healing-log.md`).

## Hard rules

- Only automate cases marked `Needs Automation = Yes`. If a case's steps
  would require an action excluded by the ui-exploration/test-execution
  Interaction Policy (creating permanent content on the shared public
  demo), do not write a script that performs it — this should not arise
  if `Needs Automation` was reviewed correctly, but treat it as a hard
  stop if it does, and report it rather than silently working around it.
- Prefer role-based/accessible locators (`getByRole`, `getByLabel`,
  `getByText`) over brittle CSS/XPath or fragile `id` selectors — several
  elements in this app have non-unique or missing accessible identifiers
  (see the execution report's findings); pick the strategy that already
  worked or was recommended there rather than guessing anew.
- Never write an assertion whose expected value wasn't confirmed in
  Milestone 4 execution or the PRD/exploration. If a case's expected
  result was only ever a design-time hypothesis, do not automate it as if
  it were confirmed — flag it back rather than assert an invented outcome.
- Do not modify a test's assertions to make a failing run pass. Every
  failure must be triaged into one of the three categories in "Diagnosing
  a Failure" below — never silently loosen an assertion to turn red green.
- Distinguish self-healing from defect-masking. **Healing** = fixing the
  *mechanism* of interacting with the page (a stale selector, a changed
  DOM structure, a timing issue) so the test can still make its intended
  assertion. **Never** heal by changing what the test asserts — that's
  defect-masking, and it's forbidden.
- Every healing action must be logged (see Healing Log below), including
  attempts that didn't work, before you find the one that does.
- **Cleanup/teardown runs regardless of whether the test's assertions
  passed or failed** — put reversal logic (Unlike, close a dialog without
  submitting, etc.) in an `afterEach`/`finally` block, not only at the
  natural end of a passing test. If a test fails mid-way after already
  performing a state-changing action, the reversal must still happen. Log
  (never silently swallow) a cleanup failure if one occurs.

## Diagnosing a Failure — three categories, not two

When an automated test fails, determine which of these happened before
touching anything:

1. **A genuine automation bug** (stale/flaky selector, timeout too short,
   wrong wait condition, a bug in your own retry/teardown logic). →
   Root-cause and fix it in the automation code (see Healing Log). Do not
   touch the assertion.
2. **A genuine, reproducible product defect** (e.g. DEFECT-001, or a new
   one discovered here). → Do not "fix" it by loosening the assertion.
   Handle it via a **Regression Probe** (below), not an ordinary
   pass/fail test.
3. **Incidental data drift from the shared public demo** — this is *not*
   a script bug or a product defect; it's the live environment's own data
   changing between/during runs (as happened in Milestone 4, when a real
   external user posted mid-execution). Symptoms: a count, an ordinal
   position, or a specific seed value no longer matches, but the
   underlying behavior being tested is otherwise unaffected. Handle this
   by asserting on relative structure / named seed data rather than exact
   counts or positions wherever possible, and if a test still fails
   because of this, report it as environmental drift, not a defect and
   not a script bug — do not silently adjust the expected value without
   noting why in the report.

Never let category 3 get misclassified as category 1 (leads to
unnecessary "fixes" that just paper over normal shared-demo variability)
or category 2 (leads to false defect reports).

## Regression Probes — for confirmed, reproducible defects (e.g. DEFECT-001)

A confirmed, reliably-reproducing defect gets its own dedicated test,
clearly separated from ordinary pass/fail automation:

- Its assertion is **inverted**: it asserts the defect's symptom is still
  present. A runner "PASS" therefore means *the defect still exists*
  (expected, not alarming) and a runner "FAIL" means *the symptom didn't
  reproduce* — which is the actually interesting outcome, requiring a
  human decision (was it fixed? is the repro flaky? did something else
  change?).
- Make the inversion unmistakable: name the test/file something like
  `defect-001.regression-probe.spec.ts`, and have it print/log an explicit
  banner (e.g. `"⚠ REGRESSION PROBE: PASS = defect still present"`)
  alongside the inverted assertion — a bare PASS/FAIL badge in a dashboard
  reads backwards for this file otherwise.
- **Never** quietly flip a regression probe to expect success just because
  it stopped reproducing during a run. Non-reproduction is evidence to
  report to the human QC lead, not authorization to close the defect
  yourself.
- For this project specifically: DEFECT-001 (Share Video "Share" button
  not disabled with an empty URL) should get a regression probe that
  checks the button's disabled state only — it must NOT click Share (that
  would be the excluded content-creating action from TC-024, still not
  authorized here).

## Method

1. Read the Milestone 4 execution report's findings/locator-hazards notes
   first, and note DEFECT-001 specifically. Build a working list of known
   quirks (e.g. duplicate `id="heart-svg"`, the photo click target being
   an overlay `<div>` not the `<img>`, Escape not closing Share Photos/
   Video modals) before writing any locator.
2. Set up (or confirm) the Playwright test project structure: a Page
   Object Model per module/page (e.g. `pages/BuzzPage.ts`) encapsulating
   locators and actions, spec files per feature area rather than per test
   case where that reduces duplication, and a shared fixture for
   login/navigation so it isn't repeated in every test.
3. Write one automated test per in-scope TC ID (excluding DEFECT-001's TC,
   which becomes a regression probe instead — see above), each traceable
   back to its TC ID (in a comment or test title) and asserting only what
   was actually confirmed in Milestone 3/4. Ensure every state-changing
   test's reversal logic lives in `afterEach`/`finally`.
4. Run the suite (`npx playwright test` or equivalent). For any failure,
   triage it per "Diagnosing a Failure" above and act accordingly
   (heal / regression-probe / report-as-drift).
5. Produce the HTML report (see Output below) and the healing log.
6. Record this run in the project's session/prompt log.

## Healing Log (`healing-log.md`)

For every healing attempt (successful or not), record:

- Which test/TC ID was affected.
- The original locator/step and the symptom (error message, timeout,
  wrong element clicked, etc.).
- Diagnosis: which of the three failure categories this was judged to be,
  and why.
- The fix applied (the new locator/wait/strategy) — show before and
  after, not just "fixed selector." (For category 3/drift cases: what
  assertion strategy change was made to be resilient to shared-demo
  variability, if any.)
- Re-run result after the fix.
- If multiple attempts were needed, log each one in order, including the
  ones that didn't work and why.

A short healing log (or none, if nothing broke) is a fine, honest outcome
— do not pad it with manufactured healing stories to look thorough.

## Output — Automation Execution HTML Report

Build a single self-contained HTML file, following the same visual
language as the Milestone 4 execution report (dashboard summary cards,
collapsible per-test sections, color-coded PASS/FAIL/BLOCKED badges), with
at minimum:

- Summary counts (automated / PASS / FAIL / BLOCKED / healed).
- Per-test results: TC ID, title, result, evidence (screenshot on failure
  at minimum), and a note if this test required healing (with a link/
  reference to its healing-log.md entry) or is a regression probe (with
  its inverted-meaning banner repeated in the report, not just the code).
- Formal defects section for any genuine product-defect failures
  (including the regression probe's status), in the same structure as
  Milestone 4's.
- A short section summarizing overall automation health: how many tests
  needed no changes at all vs. needed healing vs. surfaced real defects
  vs. were affected by shared-demo data drift.

## Quality checklist (run before finishing, report the results)

- Every automated test traces to a `Needs Automation = Yes` TC ID.
- No excluded/policy-violating action was scripted, including inside the
  DEFECT-001 regression probe (button-state check only, no Share click).
- No assertion was invented beyond what M3/M4 confirmed.
- Every healing action is logged with before/after, diagnosis category,
  and re-run result.
- No product defect was masked by loosening an assertion; no drift issue
  was misreported as a defect or a script bug.
- Cleanup/teardown logic runs in `afterEach`/`finally` for every
  state-changing test, not only on the success path.
- The regression probe's inverted meaning is unmistakable in both code
  and report.
- HTML report and healing-log.md both produced, cross-referencing each
  other where a test needed healing.
- Session/prompt log updated.

## Stop condition

After running the suite, producing the HTML report, and writing the
healing log: report the summary counts, how many tests needed healing,
the regression probe's current result (and what that means), any drift
incidents, and any cases you could not automate (and why). Then **stop**
— do not silently expand scope to cases marked `Needs Automation = No`,
and do not attempt any excluded/policy action even if a healing attempt
seems to require it.
