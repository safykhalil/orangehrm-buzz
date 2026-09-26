---
name: playwright-automation
description: "Write and run real Playwright test automation for approved test cases marked Needs Automation = Yes, using evidence from the test-design CSV, Milestone 4 execution report, PRD, and exploration findings. Diagnose failures, heal broken interaction mechanisms without masking product defects, handle confirmed defects via inverted-assertion regression probes, and produce an evidence-backed HTML automation report plus a healing log. WHEN: automate approved test cases, write Playwright scripts, run automation, diagnose failures, heal broken locators, Milestone 5."
metadata:
  version: "3.2"
---

# Playwright Test Automation

Turns approved test cases marked `Needs Automation = Yes` in the test-design
CSV into real, runnable Playwright automation using `@playwright/test`.
This skill is **not MCP browser-driving**.

It produces:

1. Playwright test code
2. Page objects/helpers where appropriate
3. Automation execution results
4. Evidence-backed HTML report
5. Healing log documenting every healing attempt
6. Failure classification
7. Credential/evidence safety verification

Pipeline:

```
M3 Test Design -> Human QC Review -> Needs Automation = Yes
-> M4 Test Execution Evidence -> M5 Playwright Automation
-> Automation Execution Report
```


# Inputs

Ask for any required input not provided:

- Application URL
- Test-design CSV
- Test cases reviewed by Senior QC
- Milestone 4 execution report
- PRD
- UI exploration findings
- Existing Playwright automation framework, if present
- Project-specific known defects/context, if available

The test-design CSV must be filtered to `Needs Automation = Yes`. Do not
automate `Needs Automation = No` or empty, unless the human QC explicitly
changes the classification.

# Output

Default structure:

```
automation/
  tests/
  pages/
  utils/
  reports/
    automation-execution-report.html
    healing-log.md
```


If the project already has an established structure, extend it instead of
creating a parallel framework.

# Pre-Automation Inspection

Before writing code:

## 1. Inspect existing framework

Check whether the project already contains `package.json`,
`playwright.config.*`, existing tests, page objects, fixtures, utilities,
authentication helpers, test data, reporting configuration. If an existing
framework exists, **extend it** — do not silently create a second,
parallel automation structure.

## 2. Inspect test-design CSV

Confirm the case's ID, module, feature, preconditions, steps, data,
expected result, priority, type, and — critically — `Valid in Scope` and
`Needs Automation`. Only automate cases where `Needs Automation = Yes`
and the case has been reviewed by the human QC process. If `Valid in
Scope` is empty or indicates the case is not approved, stop and report
it rather than automatically creating automation.

## 3. Inspect the Milestone 4 execution report

Read the latest execution results before writing automation. Pay
particular attention to: confirmed behavior, locator findings and
hazards, timing issues, overlays, modal behavior, non-unique IDs,
accessible roles/names, state transitions, test-data limitations, known
defects (including their current status — confirmed, withdrawn, under
re-verification), environment drift, blocked scenarios. Use confirmed
execution evidence to inform automation design, not assumptions.

# Source of Truth for Assertions

Precedence: (1) confirmed Milestone 4 execution behavior, (2) explicit
PRD requirement, (3) confirmed exploration behavior, (4) test-design
expected result. If sources disagree, do not silently choose one —
identify the discrepancy, prefer confirmed execution evidence for actual
observable behavior, and document the reconciliation in the automation
report. The test-design CSV represents design-time intent; the execution
report represents live-confirmed behavior.

# Hard Rules

1. **Automate only approved cases.** Only cases explicitly classified
   `Needs Automation = Yes`. Do not automatically change this value.
2. **Never execute excluded actions.** If automation requires an action
   explicitly prohibited by the project's Interaction Policy (e.g.
   creating permanent content on a shared public environment), do not
   write that script — report the case as BLOCKED and explain why. Do
   not bypass the policy by changing the test flow.
3. **Use real Playwright.** `@playwright/test`, not MCP as the execution
   mechanism (MCP may have been used during exploration/manual
   execution — Milestone 5 produces real, standalone code).
4. **Verify no credential leaked into evidence, not just avoid writing it
   deliberately.** After execution, grep the evidence/report files for
   the actual credential value used; confirm zero matches; report the
   verification result. Never print the credential itself anywhere.
