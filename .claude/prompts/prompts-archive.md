# Prompts Archive — OrangeHRM Buzz QA Project

## Executive Summary (for reviewer)

| Milestone | Skill Used | Prompt(s) Sent | Output | Status |
|---|---|---|---|---|
| 1 — PRD Generation | `prd-generation` v1.0 | 1 initial + 1 correction | `docs/PRD.md` | ✅ Complete, QC-reviewed |
| 2 — UI Exploration | `ui-exploration` v2.0 | 1 initial + 1 cleanup | `docs/exploration-findings.md` | ✅ Complete, QC-reviewed |
| 3 — Test Design | `test-design` v3.0 | 1 prompt, run twice (schema revision) | `test-design/test-design.csv` (27 cases) | ✅ Complete, QC-reviewed and filled (Valid in Scope / Needs Automation) |
| 4 — Test Execution | `test-execution` v1.0 | 1 prompt | `execution/execution-report.html` + evidence | ✅ Complete, 20 executed (20 PASS), 7 BLOCKED by policy, 1 defect (DEFECT-001) |
| 5 — Playwright Automation | `playwright-automation` v3.2 | 1 prompt + 1 test-design correction follow-up | `automation/tests/*.spec.ts` + `automation-execution-report.html` + `healing-log.md` | ✅ Complete — 14 PASS, 1 defect (regression probe) |
| 4 — Full Re-run | `test-execution` v1.0 | 1 prompt (sent twice, identical) | `execution/execution-report.html` + evidence (replaced) | ✅ Complete, superseded original evidence |
| 4 — DEFECT-002 Re-verification | `test-execution` v1.0 | 1 prompt + 1 continuation | `execution/execution-report.html` (TC-008 / DEFECT-002 only) | ✅ Complete, DEFECT-002 withdrawn; TC-008 PASS |
| 5 — Playwright Automation | `playwright-automation` v3.2 | 1 prompt | `automation/` (tests, report, healing log) | ✅ Complete, 15 cases automated |
| 5 — TC-020 Correction | `playwright-automation` v3.2 (+ `test-design` edit rule) | 1 prompt + 1 follow-up | `test-design/test-design.csv` (TC-020 row), `automation/reports/` | ✅ Complete, final run 14 PASS / 1 DEFECT (DEFECT-001 probe) |

**How to read this file:** each milestone section below contains the exact,
verbatim prompt text sent to Claude Code for that step — not a paraphrase.
Any follow-up/correction prompts are included immediately after the
milestone's main prompt, in the order they were actually sent. Full
supporting detail (actions taken, evidence, findings) lives in
`logs/session-log.md`, not here — this file is prompts only.

This file contains the **verbatim text** of every prompt sent to Claude
Code to complete Milestones 1–5, for team lead review. It complements
`logs/session-log.md`, which records what Claude Code *did* in response
to each prompt (actions, evidence, findings) — this file records exactly
what was *asked*.

Organized in the order the prompts were actually sent and run.

---

## Milestone 1 — PRD Generation

