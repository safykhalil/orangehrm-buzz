---
name: test-design
description: "Generate a comprehensive positive/negative/boundary test-case suite as CSV for a target module from a prior PRD and UI exploration document, with explicit scope-validation and automation-classification columns left blank for human QC. WHEN: generate test cases, write the test design, Milestone 3, build a test suite from exploration findings, classify tests for automation."
metadata:
  version: "2.1"
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
  it must say so too — that's a valid, correct scope reason, not a gap to
  paper over.
- Never invent expected results, validation messages, numeric limits, or
  business rules. Every expected result must trace back to something the
  PRD or exploration findings actually evidenced, or be explicitly framed
  as "requires live confirmation" — never state an unconfirmed behavior as
  fact.
- Do not execute any test case in this phase. Live confirmation is
  Milestone 4's job.
- Do not build automation in this phase.
- If the PRD and exploration findings conflict on a point, do not silently
  pick one — record the conflict in `Comments` and name both sources.
- Do not create a test case for every item in exploration's "Excluded
  Actions & Why" table automatically. For each excluded action, judge
  whether it's (a) meaningful behavior that should eventually be validated
  — write a hypothesis case, `Source` = "Exploration — Excluded Action",
  `Comments` noting the expected result is unconfirmed — or (b) a
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

Every test case row must have, at minimum:

TC ID | Module | Test Type | Title | Requirement ID | Preconditions |
Test Steps | Test Data | Expected Result | Priority | Severity | Source |
Valid in Scope | Needs Automation | Comments

- **TC ID**: unique, stable, module-prefixed (e.g. `BUZZ-TC-001`) — later
  milestones reference these IDs directly.
- **Module / Test Type / Title**: `Test Type` is one of Functional / UI /
  Negative / Edge / Security / Performance — don't label Security/
  Performance without a documented basis. `Title` is a short, specific
  case name.
- **Requirement ID**: the exact PRD FR-ID when available; leave empty only
  if the case derives purely from exploration, and give a precise `Source`
  instead.
- **Preconditions / Test Data / Steps / Expected Result**: each must be
  independently understandable and reproducible without re-reading the
  PRD or exploration doc.
- **Priority / Severity**: `Priority` reflects how important this case is
  to run; `Severity` reflects the impact if the behavior it tests turns
  out broken (most relevant for defect-candidate/negative cases). Base
  both on documented evidence, not a default guess.
- **Source**: specific enough for the QC lead to find the original
  evidence (e.g. `PRD FR-018`, `Exploration §3.9`, `Exploration —
  Excluded Action`). No orphan test cases.
- **Valid in Scope**: leave EMPTY. Human QC field — never populate with
  Yes/No/TBD/V/anything. Exists to evaluate whether the AI understood the
  requirement correctly.
- **Needs Automation**: leave EMPTY. Human QC field — never populate.
  Automation classification must not influence whether a case gets
  written in the first place.
- **Comments**: conflicts between sources, missing data, unconfirmed
  behavior notes — not a place to silently approve/reject scope.

If the project has its own house column standard, preserve its base columns
and append `Valid in Scope`, `Needs Automation`, and `Comments` (if no
equivalent exists) as the final columns, in that order — those two QC
columns must always stay blank regardless of what standard is used.

## Method

1. Read the PRD's relevant section(s) and the complete exploration findings
   for the scope module — full documents, not snippets.
2. Build an internal requirement coverage map (FR ID, description, known
   validations/roles, exploration evidence, open questions) and an
   exploration coverage map (confirmed behavior, discrepancies, new
   findings, unknowns, excluded actions) before writing any case.
3. Generate the case set per the Required scenario coverage above.
4. Self-review every case: atomic (tests one thing)? deterministic?
   traceable to a real source? expected result source-supported? test data
   realistic/source-supported? not a duplicate? unique ID? Fix or drop
   cases that fail — report the fix/drop count.
5. Verify every row has `Valid in Scope` and `Needs Automation` empty, no
   exceptions.
6. Validate CSV mechanics: correct headers/order, unique IDs, proper
   escaping of commas/quotes/multiline steps (embedded quotes must be
   doubled — `""` — never backslash-escaped, which is invalid CSV and can
   break in Excel), no column shifts.
7. Save the CSV.
8. Record this run in the project's session/prompt log.

## Quality checklist (run before finishing, report the results)

- No duplicate scenarios; no duplicate TC IDs.
- Every applicable PRD FR for the scope module has coverage.
- Every meaningful exploration discrepancy/new finding has coverage.
- Excluded actions were reviewed individually (meaningful → hypothesis
  case; not meaningful → reported, not converted).
- No unsupported expected results; unknowns explicitly framed as needing
  confirmation, never stated as fact.
- Every row has a traceable `Source`.
- `Valid in Scope` and `Needs Automation` are empty on every row, no
  exceptions.
- CSV structure is valid: correct headers, no column shifts, embedded
  quotes properly doubled (not backslash-escaped).
- Session/prompt log updated.

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
report instead — that report, not this CSV, becomes the authoritative
record of what actually happened. Only edit this CSV directly if a genuine
test-design defect is found (a wrong precondition, an unreachable step) —
never to reflect an execution outcome.
