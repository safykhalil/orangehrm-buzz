# Prompts Archive — OrangeHRM Buzz QA Project

## Executive Summary (for reviewer)

| Milestone | Skill Used | Prompt(s) Sent | Output | Status |
|---|---|---|---|---|
| 1 — PRD Generation | `prd-generation` v1.0 | 1 initial + 1 correction | `docs/PRD.md` | ✅ Complete, QC-reviewed |
| 2 — UI Exploration | `ui-exploration` v2.0 | 1 initial + 1 cleanup | `docs/exploration-findings.md` | ✅ Complete, QC-reviewed |
| 3 — Test Design | `test-design` v3.0 | 1 prompt, run twice (schema revision) | `test-design/test-design.csv` (27 cases) | ✅ Complete, QC-reviewed and filled (Valid in Scope / Needs Automation) |
| 4 — Test Execution | `test-execution` v1.0 | 3 prompts total (initial + full re-run + DEFECT-002 targeted re-verification) | `execution/execution-report.html` + evidence | ✅ Complete — 22 PASS, 2 PASS†, 1 FAIL, 2 BLOCKED (TC-014 tooling, TC-027 cross-account question only), 0 confirmed functional defects (DEFECT-001 reclassified 2026-09-28 as a UX inconsistency; BUZZ-TC-021-026 formally reclassified from policy-BLOCKED to PASS on 2026-09-28 after a QC-authorized live verification pass); DEFECT-002 investigated and withdrawn |
| 5 — Playwright Automation | `playwright-automation` v3.2 | 1 prompt + 1 test-design correction follow-up | `automation/tests/*.spec.ts` + `automation-execution-report.html` + `healing-log.md` | ✅ Complete — 14 PASS, 1 defect (regression probe) |
| Post-M5 follow-ups (2026-09-28) | — (QC-directed; no new skill run) | 10 prompts: 8-step QC-authorized live verification + 2 authorization messages, then 7 documentation/tooling updates (see "Post-Milestone 5 follow-ups") | `execution/execution-report.html`, `test-design/test-design.csv`, `automation/reports/automation-execution-report.html`, `automation/utils/build-report.js`, `logs/session-log.md` | ✅ Complete — DEFECT-001 reclassified as a UX inconsistency; BUZZ-TC-021–026 BLOCKED → PASS; TC-027 partially closed (self-edit confirmed, cross-account still BLOCKED) |

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
Milestone 4 execution report: execution/execution-report.html (final version — 22 PASS, 2 PASS†, 1 FAIL, 2 BLOCKED (TC-014 tooling, TC-027 cross-account question only), 0 confirmed functional defects (DEFECT-001 reclassified 2026-09-28 as a UX inconsistency; BUZZ-TC-021-026 formally reclassified from policy-BLOCKED to PASS on 2026-09-28 after a QC-authorized live verification pass); DEFECT-002 was investigated and withdrawn as a test-targeting error)
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

## Post-Milestone 5 follow-ups (2026-09-28)

Dated follow-ups sent after Milestone 5 was complete, in the order they
were actually sent. Each prompt below was copied verbatim from the saved
Claude Code session files (only the paste wrapper and IDE file-open
notices were removed). Short operational messages sent in the same
sessions ("push", a manual `git add/commit/push` line, and the file-rename
requests for the Excel summary and pipeline diagram) are not included.
Times are UTC.

### QC-authorized live verification — 8 steps (BUZZ-TC-021–027, incl. BUZZ-TC-024 / DEFECT-001 check)

- Sent 2026-09-28 04:04 UTC. The one-time, scoped policy override. Step 8 is the DEFECT-001 live re-verification for BUZZ-TC-024 (empty Video URL, network requests monitored); steps 1–7 cover TC-021, TC-027 (self-edit), TC-025, TC-026, TC-022 and TC-023, with cleanup.