```
Use the prd-generation skill located at:

.claude/skills/prd-generation/SKILL.md

to complete Milestone 1 of the OrangeHRM Buzz QA project.

## Input

Application URL:

https://opensource-demo.orangehrmlive.com/

Detailed-scope module for this run: Buzz

## Objective

Generate a Product Requirements Document for the actual OrangeHRM instance available at the provided URL, following the skill's fixed 15-section structure exactly (Application Overview, System Actors, Modules, Authentication, Navigation, Module: Buzz, Functional Requirements, Business Rules, Data Requirements, Validation Rules, Error Handling, Dependencies, Out of Scope, Assumptions, Traceability & Sources).

The PRD must be based on:

1. The provided task requirements.
2. Direct observation of the live application.
3. Read-only navigation using the available Playwright MCP tools.

Do not rely on general knowledge of what OrangeHRM demos usually contain. Document only what can be verified from the provided requirements or directly observed on this instance. Anywhere direct evidence is missing — including in Data Requirements, Validation Rules, Error Handling, and Dependencies — write exactly `Unknown / Not observed`. Do not guess typical behavior for this type of application.

## Authentication

This instance publishes its own demo login credentials directly on the live login page — a standard OrangeHRM sandbox convention, not a secret you are inventing or sourcing elsewhere. Read the credentials shown on the login page itself (do not assume any value from training data) and use them to authenticate.

Do not:
- invent credentials that are not shown on the live login page
- write credential values into PRD.md, logs, or any audit record
- include credential values in screenshots or evidence
- reference credentials as anything other than "demo credentials shown on login page"

If no credentials are visible on the login page, record this as `Unknown / Not observed` and continue inspecting only what is reachable without authentication.

## Read-Only Inspection

Navigate the live application using Playwright MCP.

Allowed: open menus, navigate between pages, expand navigation sections, open modules/pages, read visible content, inspect page structure.

Do NOT: submit forms, create/edit/delete records, change application data, execute test scenarios, perform pass/fail assertions, generate test cases, generate automation, modify configuration.

If a page requires a data-changing action to continue exploration, do not perform it — mark the relevant PRD fields `Unknown / Not observed` and continue with the remaining safe areas.

Depth guardrail: inspect one level of child navigation per top-level module. If deeper nested pages exist, note their presence/labels without fully expanding them.

## Module Inventory (Section 3)

Use: `Module | Navigation Path | Purpose | Primary User Roles | Evidence`.

"Evidence" = the exact page title and URL/path actually observed (e.g. "Page title: 'Buzz' — path: /web/index.php/buzz/viewBuzz"). Never filled from inference.

Do not invent modules. If a visible module cannot be safely inspected, record it with Status: `Unknown / Not observed` and the reason.

## Buzz Handling (Section 6)

Buzz is the detailed testing scope for Milestone 2 (UI Exploration). For this PRD:
- Include Buzz in the Section 3 module inventory like every other module.
- Give it a dedicated but still high-level (non-deep-dive) treatment in Section 6.
- Do not generate detailed Buzz scenarios or test cases here.

## Traceability (Section 15)

Every FR and every module inventory row must trace to either a page/URL/date actually navigated, or a specific line from the provided task requirements. Use `Observation Date: YYYY-MM-DD`.

## Output

Save the final PRD to:

docs/PRD.md

Do not create diagrams during M1 — instead, before finishing, flag which PRD areas (e.g. Section 5 Navigation, Section 12 Dependencies) may benefit from a diagram later under deliverables/diagrams/. Only flag candidates, don't build them.

## Audit Trail

Before finishing, record this M1 run in the project's session log at logs/session-log.md (or the equivalent path if named differently — check .claude/skills/ for a prompt-logging skill first; if none exists, create logs/session-log.md now and note the fallback).

Record: skill used, prompt used, date/time, application URL, navigation/actions performed, MCP usage, output path, important assumptions, unresolved items, errors/limitations. Never record credential values.

## Final Validation (QC Gate)

Before completing M1, verify:
1. All major modules are identified.
2. Buzz is correctly identified and placed in Section 6, not deep-dived.
3. Requirements (Section 7) are functional, testable, and have stable FR IDs.
4. Business rules (Section 8) are separated from assumptions (Section 14).
5. Validations (Section 10) are documented from direct observation only.
6. Negative/error behaviors (Section 11) are documented, not invented.
7. No application data was created, edited, or deleted.
8. No test cases or automation were generated.
9. Every unknown is explicitly marked `Unknown / Not observed`.
10. Every module and FR is traceable (Section 15) to a real source.
11. Observation date and PRD version are recorded (Section 1).
12. The PRD was saved to docs/PRD.md.
13. The session/audit record was updated, or the logging limitation was documented.

After completing the work, provide a concise summary of:
- PRD output path
- Number of modules discovered
- Number of functional requirements created
- Count of items marked `Unknown / Not observed`, by section
- Diagram candidates
- Audit-log status
```

