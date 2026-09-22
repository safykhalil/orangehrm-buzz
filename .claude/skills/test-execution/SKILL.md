---
name: test-execution
description: "Execute only Valid in Scope = Yes test cases live against the app via Playwright MCP, capture screenshot evidence, classify results as PASS/PASS-with-deviation/FAIL/BLOCKED, raise formal defects, and produce an HTML execution report. WHEN: execute the test cases, run these tests live, Milestone 4, agent test execution, produce an execution report."
metadata:
  version: "1.0"
---

# Live Test Execution (UI)

Runs only the test cases marked `Valid in Scope = Yes` in the test-design
CSV against the real, live application via Playwright MCP, and produces an
evidence-backed HTML execution report. This phase does not build reusable
automation (that's Milestone 5) — it is direct, one-off, evidenced
execution, exactly as a careful human tester would do it by hand.

## Inputs (ask if not given)

- Application URL.
- The test-design CSV, reviewed (only rows with `Valid in Scope = Yes` are
  in scope for this run).
- The PRD and exploration findings, for context on expected behavior.
- Where to write the report (default: `execution/execution-report.html`)
  and evidence screenshots (default: `execution/evidence/`).
- Credentials: use the demo credentials shown on the live login page, per
  the same convention established in Milestone 1 — never invent, reuse a
  stale value silently, or write the actual credential value into the
  report, logs, or evidence.

## Hard rules

- Only execute cases marked `Valid in Scope = Yes`. Do not execute No/TBD
  cases without being explicitly asked to.
- **Carry forward the ui-exploration skill's Interaction Policy.** A case
  being marked `Valid in Scope = Yes` is a design-time scope judgment, not
  an authorization to perform actions that create permanent, visible-to-
  others content on a shared/public environment (posting, commenting,
  uploading, deleting others' data, etc.). If a case's steps require such
  an action (e.g. it derives from an `Exploration — Excluded Action`
  hypothesis, or its `Needs Automation` was marked `No` specifically for
  this reason), treat it as `BLOCKED — excluded by interaction policy`
  unless the run's prompt explicitly authorizes that specific action for
  this run.
- Capture a screenshot for every meaningful step (before/after a state-
  changing action, and for every assertion point), using a consistent,
  greppable naming convention (e.g. `TC-010_01_before.png`,
  `TC-010_02_after.png`). Every claim in the report must be traceable to a
  specific evidence file.
- Never invent an expected result. If a case's expected result was itself
  marked "requires live confirmation" at design time, the live result you
  observe becomes the evidence — report it plainly, don't retroactively
  pretend it was expected either way.
- Never modify a test case's definition to make it pass. If a
  precondition or step turns out to be wrong/unreachable, that's a
  test-design defect to report back, not something to quietly rewrite
  mid-execution.
- Reuse a live state across cases only when doing so doesn't corrupt
  independence (reading an existing post is fine to reuse; a
  state-changing action like Like needs its own before/after check per
  case).
- Reverse every reversible action you perform by the end of that case (per
  the same policy as exploration — e.g. Like → Unlike back to original
  state) and confirm the reversal succeeded. Never leave the live
  application in a different state than you found it, beyond what the
  Interaction Policy already excludes entirely. If a reversal cannot be
  confirmed successful, explicitly document why in the report rather than
  silently moving on — do not assume cleanup worked without checking.
- Do not perform destructive operations, and never touch data belonging to
  other real users beyond what's needed to observe (e.g. reading another
  user's post to test a permission case is fine; editing/deleting it is
  not).

## Result classification — do not blur these

- **PASS**: the test reached a definitive result matching its expected
  result.
- **PASS with documented deviation (PASS†)**: the test's literal
  precondition/data couldn't be used (e.g. blocked by the Interaction
  Policy or a known defect), but an equivalent substitution satisfies the
  test's actual intent. Always state the deviation explicitly — never
  claim the literal scenario passed.
- **FAIL**: the test reached a definitive result that contradicts the
  expected result.
- **BLOCKED**: execution could not reach a definitive result at all — an
  error, an Interaction Policy exclusion, or a system-level dependency
  prevented completion — because of something outside the test's own
  logic, not because the test's assertion was wrong. Do not call this
  FAIL. A FAIL claims the behavior is wrong; BLOCKED means you couldn't
  even get to a real assertion.

## Raising a formal defect

When a FAIL or a systematic BLOCKED looks reproducible (not a one-off
fluke), write it up as a named defect (e.g. `DEFECT-001`) with:

- Title, affected screen/module, URL/path.
- Exact preconditions and reproduction steps (numbered, literal).
- Actual result vs. expected result, with the specific evidence
  screenshot(s).
- Reproducibility (how many attempts, how many reproduced).
- Severity and priority recommendation, with reasoning.
- Which TC ID(s) are affected/blocked by it.

## Method

1. Filter the test-design CSV to `Valid in Scope = Yes`. If the column is
   still empty for some rows, stop and ask the human to complete review
   first — do not execute unreviewed cases.
2. For each in-scope case, check whether its steps require an action
   excluded by the Interaction Policy before attempting anything.
3. Execute allowed cases via Playwright MCP against the live app,
   capturing before/after screenshots at each meaningful step.
4. Classify the result (PASS/PASS†/FAIL/BLOCKED) per the definitions
   above. For any state-changing action, reverse it immediately after and
   confirm the reversal; document explicitly if a reversal could not be
   confirmed.
5. Raise formal defects for reproducible FAIL/BLOCKED results.
6. Build the HTML report (see Output below).
7. Record this run in the project's session/prompt log.

## Output — HTML report

Build a single self-contained HTML file with, at minimum:

- **Summary counts** (executed / PASS / PASS† / FAIL / BLOCKED), shown as
  a dashboard of count cards at the top.
- **A per-test-case results table/list**: TC ID, title, expected vs.
  actual, result badge (PASS/PASS†/FAIL/BLOCKED, color-coded), evidence
  screenshot references, defect ID if any — each case expandable/
  collapsible for detail, not a wall of text.
- **Formal defects section**, structured as above.
- **A concise findings summary** — confirmed behaviors worth carrying into
  Milestone 5 automation.
- **An exit assessment**: what's fully validated, what's blocked and by
  which defect or policy exclusion, what remains untested/out of scope,
  and what (if anything) should inform which cases get automated next.

Follow the visual style already established for this project's execution
reports (dashboard cards, collapsible per-case sections, color-coded
PASS/FAIL/BLOCKED badges) for consistency with later milestones' reports.

## Quality checklist (run before finishing, report the results)

- Every executed case has screenshot evidence for its key steps.
- No case outside `Valid in Scope = Yes` was executed.
- No excluded action (per Interaction Policy) was performed without
  explicit run-level authorization.
- Every FAIL/BLOCKED has a clear reason; every reproducible one has a
  formal defect.
- Every state-changing action was reversed and the reversal confirmed, or
  the failure to confirm was explicitly documented.
- No expected result was invented or retrofitted after the fact.
- Session/prompt log updated.

## Stop condition

Report the summary counts, defects, and exit assessment, then **stop**.
Do not automatically start building automation (Milestone 5) in the same
pass unless explicitly asked to.