```
Explicit, scoped, one-time authorization from the QC lead: perform the
following actions live against
https://opensource-demo.orangehrmlive.com/web/index.php/buzz/viewBuzz.
This overrides the Interaction Policy's default exclusion for these
specific actions only. Do not perform any action beyond what's listed
here. Log in with the demo credentials shown on the login page (do not
record the values).

## Step 0 — Cleanup pre-existing manual test posts

Find and delete these two posts (created during the QC lead's own manual
testing, not part of this run): "QA team shipped the 0813 leave flow
693679" and "QA team shipped the 0813 leave flow 610494". Screenshot
before and after confirming both are gone.

## Step 1 — TC-021: publish a text post

Post exactly: "All code is guilty until proven innocent." Screenshot
confirming it appears in the feed. Keep this post — it will be reused for
steps 2-4 below before final cleanup.

## Step 2 — TC-027: edit that same post

Use the post's own "..." menu → Edit. Append " (edited)" to the text so
it reads: "All code is guilty until proven innocent. (edited)". Screenshot
confirming the edited text is reflected in the feed.

## Step 3 — TC-025: add a comment to that same post

Add exactly this comment: "Quality first, always." Screenshot confirming
the comment appears under the post.

## Step 4 — TC-026: repost that same post

Use the Share/repost icon on that post to create a repost. Screenshot
confirming the repost appears in the feed as a separate entry.

## Step 5 — Cleanup steps 1-4

Delete the repost created in Step 4, then delete the original post from
Step 1 (this also removes its edit history and comment). Screenshot
confirming both are gone from the feed.

## Step 6 — TC-022: share a photo

Open Share Photos, upload the local file at:
C:\Users\hp\Downloads\Testing-image.png
Submit. Screenshot confirming the post with the image appears. Then
delete this post via its own "..." menu. Screenshot confirming it's gone.

## Step 7 — TC-023: share a video with a valid URL

Open Share Video, enter any well-formed http(s) video URL in the Video
URL field (your choice, doesn't need to actually embed), submit.
Screenshot confirming the post appears. Then delete this post. Screenshot
confirming it's gone.

## Step 8 — TC-024: DEFECT-001 verification (critical, do this carefully)

Open Share Video, leave the Video URL field completely empty. Before
clicking Share, start monitoring network requests. Click Share. Record:
(a) does a "Required" inline validation message appear, (b) does any
POST/network request actually fire when Share is clicked, (c) does a new
post actually appear in the feed afterward, or not.

If NO post is created and NO network request fires: this means the
Video URL field's validation does work (just via an inline message rather
than disabling the button) — report this clearly, since it may mean
DEFECT-001 should be reclassified as "not a defect / different but valid
validation pattern" rather than withdrawn defect status changed
unilaterally by you — flag this for QC decision, do not change the
execution report yourself.

If a post IS created despite the empty field: this confirms DEFECT-001 as
a real defect (the validation message is cosmetic and doesn't actually
block submission). Delete that post immediately and screenshot
confirming it's gone.

Either way, take a screenshot of the "Required" message state before
concluding.

## Final report

For each step, state clearly: what was posted/edited/commented/reposted,
confirmation screenshots for both the action and its cleanup, and for
Step 8 specifically, the precise technical finding (network request
fired or not, post created or not) — do not just say "not a defect,"
show the evidence and let me (QC) make the final call on DEFECT-001's
status.

Do not modify test-design/test-design.csv, execution-report.html,
automation/ files, or logs/session-log.md as part of this — this is a
one-off live verification, not a formal milestone re-run. Just report
back with the findings and screenshots.
```

### Follow-up (QC-lead authorization: "go")

- Sent 2026-09-28 04:06 UTC.

```
go

Confirming: yes, this is explicit QC-lead authorization to run all 8
steps live now, exactly as specified. Delete-by-exact-text-match only for
Step 0, per your proposal — if either post isn't found, report it and
move on, don't delete anything similar-looking. Proceed.
```

### Follow-up (QC-lead authorization: "confirmed, run it")

- Sent 2026-09-28 04:07 UTC.

```
confirmed, run it
```