### Follow-up correction prompt (Section 5/7 coverage gap)

```
Small correction to docs/PRD.md, using the prd-generation skill's rules (no
new navigation, no new data-changing actions, no fabrication):

For every top-level module in Section 3 whose sub-navigation items were
listed in Section 5 but did NOT each receive their own FR in Section 7 (e.g.
Admin's Job, Organization, Qualifications, Nationalities, Corporate
Branding, Configuration — only "User Management" got an FR; similarly check
Leave, Time, and Performance for the same gap), add one addendum line per
module to Section 9 (Data Requirements) or Section 7, in this form:

"[Module] sub-items [list]: labels observed in navigation only (Section 5),
not deep-inspected in Milestone 1."

Do not invent any new detail about these sub-items beyond their label. Do
not perform any new navigation or data-changing actions. Update the
Traceability table in Section 15 to point these addendum lines back to
Section 5's original navigation observation. Save the updated docs/PRD.md
and add one line to logs/session-log.md noting this addendum and why it was
made (QC review flagged an inconsistency between Section 5 and Section 7
coverage).
```

---

## Milestone 2 — UI Exploration

```
Use the ui-exploration skill located at:

.claude/skills/ui-exploration/SKILL.md

to complete Milestone 2 of the OrangeHRM Buzz QA project.

## Inputs

Application URL: https://opensource-demo.orangehrmlive.com/
PRD file: docs/PRD.md (version 1.0, produced in Milestone 1)
Coverage scope for this run: Buzz only

## Objective

Deep-dive the Buzz module using the PRD's Section 6 (Module: Buzz) as your
starting map — verify it, extend it, and reconcile findings against it.
Follow the skill's Interaction Policy exactly: safe/reversible actions
(filters, expand/collapse, Like-then-Unlike where you confirm the reversal
succeeded) are allowed; creating new content (posting, commenting) is NOT
allowed even though the PRD flagged posting-flow details as unverified —
mark that gap explicitly rather than resolving it either direction.

## Output

Save to: docs/exploration-findings.md

Follow the skill's required 8-section structure exactly (Executive Summary,
Scope & Method, Screen-by-Screen Findings, Locator/Selector Reference Table,
Reconciliation vs. PRD, Excluded Actions & Why, Open Questions, Evidence
Index).

## Audit Trail

Record this run in logs/session-log.md, same convention as Milestone 1.

## Stop Condition

After saving the file, report the executive summary, every
`Unknown / Not exercised` item, and open questions — then stop. Do not
proceed to test case design.
```

### Follow-up cleanup prompt (evidence reorganization)

```
Housekeeping task, not a new exploration — no new browser navigation, no
new interactions, no new claims.

Move the 16 screenshot files currently sitting in the project root
(buzz-before-readmore.png, buzz-sania-truncated.png,
buzz-sania-expanded.png, buzz-top-after-expand.png,
buzz-first-post-actions.png, buzz-liked-state.png,
buzz-comments-expanded.png, buzz-comments-collapsed-check.png,
buzz-post-options-menu.png, buzz-sania-options-menu.png,
buzz-rebecca-options-menu.png, buzz-image-click.png,
buzz-share-photos-click.png, buzz-share-icon-click.png,
buzz-help-button.png, buzz-feed-bottom.png) into a new folder:

docs/evidence/exploration/

Then update every reference to these filenames in docs/exploration-findings.md
(throughout the document, including the Evidence Index in Section 8) to
point to the new path (docs/evidence/exploration/<filename>). Do not change
any other content in exploration-findings.md.

Add one line to logs/session-log.md noting this reorganization and why
(repo root was cluttered with evidence files; moved to a dedicated folder
for readability, no content changes).
```

---

## Milestone 3 — Test Design

