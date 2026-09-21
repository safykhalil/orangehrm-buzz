---
name: test-design
description: "Generate a comprehensive positive/negative/boundary test-case suite as CSV for a target module from a prior PRD and UI exploration document, with explicit scope-validation and automation-classification columns left blank for human QC. WHEN: generate test cases, write the test design, Milestone 3, build a test suite from exploration findings, classify tests for automation."
metadata:
  version: "3.0"
---

# UI Test Design

Turns a PRD (Milestone 1) and a completed UI exploration document (Milestone
2) into a comprehensive, evidence-grounded test suite — without inventing
unconfirmed behavior. This phase produces the test cases only; it does not
execute them (test-execution) or automate them (playwright-automation).

## Inputs (ask if not given)

- Application URL.
- The PRD markdown file (Milestone 1 output).
- The UI exploration findings markdown file (Milestone 2 output).
- The designated module/scope for this run.
- Any team test-case design standard/template already in this project — use
  it if present; otherwise use the default columns below.
- Where to write the output: CSV (`test-design/test-design.csv` by default,
  or the project's existing convention).

## Hard rules

- Do not assume a UI element/behavior exists just because the module is
  named in the task. If the PRD or exploration marked it
  `Unknown / Not observed` or `Unknown / Not exercised`, the test case about
  it must say so in its Expected Result — that's a valid, correct scope
  reason, not a gap to paper over.
- Never invent expected results, validation messages, numeric limits, or
  business rules. Every expected result must trace back to something the
  PRD or exploration findings actually evidenced, or be explicitly framed
  in the Expected Result field as "requires live confirmation" — never
  state an unconfirmed behavior as fact.
- Do not execute any test case in this phase. Live confirmation is
  Milestone 4's job.
- Do not build automation in this phase.
- If the PRD and exploration findings conflict on a point, resolve it by
  favoring the more specific/recent evidence and note the resolution
  briefly in the Expected Result or Preconditions field, since there is no
  separate conflict-tracking column in this schema.
- Do not create a test case for every item in exploration's "Excluded
  Actions & Why" table automatically. For each excluded action, judge
  whether it's (a) meaningful behavior that should eventually be validated
  — write a hypothesis case whose Title makes clear it's unverified (e.g.
  "Publish a new text post via composer (requires live confirmation)") and
  whose Expected Result states plainly that this is unconfirmed — or (b) a
  deliberately excluded/destructive action with no current test-design
  value — skip it, and list it in the final report under "Excluded/
  Unverified items not converted."

## Required scenario coverage

- **Positive:** the module's core happy-path behavior actually documented
  or evidenced — do not force scenarios irrelevant to the module.
- **Negative:** validation/error behavior actually documented or evidenced
  only. Where the source marks something unknown, write the case with an
  explicit "requires live confirmation" expected result rather than a
  fabricated error message/status.