### Formal DEFECT-001 reclassification (execution report + session log)

- Sent 2026-09-28 04:23 UTC.

```
Formal update to execution/execution-report.html and logs/session-log.md,
based on the QC-approved live verification of DEFECT-001 (TC-024, run
outside the repo per the QC lead's one-time authorization).

## 1. Copy evidence into the repo

Copy these screenshots from the scratchpad
(C:\Users\hp\AppData\Local\Temp\claude\d--orangehrm-buzz\27f439d4-b4d5-4893-8e29-89e82cecc6d1\scratchpad\shots\)
into execution/evidence/, renamed with a TC-024_R1_ prefix for clarity:

- step8_empty_url_before_click.png -> TC-024_R1_01_empty_url_before_click.png
- step8_required_message_after_click.png -> TC-024_R1_02_required_message_after_click.png
- step8_feed_after.png -> TC-024_R1_03_feed_unchanged_after.png

Also copy step8_network.json (the empty network log) to
execution/evidence/TC-024_R1_network_log.json as supporting raw evidence.

## 2. Update execution-report.html

In DEFECT-001's formal defect entry, do NOT delete or overwrite the
original finding (same principle as DEFECT-002's earlier
withdrawal-with-audit-trail). Instead, add a dated addendum directly
below the original defect writeup, titled "Re-verification and
reclassification (live, QC-authorized)", containing:

- What was re-verified: whether clicking Share with an empty Video URL
  field actually submits/creates a post.
- Method: a live, one-time QC-authorized action (not part of a formal
  milestone re-run), monitoring network requests for 6 seconds after the
  click, then reloading the feed to check for a new post.
- Result: the Share button remains clickable (confirming the original
  finding stands as observed), but clicking it with an empty field
  triggers an inline "Required" validation message, fires zero network
  requests, and creates no post. The originally-suspected risk — that
  invalid/empty-URL video posts could be submitted — does not occur.
- QC decision: reclassify DEFECT-001 from "confirmed functional defect"
  to "UX inconsistency, not a functional defect" — the two Share dialogs
  (Photos vs. Video) use different but each individually valid
  client-side validation patterns (proactive disable vs. block-on-submit
  with inline message); neither allows actually-invalid data through.
- Residual open item, explicitly flagged as NOT verified: whether the
  server itself would independently reject an empty Video URL if called
  directly (bypassing the UI) was not tested — this was outside the
  scope of what was authorized (UI-level testing only, no direct API
  calls). Note this as a possible follow-up, not a current concern.
- Reference the three copied screenshots and the network log by their
  new evidence/ paths.

Update the report's summary/defects-count area if it distinguishes
"confirmed functional defects" from other findings, to reflect that
there is now 0 confirmed functional defects and 1 UX inconsistency
(reclassified), rather than 1 open defect — but do not change the
underlying FAIL/PASS badge on TC-019 itself, since that badge reflects
what was literally observed at that time; add a note next to it pointing
to this addendum for the current classification.

## 3. Update session log

Add an entry documenting this live verification run: date/time, what was
authorized (steps 0-8 as previously agreed with the QC lead), the exact
DEFECT-001 finding and reclassification, confirmation that steps 0-7's
created content was all cleaned up (feed returned to its original 5
posts, IDs unchanged), and a note that the two pre-existing "QA team
shipped..." posts mentioned by the QC lead were searched for by exact
text and not found (feed appeared freshly reset) - so nothing was deleted
in Step 0.

## 4. Flag for later, do not do this now

Add a short note (in the session log entry) that Milestone 5's automation
report and its DEFECT-001 regression probe (automation/reports/ and
automation/tests/defect-001.regression-probe.spec.ts) still describe
DEFECT-001 as a fully open functional defect and have not yet been
updated to reflect this reclassification - flagged as a follow-up item
for a future, separate review, not changed as part of this update.

Do not modify test-design/test-design.csv or any file under automation/
as part of this. Show me a summary of exactly what changed in
execution-report.html and session-log.md, then commit and push.
```