```
Use the test-design skill located at:

.claude/skills/test-design/SKILL.md

to complete Milestone 3 of the OrangeHRM Buzz QA project.

## Inputs

Application URL: https://opensource-demo.orangehrmlive.com/
PRD file: docs/PRD.md (version 1.0)
Exploration findings file: docs/exploration-findings.md
Module/scope for this run: Buzz

## Objective

Generate a traceable test-case suite for the Buzz module, grounded entirely
in docs/PRD.md and docs/exploration-findings.md. Pay particular attention to:

- The BR-005 permission pattern from exploration §3.9 (Edit Post on own
  post only, Delete Post on any post): a positive case confirming the
  observed UI behavior, plus a separate hypothesis case (Source =
  "Exploration — Excluded Action") for the unconfirmed server-side
  enforcement question raised in exploration §7 Open Questions.
- The Share Video vs. Share Photos validation asymmetry from exploration
  §3.4 (Share button not disabled despite empty Video URL): this is a
  concrete defect candidate and needs its own Negative-type case with a
  precise Source citation.
- Exploration's "Excluded Actions & Why" table (§6): judge each row per
  the skill's Hard rules — meaningful ones (posting, commenting) become
  hypothesis cases; deliberately-excluded ones (Delete Post on shared
  demo data) do not become cases, just get listed in your final report.
- The sort tie-break inconsistency between "Most Liked Posts" and "Most
  Commented Posts" (exploration §3.5) — a case worth capturing even though
  it's a minor finding, since it's concrete confirmed behavior.

## Output

Save to: test-design/test-design.csv

[Note: this prompt was run twice — once producing the original 15-column
schema (v2.1: TC ID, Module, Test Type, Title, Requirement ID,
Preconditions, Test Steps, Test Data, Expected Result, Priority, Severity,
Source, Valid in Scope, Needs Automation, Comments), and again after the
QC lead decided to simplify to a 12-column schema (v3.0: dropping
Requirement ID, Source, and Comments, folding brief evidence attribution
inline into Preconditions/Expected Result instead). The regeneration
prompt repeated the same objective above against the updated skill.]

Use the skill's required column set exactly, with Valid in Scope and
Needs Automation left empty on every row.

## Audit Trail

Record this run in logs/session-log.md, same convention as prior milestones.

## Stop Condition

Follow the skill's stop condition exactly: report total case count, counts
by Type, self-review fix/drop count, and anything from the PRD/exploration
that could not be turned into a test case. Then stop — do not execute
anything, do not begin automation, and do not populate Valid in Scope or
Needs Automation.
```

### Human QC review (not a prompt — manual step)

All 27 rows reviewed in Excel by the QC lead:
- `Valid in Scope`: marked `Yes` for all 27 rows.
- `Needs Automation`: marked `Yes` for 15 rows, `No` for 12 — including a
  correction where 6 hypothesis cases (BUZZ-TC-021–026, which require
  publishing content to the shared public demo) were changed from an
  initial `Yes` to `No`, since automating them would create permanent
  content on a shared environment every time the suite ran.

---

## Milestone 4 — Test Execution