- **Boundary:** only where a limit is actually evidenced (PRD, exploration,
  or team standard). Never invent a numeric limit (e.g. don't assume "255
  characters" without a source for it).
- **Permission/role:** one case per role/permission variant actually
  documented — do not invent roles not evidenced.

Coverage must stay proportional to what the module actually supports —
don't create artificial cases just to check a category box.

## Required columns

TC ID | Module | Test Type | Title | Preconditions | Test Steps |
Test Data | Expected Result | Priority | Severity | Valid in Scope |
Needs Automation

- **TC ID**: unique, stable, module-prefixed (e.g. `BUZZ-TC-001`) — later
  milestones reference these IDs directly.
- **Module / Test Type / Title**: `Test Type` is one of Functional / UI /
  Negative / Edge / Security / Performance — don't label Security/
  Performance without a documented basis. `Title` is a short, specific
  case name; for a hypothesis case derived from an excluded/unverified
  action, the title itself should signal that (e.g. end with "(requires
  live confirmation)").
- **Preconditions / Test Data / Steps / Expected Result**: each must be
  independently understandable and reproducible without re-reading the
  PRD or exploration doc. Since this schema has no separate traceability
  column, fold the essential evidence pointer directly into Preconditions
  or Expected Result where it materially matters (e.g. "per PRD FR-018" or
  "per Exploration §3.9") rather than dropping it — brief inline
  attribution, not a full citation.
- **Priority / Severity**: `Priority` reflects how important this case is
  to run; `Severity` reflects the impact if the behavior it tests turns
  out broken (most relevant for defect-candidate/negative cases). Base
  both on documented evidence, not a default guess.
- **Valid in Scope**: leave EMPTY. Human QC field — never populate with
  Yes/No/TBD/V/anything. Exists to evaluate whether the AI understood the
  requirement correctly.
- **Needs Automation**: leave EMPTY. Human QC field — never populate.
  Automation classification must not influence whether a case gets
  written in the first place.

If the project has its own house column standard, preserve its base
columns and append `Valid in Scope` and `Needs Automation` as the final
columns, in that order — those two QC columns must always stay blank
regardless of what standard is used.

Note: this schema intentionally omits separate Requirement ID, Source, and
Comments columns (a QC-lead decision for this project, to keep the sheet
compact for manual review). This means per-row machine-checkable
traceability back to a specific PRD/exploration citation is not preserved
in the CSV itself — brief inline attribution in Preconditions/Expected
Result is the only trace that remains. If full formal traceability is
needed later, it exists in the session/prompt log's record of which
PRD/exploration sections were read for this run, not per-row in the CSV.

## Method

1. Read the PRD's relevant section(s) and the complete exploration findings
   for the scope module — full documents, not snippets.
2. Build an internal requirement coverage map (requirement description,
   known validations/roles, exploration evidence, open questions) and an
   exploration coverage map (confirmed behavior, discrepancies, new
   findings, unknowns, excluded actions) before writing any case — this is
   working memory for this run, not a CSV column.
3. Generate the case set per the Required scenario coverage above.
4. Self-review every case: atomic (tests one thing)? deterministic?
   traceable in principle to real evidence (even if not cited inline)?
   expected result evidence-supported? test data realistic? not a
   duplicate? unique ID? Fix or drop cases that fail — report the fix/drop
   count.
5. Verify every row has `Valid in Scope` and `Needs Automation` empty, no
   exceptions.
6. Validate CSV mechanics: correct headers/order, unique IDs, proper
   escaping of commas/quotes/multiline steps (embedded quotes must be
   doubled — `""` — never backslash-escaped, which is invalid CSV and can
   break in Excel), no column shifts.
7. Save the CSV.
8. Record this run in the project's session/prompt log, including which
   PRD sections and exploration sections were used as input — since the
   CSV itself no longer carries a per-row Source column, this log entry is
   the only remaining record of what grounded this run's cases.

## Quality checklist (run before finishing, report the results)

- No duplicate scenarios; no duplicate TC IDs.
- Every applicable PRD requirement for the scope module has coverage.
- Every meaningful exploration discrepancy/new finding has coverage.
- Excluded actions were reviewed individually (meaningful → hypothesis
  case, clearly titled as unverified; not meaningful → reported, not
  converted).
- No unsupported expected results; unknowns explicitly framed as needing
  confirmation, never stated as fact.
- `Valid in Scope` and `Needs Automation` are empty on every row, no
  exceptions.
- CSV structure is valid: correct headers, no column shifts, embedded
  quotes properly doubled (not backslash-escaped).
- Session/prompt log updated with the PRD/exploration sections used.

Report the total test case count, counts by Test Type, the self-review
fix/drop count, and anything from the PRD/exploration that could NOT be
turned into a test case (and why).

## Stop condition

After creating the CSV and running the quality checklist: report the counts
and any concerns, then **stop**. Do not execute any test case, do not
create automation, and do not populate `Valid in Scope` or
`Needs Automation` — those happen in separate, deliberate later steps
(human QC review, then Milestone 4, then Milestone 5).

## Carrying scope decisions forward

Once a later milestone (Test Execution) actually runs a case and gets a
definitive live result, do **not** go back and edit this CSV's `Valid in
Scope`/`Needs Automation` columns to match the outcome. Those columns
reflect human, design-time judgment; editing them after the fact erases
the audit trail of what was assumed at design time vs. confirmed later.
Record the reconciliation in the execution (or automation) milestone's own
report instead. Only edit this CSV directly if a genuine test-design
defect is found (a wrong precondition, an unreachable step) — never to
reflect an execution outcome.