### Milestone 5 documentation update — DEFECT-001 reclassification carried into the automation report and regression probe

- Sent 2026-09-28 04:31 UTC.

```
Documentation update to automation/reports/automation-execution-report.html
and automation/tests/defect-001.regression-probe.spec.ts, reflecting the
DEFECT-001 reclassification confirmed on 2026-09-28 in
execution/execution-report.html. This is a documentation/comment update
only — do not re-run the automation suite, do not change the probe's
actual assertion logic (it should still assert the button is enabled,
since that fact is unchanged and still true).

## 1. Update the regression probe file's header comment

In defect-001.regression-probe.spec.ts, update the header comment/banner
text to note: "DEFECT-001 was reclassified on 2026-09-28 from 'confirmed
functional defect' to 'UX inconsistency, not a functional defect' — see
execution/execution-report.html's addendum for full detail. Live
verification confirmed clicking Share with an empty Video URL fires zero
network requests and creates no post; the button remains clickable, but
no invalid data is ever actually submitted. This probe still checks the
button's enabled state (that fact is unchanged and still true) — it is
kept as a lightweight UI-consistency check, not because it still
represents a functional risk." Do not change the assertion itself.

## 2. Update the automation execution report

In automation-execution-report.html, find wherever DEFECT-001 is
described as an open/confirmed functional defect and add a brief, dated
note (2026-09-28) pointing to the reclassification and to
execution/execution-report.html's addendum for full detail, using the
same "kept for audit, not deleted" principle already used elsewhere in
this project — do not delete or rewrite the original wording, add a note
alongside it.

## 3. Record this in the session log

Add a short entry noting this documentation-only update and that no
automation was re-run.

Show me exactly what changed, then commit and push.
```

### BUZZ-TC-027 partial closure (documentation only)

- Sent 2026-09-28 04:53 UTC.

```
Documentation update to execution/execution-report.html and
logs/session-log.md, closing out TC-027 based on evidence already
gathered in the earlier QC-authorized live run (2026-09-28). No new
live actions needed — this is a documentation-only closure.

## Update execution-report.html

Find TC-027's entry in the BUZZ-TC-021–027 BLOCKED section. Add a dated
addendum below it, titled "Partial closure (2026-09-28)", containing:

- What was confirmed: during the earlier QC-authorized live run, editing
  one's own post (create post -> edit via "..." menu -> Edit Post) was
  exercised and succeeded, confirmed by the server response and a page
  reload (see the TC-021/TC-027 steps already logged in
  logs/session-log.md's DEFECT-001 re-verification entry).
- What remains unconfirmed: whether the server independently blocks a
  *different* authenticated account from editing another account's post.
  This specific cross-account authorization check was not performed —
  it would require either a second real demo account or creating a
  temporary one, which the QC lead decided not to pursue at this time.
- QC decision: TC-027 stays classified BLOCKED for the cross-account
  question specifically, with the self-edit sub-question now separately
  confirmed working. This is a deliberate, explicit scope boundary, not
  an oversight.

## Update session-log.md

Add a short entry noting this documentation-only closure decision for
TC-027, referencing the earlier live-run evidence rather than describing
any new action.

Do not modify test-design/test-design.csv, automation/ files, or any
evidence screenshots. Show me exactly what changed, then commit and push.
```

### Formal reclassification of BUZZ-TC-021–026 from policy-BLOCKED to PASS

- Sent 2026-09-28 04:59 UTC.