```
Use the test-execution skill located at:

.claude/skills/test-execution/SKILL.md

to complete Milestone 4 of the OrangeHRM Buzz QA project.

## Inputs

Application URL: https://opensource-demo.orangehrmlive.com/
Test design CSV: test-design/test-design.csv (27 rows, all Valid in Scope = Yes)
PRD: docs/PRD.md
Exploration findings: docs/exploration-findings.md

## Objective

Execute BUZZ-TC-001 through BUZZ-TC-020 live via Playwright MCP. Mark
BUZZ-TC-021 through BUZZ-TC-027 as BLOCKED — excluded by interaction
policy without attempting them, since they require publishing content
(post, photo, video, comment, repost) or editing another user's data on
this shared public demo instance, per the skill's Interaction Policy. Do
not ask for authorization again — this has already been decided: they stay
BLOCKED for this run.

For BUZZ-TC-019 specifically (Share Video button-disabled-state check):
this one only observes the button's enabled/disabled state and does NOT
click Share, so it is directly executable, not excluded.

For every state-changing action you do perform (Like, Comment toggle,
expand/collapse, etc.), reverse it immediately after and confirm the
reversal succeeded, per the skill's Hard rules.

## Output

Save the HTML report to: execution/execution-report.html
Save evidence screenshots to: execution/evidence/

## Audit Trail

Record this run in logs/session-log.md, same convention as prior milestones.

## Stop Condition

Follow the skill's stop condition: report summary counts (executed/PASS/
PASS†/FAIL/BLOCKED), formal defects, and exit assessment. Then stop — do
not begin automation.
```

---

### Milestone 4 — Full Re-run (superseding evidence)

```
Use the test-execution skill located at:

.claude/skills/test-execution/SKILL.md

to re-run Milestone 4 of the OrangeHRM Buzz QA project from scratch.

## Inputs

Application URL: https://opensource-demo.orangehrmlive.com/
Test design CSV: test-design/test-design.csv (27 rows, all Valid in Scope = Yes)
PRD: docs/PRD.md
Exploration findings: docs/exploration-findings.md

## Objective

This is a full fresh re-execution, replacing the previous run entirely.

Execute BUZZ-TC-001 through BUZZ-TC-020 live via Playwright MCP. Mark
BUZZ-TC-021 through BUZZ-TC-027 as BLOCKED — excluded by interaction
policy without attempting them, since they require publishing content
(post, photo, video, comment, repost) or editing another user's data on
this shared public demo instance, per the skill's Interaction Policy.

For BUZZ-TC-019 specifically (Share Video button-disabled-state check):
this one only observes the button's enabled/disabled state and does NOT
click Share, so it is directly executable, not excluded.

For every state-changing action you do perform (Like, Comment toggle,
expand/collapse, etc.), reverse it immediately after and confirm the
reversal succeeded, per the skill's Hard rules.

## Output — overwrite existing

Delete the contents of execution/evidence/ and overwrite
execution/execution-report.html entirely with this fresh run's results —
do not merge with or reference the previous run's evidence/screenshots.

## Audit Trail

Add a new entry to logs/session-log.md for this re-run (do not delete the
prior Milestone 4 entry — keep both, clearly dated, so the history of a
re-run is visible). Note explicitly that this replaces the previous
execution-report.html and evidence set.

## Stop Condition

Follow the skill's stop condition: report summary counts (executed/PASS/
PASS†/FAIL/BLOCKED), formal defects, and exit assessment — and note any
differences from the previous run's results if you're able to recall or
infer them (e.g. new DEFECT-001 status, different Like counts due to
shared-demo drift). Then stop.
```

- Sent twice with identical text (2026-09-22, 12:33 and 12:50 UTC). The
  second send is the run that produced the current report and evidence.

---

### DEFECT-002 Targeted Re-verification

```
Targeted re-verification of DEFECT-002 only (TC-008, Like toggle) — not a
full re-run.

The QC lead just manually clicked the Like heart on the "manda akhil user"
post (the original 2020-08-10 baseline post, same batch as the Sania
Shaheen post this defect was tested against) and observed the count
change live in her own browser (0→1 or 1→0). This directly contradicts
DEFECT-002's finding that Like is completely non-functional.

Re-investigate specifically:
1. Take a fresh accessibility snapshot of the manda akhil user post's Like
   control. Compare its actual accessible role/name/structure against
   whatever locator strategy was used in the original DEFECT-002 attempts.
2. Attempt the Like click on this exact post using a role-based locator
   (getByRole/accessible name) rather than any ID or icon-structure-based
   selector, and check whether the count changes and whether a network
   request fires this time.
3. If it now works: the likely root cause is that the automation's locator
   was targeting stale/wrong markup (per the heart-svg → Bootstrap icon
   change already noted in the report), not a real product defect. State
   this plainly and prepare to RETRACT DEFECT-002 from the execution
   report, replacing it with a note explaining it was a tooling/locator
   false positive, not a confirmed product defect.
4. If it still fails even with a corrected locator: DEFECT-002 stands as a
   real defect, but note precisely what locator strategy was used both
   times so we understand why manual clicking succeeds where automation
   doesn't.

Remember to reverse the Like back to its original state and confirm the
reversal, per the skill's Hard rules. Report findings and update
execution/execution-report.html and logs/session-log.md accordingly, but
do not touch any other test case's results.
```