5. **Size the test framework's hook/teardown timeout to fit whatever
   retry logic the cleanup itself uses**: cleanup retry budget + retry
   delays + page interaction timeout must be **less than** the hook
   timeout — otherwise the runner kills cleanup mid-attempt, silently
   leaving the shared environment in a changed state with no record of
   what happened. This is a real, easy-to-miss bug class, not
   hypothetical.
6. **Cleanup/teardown runs regardless of whether the test's assertions
   passed or failed.** Put reversal logic (Unlike, close a dialog without
   submitting, etc.) in an `afterEach`/`finally` block, not only at the
   natural end of a passing test. If a test fails mid-way after already
   performing a state-changing action, the reversal must still happen.
   Log (never silently swallow) a cleanup failure if one occurs.

# Locator Strategy

Prefer locators in this order:

1. `getByRole()`
2. `getByLabel()`
3. `getByPlaceholder()`
4. `getByText()`
5. `getByTestId()`
6. stable CSS selector
7. XPath only when no reliable alternative exists

Do not automatically prefer IDs — they may be missing, duplicated,
dynamically generated, or unstable (several elements in this app have
non-unique or missing accessible identifiers; see the execution report's
findings). Use the locator evidence already discovered in Milestone 4
rather than guessing anew. If several elements match, make the locator
more specific — avoid `locator("button").nth(3)` unless the position is
itself stable and meaningful. Prefer semantic identification.

Known quirks in this app (from Milestone 4 — build this list before
writing any locator, and re-check the report for additions): duplicate
`id="heart-svg"` across posts (scope Like/Unlike to the post's action
bar), the photo click target is an overlay `<div>` not the `<img>`, and
Escape does not close the Share Photos / Share Video modals.

# Assertions

Assertions are part of the test's purpose. Never weaken or remove an
assertion merely because the test fails. Do not replace an exact business
assertion with something weaker (e.g. `expect(page).toHaveURL(...)`)
unless that really is the intended check. Every assertion must be
supported by Milestone 4 evidence, the PRD, exploration findings, or a
confirmed test-design expected result — if the expected behavior is only
a hypothesis and was never confirmed, do not automate it as a confirmed
assertion; report it as `BLOCKED — expected behavior requires
confirmation` instead.

# Diagnosing a Failure — four categories

Every failure must be classified into exactly one primary category before
changing anything:

## 1. Automation Defect (stale locator, wrong wait, bad fixture, teardown bug, etc.)

Root-cause and fix the automation code. Prefer finding the actual root
cause over adding more retries as a band-aid. Do not touch the assertion.

## 2. Product Defect

Evidence indicates the product does not behave per the confirmed
requirement. Do not weaken the assertion. If this matches an existing
known, reliably-reproducing defect, handle it via a **Regression Probe**
(below), not an ordinary pass/fail test. If it's a newly-discovered
defect, report it clearly (do not hard-code assumptions about severity).

## 3. Environmental / Data Drift

The shared demo's own data changed between/during runs (a count, an
ordinal position, or a seed value no longer matches, but the underlying
behavior is otherwise unaffected) — not a script bug, not a product
defect. This happened in Milestone 4, when a real external user posted
mid-execution. Prefer asserting on relative structure / named seed data
over exact counts or positions. Report drift explicitly; never silently
adjust an expected value without noting why.

## 4. Blocked / Insufficient Evidence

Expected behavior is unconfirmed, required data/permission is
unavailable, the action is policy-excluded, or the environment can't
support the test. Do not invent a workaround — report as BLOCKED with the
specific reason.

Never let category 3 get misclassified as category 1 (leads to
unnecessary "fixes" masking normal variability) or category 2 (leads to
false defect reports).

# Regression Probes — for confirmed, reliably-reproducing defects

A defect that has been independently confirmed and reliably reproduces
(not a one-off) gets its own dedicated test, clearly separated from
ordinary pass/fail automation — never automated as a normal failing test
that would permanently redden every run:

- Its assertion is **inverted**: it asserts the defect's symptom is still
  present. A runner "PASS" means the defect still exists (expected, not
  alarming); a runner "FAIL" means the symptom didn't reproduce — the
  actually interesting outcome, requiring a human decision.