```
Formal reclassification of BUZZ-TC-021, 022, 023, 024, 025, 026 from
policy-BLOCKED to real PASS/FAIL results, based on evidence already
gathered in the QC-authorized live run (2026-09-28). No new live actions
- this uses existing evidence only.

## Step 1 — Correct the 6 Expected Result cells in test-design.csv (genuine
test-design corrections, same category as C-01/TC-020)

- BUZZ-TC-021: "Confirmed live: publishing a text post via the composer
  succeeds; the post appears in the feed with the submitted text."
- BUZZ-TC-022: "Confirmed live: uploading a photo via Share Photos and
  submitting succeeds; the post appears in the feed with the image
  attached. No format/size validation issue was encountered with the
  test file used."
- BUZZ-TC-023: "Confirmed live: submitting Share Video with a valid URL
  succeeds; the post appears in the feed with the video."
- BUZZ-TC-024: "Confirmed live: submitting Share Video with an empty URL
  does NOT create a broken/empty post and does NOT silently no-op or
  server-error - the client blocks submission with a visible inline
  'Required' message and fires zero network requests. This resolves the
  BUZZ-TC-019 defect candidate: no invalid data is ever actually
  submitted (see DEFECT-001's reclassification to 'UX inconsistency' in
  execution-report.html)."
- BUZZ-TC-025: "Confirmed live: submitting a comment succeeds; the
  comment appears under the post and the comment count updates."
- BUZZ-TC-026: "Confirmed live: submitting a repost via Share Post
  succeeds; the repost appears as its own feed entry, and the original
  post's Share count updates."

Do not touch Valid in Scope, Needs Automation, or any other column/row.

## Step 2 — Copy evidence screenshots into the repo

Copy the relevant screenshots from the scratchpad
(C:\Users\hp\AppData\Local\Temp\claude\d--orangehrm-buzz\27f439d4-b4d5-4893-8e29-89e82cecc6d1\scratchpad\shots\)
into execution/evidence/, prefixed TC-0NN_R1_ to match this project's
existing naming convention (e.g. step1_post_published.png ->
TC-021_R1_01_post_published.png). Use your judgment on which of the
already-listed screenshots best evidence each TC ID's creation step
specifically (not necessarily the cleanup/deletion screenshots, unless
useful).

## Step 3 — Rewrite execution-report.html

Move BUZZ-TC-021 through 026 OUT of the grouped "BLOCKED (interaction-
policy exclusion)" section and give each its own individual <details>
entry, in the same format/style as TC-001-020, with:
- Result badge: PASS for all 6 (per the confirmed evidence above).
- Steps taken, actual result, and evidence screenshot references (the
  newly-copied files from Step 2).
- A note on each that this was executed under a QC-authorized, one-time
  policy override on 2026-09-28 (not part of the original read-only-style
  formal run), with immediate cleanup performed (each created post/
  comment/repost was deleted afterward, confirmed via API response and
  feed reload - already documented in logs/session-log.md).

TC-027 stays in the BLOCKED section (unchanged, already has its partial-
closure addendum). TC-014 stays as its own individual PASS/FAIL/BLOCKED
entry, unchanged (historical tooling-limitation record).

Update the summary count cards to reflect the new totals (should become:
22 PASS, 2 PASS†, 1 FAIL, 2 BLOCKED - TC-014 tooling + TC-027 cross-
account question only). Update the Exit Assessment section to reflect
that policy-blocked coverage was later extended via QC-authorized live
verification, with a pointer to logs/session-log.md's 2026-09-28 entries
for the full run detail.

Do NOT delete anything - if useful, add a brief historical note that
these 6 were originally BLOCKED in the initial formal run and were later
authorized and executed in a follow-up QC-authorized pass on 2026-09-28,
consistent with how Milestone 4's own re-run (Run 1 vs Run 2) was
handled elsewhere in this report.

## Step 4 — Update session-log.md

Add a short entry noting this formal reclassification: which TC IDs
changed status, that no new live actions were taken (reusing existing
2026-09-28 evidence), and the new summary totals.

Show me the final summary card numbers and the list of TC IDs with their
new badges, then commit and push.
```

### Consistency fixes — TC-001 note in the automation report and stale Milestone 4 counts in this archive

- Sent 2026-09-28 05:14 UTC.