### Follow-up (same session, continuation)

```
Continue the DEFECT-002 targeted re-verification for TC-008 (Like toggle) on the manda akhil user post.
```

---

## Milestone 5 — Playwright Automation

```
Use the playwright-automation skill located at:

.claude/skills/playwright-automation/SKILL.md

to complete Milestone 5 of the OrangeHRM Buzz QA project.

## Inputs

Application URL: https://opensource-demo.orangehrmlive.com/
Test design CSV: test-design/test-design.csv, filtered to Needs Automation = Yes (15 cases)
Milestone 4 execution report: execution/execution-report.html (final version — 16 PASS, 2 PASS†, 1 FAIL, 8 BLOCKED, 1 open defect: DEFECT-001; DEFECT-002 was investigated and withdrawn as a test-targeting error)
PRD: docs/PRD.md
Exploration findings: docs/exploration-findings.md

## Objective

Follow the skill exactly, including Pre-Automation Inspection first. Use
the execution report as source of truth per the skill's precedence rules.
Build DEFECT-001's Regression Probe checking only the Share Video button's
disabled state (never click Share). Tag every test with its scheduling
tier. Run the credential-leak grep check before finishing.

## Output

Test code: automation/tests/
Page objects: automation/pages/
Shared helpers: automation/utils/
HTML report: automation/reports/automation-execution-report.html
Healing log: automation/reports/healing-log.md

## Audit Trail

Record this run in logs/session-log.md, same convention as prior milestones.

## Stop Condition

Follow the skill's stop condition exactly.
```

---

### Follow-up correction prompt (TC-020 test-design defect fix)

```
Update test-design/test-design.csv, row TC-020 only: correct its Expected
Result to reflect the actual confirmed tie-break behavior found in
Milestone 4 (both "Most Liked Posts" and "Most Commented Posts" use the
same secondary sort key for genuinely tied posts — ascending chronological
order — rather than "ordering tied posts differently from each other").
Do not touch any other column or row, and do not touch Valid in Scope or
Needs Automation. This is a genuine test-design defect correction, per the
test-design skill's explicit exception to its own "don't edit after
execution" rule. Then re-run TC-020 in the playwright-automation suite
against the corrected expectation, update the automation report/healing
log accordingly, and commit/push everything together.
```

### Follow-up (TC-020 Title)

```
Also update TC-020's Title to match the corrected Expected Result (e.g.
"'Most Liked' and 'Most Commented' use the same tie-break order" instead
of "...order differs"), since leaving the old title would directly
contradict the corrected row. Record this as part of the same QC-approved
correction in the healing log.
```

---

## Notes on process

- Every prompt above references a **skill** (`.claude/skills/<name>/SKILL.md`)
  rather than embedding methodology inline — the skills are the reusable,
  general-purpose part (per task Hint 3); the prompts above are the
  per-run parameters (URL, scope, which milestone's inputs to use).
- Several skills went through review/revision cycles before the prompt
  above was sent against their final version — see `logs/session-log.md`
  and the skill files' own version history (`prd-generation` v1→v1 final,
  `ui-exploration` v1→v2, `test-design` v2.1→v3.0, `test-execution` v1.0)
  for what changed and why.