- Make the inversion unmistakable: name the file/test so the inversion is
  obvious (e.g. `<defect-id>.regression-probe.spec.ts`), and print an
  explicit console banner alongside the inverted assertion (e.g. "PASS =
  defect still present") — a bare PASS/FAIL badge reads backwards for
  this file otherwise.
- **Never quietly flip a probe to expect success just because it stopped
  reproducing in one run.** Non-reproduction — even across several
  attempts — is evidence for the human QC lead, not authorization to
  close the defect yourself. Word the report proportionally to how many
  attempts were actually made: one non-reproduction is a data point, not
  grounds to declare anything resolved.
- If the confirmed defect's reproduction would itself require an action
  excluded by the Interaction Policy (e.g. actually submitting a form
  that would publish content), the probe must check only the observable
  precondition of the defect (e.g. a control's disabled/enabled state)
  without performing the excluded action — read the execution report's
  specific defect writeup for what was and wasn't actually exercised, and
  match that boundary exactly, do not go further than it did.

For this project specifically: DEFECT-001 (Share Video "Share" button not
disabled with an empty URL) gets a regression probe that checks the
button's disabled state only — it must NOT click Share (that would be the
excluded content-creating action from TC-024, still not authorized here).
DEFECT-002 (Like/Unlike) was withdrawn after re-verification — it gets no
probe; its TC is automated as an ordinary state-changing test.

# Scheduling Tiers — relevant whenever the target is a shared/public environment

Not every automated test should run with the same frequency or be treated
as an equally safe default action when other real people use the same
environment concurrently:

1. **Read-only tier** — tests that only observe (states, sorting, panel
   display, navigation). Safe to run anytime, as often as needed, no
   state impact on other users.
2. **State-changing tier** — tests that toggle real, reversible state.
   Each is individually reversible and this skill requires confirming
   the reversal, but repeated frequent runs against a shared environment
   still carry more real-world footprint than tier 1 — note this
   explicitly in the report rather than treating it as identical.
3. **Regression-probe tier** — kept separate from both above, never
   treated as a normal pass/fail gate; its "PASS" is the expected,
   uninteresting outcome.

Note the tier breakdown in the automation execution report's summary,
even if the project has no actual CI pipeline yet — the distinction
matters for whoever decides how/when to re-run this suite later.

# Self-Healing

Self-healing is allowed only for the **interaction mechanism**:

- Valid: old selector -> stable accessible role; old CSS -> stable test
  ID; changed DOM nesting -> updated locator; timing issue -> proper wait
  for actual UI state; overlay -> correct interaction target.
- Invalid: changing expected result, removing an assertion, changing
  business logic, ignoring an error, converting a failure into a pass,
  adding arbitrary retries until pass.

**Healing** = fixing the mechanism used to interact with the product.
**Defect masking** = changing what the test expects so the product
appears correct. Defect masking is forbidden.

Process: confirm the failure -> diagnose (stale/ambiguous locator, DOM
change, timing, overlay, interaction mechanism, or actual product
behavior) -> try the least-invasive evidence-supported fix -> re-run ->
record the result either way -> do not modify the assertion to hide a
failure. Limit healing attempts to a reasonable maximum; do not enter an
infinite retry/healing loop.

# Healing Log (`automation/reports/healing-log.md`)

Every healing attempt — successful or not — is recorded with: date/run,
TC ID, test name, failure, original locator/mechanism, diagnosis (which
of the four failure categories, and why), healing attempt, evidence used,
result, final locator/mechanism, and "Was Assertion Changed" (must always
be **No**, unless the human QC explicitly approves a test-design
correction outside the healing process — that's a QC decision, not
something this skill grants itself).

Show before and after, not just "fixed selector." For drift cases, record
what assertion-strategy change (if any) was made to be resilient to
shared-demo variability. If multiple attempts were needed, log each one
in order, including the ones that didn't work and why.

A short healing log (or none, if nothing broke) is a fine, honest outcome
— do not pad it with manufactured healing stories to look thorough.

# Retry Policy

Retries must never be used to hide product defects. Use retries only for
known transient interaction failures, documented environment instability,
or safe cleanup operations — each with a maximum attempt count, a reason,
an appropriate delay, and logging. Never "retry until pass."

# Test Isolation & Test Naming

Each automated test establishes its own required state where practical;
don't rely on a previous test having passed to set up the next one's
state. If tests must share state, document the dependency explicitly.
Test names include the TC ID plus a meaningful scenario name (e.g. `BUZZ-
TC-014 - Like a post using the Like action`), so a test traces cleanly:
`test-design.csv -> execution report -> Playwright test -> automation
report -> healing-log.md`. No orphan automation tests.

# Method

1. Complete Pre-Automation Inspection (above), including the known-quirks
   list under Locator Strategy and the current status of every defect.
2. Build the Page Object Model / shared fixtures per the existing or
   proposed directory structure: a page object per module/page (e.g.
   `pages/BuzzPage.ts`) encapsulating locators and actions, spec files per
   feature area where that reduces duplication, and a shared fixture for
   login/navigation so it isn't repeated in every test.
3. Write one automated test per in-scope TC ID (except a confirmed
   defect's TC, which becomes a Regression Probe instead), each tagged
   with its scheduling tier. Every state-changing test's reversal logic
   lives in `afterEach`/`finally`.
4. Run the suite. Diagnose every failure into one of the four categories
   and act accordingly (heal / regression-probe / report-drift / BLOCKED).
5. Produce the HTML report and healing log.
6. Run the credential-leak grep check and record the result.
7. Record this run in the project's session/prompt log.

# Output — Automation Execution HTML Report

A single self-contained HTML file, in the same visual style as prior
milestone reports (dashboard summary cards, collapsible per-test
sections, color-coded status badges), containing at minimum:

- Summary counts by status (PASS / FAIL / BLOCKED / DEFECT /
  ENVIRONMENTAL_DRIFT), plus the read-only / state-changing /
  regression-probe tier breakdown.
- Per-test: TC ID, name, module, status, execution time, expected vs.
  actual, failure classification, evidence (screenshot/trace on
  failure), and a healing-log cross-reference if it needed healing. For a
  regression probe, repeat its inverted-meaning banner in the report, not
  just the code.
- A defects section for any genuine product-defect result, in the same
  structure as Milestone 4's, including the regression probe's current
  status worded proportionally (never a unilateral "resolved").
- A healing summary: total attempts, successful, unsuccessful, tests
  affected.
- An automation-health summary: how many tests needed no changes vs.
  needed healing vs. surfaced real defects vs. were affected by
  shared-demo data drift.
- The credential-leak grep verification result.

# Quality Checklist (run before finishing, report the results)

- Only `Needs Automation = Yes` cases were automated; every test has a
  traceable TC ID; no orphan tests.
- Every assertion has supporting evidence; none was invented or weakened
  to pass.
- No product defect was masked; no drift was misreported as a defect or
  script bug.
- Every healing attempt is logged with before/after and outcome; "Was
  Assertion Changed" is No throughout, absent an explicit QC exception.
- Cleanup runs in `afterEach`/`finally` for every state-changing test,
  sized correctly against its own retry budget; failures are logged, not
  swallowed.
- The regression probe's inverted meaning is unmistakable in code and
  report; no excluded action was performed inside it (DEFECT-001: button
  state check only, no Share click).
- The scheduling-tier breakdown appears in the report.
- Credential-leak grep check ran and came back clean.
- HTML report and healing-log.md both produced and cross-referenced.
- Session/prompt log updated.

# Stop Condition

After running the suite, producing the HTML report, and writing the
healing log: report the summary counts (by status and by tier), how many
tests needed healing, the regression probe's result (worded
proportionally), any drift incidents, any cases you could not automate
and why, and the credential-leak grep result. Include a short
automation-readiness note: is this suite ready to be re-run repeatedly
as-is, or does something (e.g. a confirmed defect's status, a scheduling
policy) need a human decision first? Then **stop** — do not silently
expand scope to `Needs Automation = No` cases, do not attempt any
excluded/policy action even if healing seems to need it, and do not
change `Valid in Scope`, the PRD, or exploration findings.