```
Two small consistency fixes, documentation only.

## 1. automation/reports/automation-execution-report.html

Find the TC-001 entry's "Expected (test-design CSV)" text, which currently
says "...typing/publishing behavior not exercised (see BUZZ-TC-021,
requires live confirmation)." Update it to: "...typing/publishing
behavior not exercised by this automation run (TC-021 was separately
confirmed live and reclassified to PASS on 2026-09-28 - see
execution/execution-report.html; this automation still does not exercise
publishing, per its Needs Automation = No classification for that case)."

## 2. .claude/prompts/prompts-archive.md

Two places currently say "16 PASS, 2 PASS†, 1 FAIL, 8 BLOCKED, 1 open
defect (DEFECT-001)" - these are now stale:
- The Executive Summary table's Milestone 4 row.
- The Milestone 4 prompt block's "Milestone 4 execution report:" input
  line.

Update both to: "22 PASS, 2 PASS†, 1 FAIL, 2 BLOCKED (TC-014 tooling,
TC-027 cross-account question only), 0 confirmed functional defects
(DEFECT-001 reclassified 2026-09-28 as a UX inconsistency; BUZZ-TC-021-
026 formally reclassified from policy-BLOCKED to PASS on 2026-09-28
after a QC-authorized live verification pass)."

Show me a diff of exactly these changes, then commit and push.
```

### Follow-up (TC-001 CSV source correction + report rebuild)

- Sent 2026-09-28 05:16 UTC.

```
Update the source too, so the fix survives a rebuild.

In test-design/test-design.csv, TC-001's Expected Result cell currently
references "(see BUZZ-TC-021, requires live confirmation)". Update just
that parenthetical to: "(TC-021 was separately confirmed live and
reclassified to PASS on 2026-09-28 - see execution/execution-report.html)".
Do not change anything else in that cell or any other row/column.

Then run `npm run report` to regenerate automation-execution-report.html
from the corrected CSV, and confirm the TC-001 entry now shows the
updated wording automatically (not hand-edited again).

Show me the diff of test-design.csv, then commit and push.
```

### Follow-up (build-report.js: generate the DEFECT-001 notes via DEFECT_001_RECLASSIFICATION)

- Sent 2026-09-28 05:17 UTC.

```
Go with option 1: add the DEFECT-001 reclassification notes to
utils/build-report.js itself, so they're generated automatically and
survive any future rebuild - this closes out the technical debt already
flagged in logs/session-log.md's earlier entry about this exact risk.

Add logic to the generator that outputs the same four notes that were
previously hand-edited into the report:
1. The "Reclassified" line on the regression-probe tier card.
2. The dated update note in the TC-019 result.
3. The "Reclassified 2026-09-28" row under Formal Defects Status.
4. The note in the Automation Health "Surfaced real defects" cell.

These can be driven by a simple, clearly-labeled constant/config in the
script (e.g. a DEFECT_001_RECLASSIFICATION note object) rather than
hardcoded scattered strings, so a future defect status change is a
one-place edit, not a hunt through the template.

Then:
1. Regenerate the report with `npm run report`.
2. Confirm all four notes are present again AND the corrected TC-001
   wording is present (both together, not one or the other).
3. Commit the CSV, build-report.js, and the regenerated report together
   in one commit.
4. Add a line to logs/session-log.md closing out the previously-flagged
   "rebuild would silently remove the notes" risk, referencing this fix.

Show me the final report's relevant sections (TC-001, the four notes) to
confirm both survived together, then push.
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

---

## Deliverables (a) and (b) — built directly, not via Claude Code prompts

Unlike Milestones 1-5, the Excel summary (deliverable a,
deliverables/QA-Pipeline-Milestone-Summary.xlsx) and the pipeline diagram
(deliverable b, diagrams/pipeline-flowchart.html) were generated directly
in the Claude.ai chat session used to plan and review this project,
using its own code-execution tools — not by sending a prompt to Claude
Code in this repo's terminal. There is no corresponding prompt to log for
these two deliverables; their content was authored directly from the
project's existing artifacts (PRD, exploration findings, test design CSV,
execution report, automation report, and this session log) already
committed to this repo at the time.
