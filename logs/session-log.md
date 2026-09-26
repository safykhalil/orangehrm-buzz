# Session Log

> No project-specific prompt-logging skill was found under `.claude/skills/` (all sibling skill directories — `playwright-automation`, `test-design`, `test-execution`, `ui-exploration` — are currently empty). This file is created as the **fallback** audit log per the M1 task instructions, at `logs/session-log.md`.

---

## Entry: Milestone 1 — PRD Generation (Buzz scope)

- **Date/Time:** 2026-09-19 (session timestamps ~11:27–11:39 UTC per Playwright MCP trace files)
- **Skill used:** `prd-generation` (`.claude/skills/prd-generation/SKILL.md`)
- **Note:** The skill file was found deleted from the working tree at session start (still present in git history from the initial commit). It was restored via `git checkout -- .claude/skills/prd-generation/SKILL.md` before invocation, since the run depends on it and the working tree had no other uncommitted changes.
- **Prompt used:** M1 task prompt instructing generation of a 15-section PRD for the OrangeHRM live demo instance, with Buzz as the detailed-scope module for Milestone 2, read-only Playwright MCP navigation only, and the `Unknown / Not observed` policy for any unverified claim.
- **Application URL:** https://opensource-demo.orangehrmlive.com/
- **Detailed-scope module:** Buzz

### Navigation / actions performed (read-only, via Playwright MCP)

1. Navigated to the login page; read the demo Username/Password displayed on the page itself (values not recorded anywhere in this log or the PRD).
2. Logged in with those demo credentials; landed on Dashboard (`/web/index.php/dashboard/index`).
3. Read the persistent sidebar to enumerate all 12 top-level modules.
4. Visited and inspected (one level of sub-navigation each): Admin (`viewSystemUsers`), PIM (`viewEmployeeList`), Leave (`viewLeaveList`), Time (`viewEmployeeTimesheet`), Recruitment (`viewCandidates`), My Info (`viewPersonalDetails`), Performance (`searchEvaluatePerformanceReview`), Directory (`viewDirectory`), Claim (`viewAssignClaim`), Buzz (`viewBuzz`).
5. Visited Maintenance (`viewMaintenanceModule` → `purgeEmployee`) and encountered an "Administrator Access" re-authentication interstitial for a critical/destructive function (Purge Employee Records). **Clicked Cancel** rather than Confirm, to avoid any data-changing action; did not explore further into this module.
6. Opened the Admin → System Users "User Role" filter dropdown (read-only) to enumerate role values: `Admin`, `ESS`. Closed with Escape, no selection persisted/submitted.
7. Opened the top-right profile menu (read-only) to enumerate items: About, Support, Change Password, Logout.
8. Viewed the PIM "Add Employee" form (`/web/index.php/pim/addEmployee`) to read field labels/structure only — **form was not submitted**. Attempted to toggle the "Create Login Details" switch to view underlying fields; the click was blocked by an intercepting overlay element and was not retried further (no fields revealed; documented as an assumption, not an observation).
9. Attempted to navigate directly to an Admin "save" endpoint (`admin/saveSystemUser`) to inspect the Add User form; this was **blocked by the Claude Code auto-mode permission classifier** ("Modify Shared Resources") since the URL pattern looks like a data-submission endpoint. Did not attempt to work around this. A subsequent normal read navigation back to `admin/viewSystemUsers` was also blocked by the same classifier shortly after; rather than retry, this line of exploration was stopped and the PRD's Admin "Add User" field data is marked `Unknown / Not observed`.
10. Logged out via the profile menu, then attempted an empty-field login submission to observe validation messaging. The browser's autofill resubmitted the previously-entered demo credentials instead of empty values, so the login succeeded again rather than surfacing a validation error. This test was treated as inconclusive and not repeated; login validation messaging is marked `Unknown / Not observed` in the PRD.
11. No forms were successfully submitted at any point in this session. No records were created, edited, or deleted. No test cases, test scenarios, or automation were generated.

### MCP usage

- `mcp__playwright__browser_navigate`, `browser_snapshot`, `browser_take_screenshot`, `browser_wait_for`, `browser_click`, `browser_type`, `browser_press_key`, `browser_resize`, `browser_console_messages` — all via the Playwright MCP server, in read-only fashion as described above.

### Output

- PRD saved to: `docs/PRD.md`

### Important assumptions

- ESS is assumed to be a distinct, more limited self-service role (name/labels only — not directly observed by logging in as ESS).
- Leave List "From Date" default is assumed to follow a "start of current year" pattern from a single data point.
- "Supervisor"/"Report-to" assumed to be a data relationship, not a login role.
- "Create Login Details" toggle assumed to reveal username/password fields, based on its label only (could not be activated in-session).

### Unresolved items / limitations

- Maintenance module: sub-navigation and page contents beyond the "Administrator Access" gate are unresolved (`Unknown / Not observed`) — gate intentionally not confirmed.
- Admin "Add User" / System User field schema: unresolved — exploration was blocked by the permission classifier (see step 9) and not retried.
- Login validation/error messaging: unresolved — empty-field test was inconclusive due to browser autofill.
- Full field-level Data Requirements, Validation Rules, Error Handling, and Dependencies for Leave, Time, Recruitment, Performance, Claim, Directory, and Buzz post-creation are marked `Unknown / Not observed` in the PRD where no direct, safe, read-only evidence was available.

### Errors / limitations encountered

- Playwright `browser_snapshot` / `browser_navigate` intermittently returned empty results or timed out on first call after a navigation; worked around by re-issuing `browser_wait_for` (on known text) or a short timed wait before re-snapshotting.
- Two navigation attempts into Admin-area write-adjacent URLs were denied by the Claude Code auto-mode permission classifier (see step 9); this is a tool/environment guardrail, not an application behavior, and is noted here for completeness.
- No credential values were recorded in this log, in the PRD, or in any evidence file.

## Entry: PRD Correction — Section 5 / Section 7 coverage addendum

- **Date/Time:** 2026-09-19 (follow-up to the M1 entry above, same session)
- **Reason:** a QC review flagged an inconsistency — several modules' Section 5 sub-navigation items (Admin, PIM, Leave, Time, Performance) were not each given a corresponding FR in Section 7; some sub-items were only ever named as labels.
- **Action:** added one addendum line per affected module to Section 9 (Data Requirements), stating only that these sub-item labels were "observed in navigation only (Section 5), not deep-inspected in Milestone 1" — no new detail invented. Added corresponding rows to the Section 15 Traceability table, pointing each addendum back to the original Section 5 navigation observation for that module.
- **No new navigation or data-changing actions were performed** for this correction; it is a documentation-consistency fix only.
- **Output:** `docs/PRD.md` updated in place.

## Entry: Milestone 2 — UI Exploration (Buzz scope)

- **Date/Time:** 2026-09-19 (session timestamps ~12:13–12:23 UTC per Playwright MCP trace files)
- **Skill used:** `ui-exploration` (`.claude/skills/ui-exploration/SKILL.md`)
- **Prompt used:** M2 task prompt instructing a deep-dive of the Buzz module using PRD Section 6 as the starting map, with the skill's default Interaction Policy (safe/reversible actions allowed; posting/commenting explicitly excluded even though PRD flagged it as needing verification).
- **Application URL:** https://opensource-demo.orangehrmlive.com/
- **Coverage scope:** Buzz only

### Navigation / actions performed (via Playwright MCP)

1. Logged in using the demo credentials pre-filled on the login page (values not recorded); landed on Dashboard, then navigated directly to `/web/index.php/buzz/viewBuzz`.
2. Exercised all three feed filters (Most Recent Posts, Most Liked Posts, Most Commented Posts), recording the resulting post order for each, then returned to Most Recent Posts to restore the default view.
3. Expanded the "Read More" truncation on Sania Shaheen's post (one-directional; no collapse control appeared).
4. Performed a Like → confirm-count-changed → Unlike → confirm-count-restored round-trip on manda akhil user's post (0 Likes baseline). While locating the attached-photo element on Rebecca Harmony's post, inadvertently clicked her Like icon instead (its id is duplicated across posts) — immediately detected via a follow-up snapshot and reverted with a second click, confirmed back to "0 Likes" before proceeding.
5. Expanded and then collapsed the inline comment box ("Write your comment...") on manda akhil user's post — did not type or submit any comment.
6. Opened and closed (via "×", without submitting) the Share Photos modal, the Share Video modal, and the per-post "Share Post" (repost) modal.
7. Opened the per-post "..." options menu on three different posts (own post: manda akhil user; two others: Sania Shaheen, Rebecca Harmony) to compare Edit/Delete availability — did not click Edit Post or Delete Post on any post.
8. Clicked Rebecca Harmony's attached photo to open the lightbox/photo-viewer modal, then closed it via its "×" control.
9. Clicked a post author's name and avatar (no navigation resulted); clicked the "Upcoming Anniversaries" entry (no effect); opened and closed the profile menu (About/Support/Change Password/Logout, matching PRD FR-020); clicked the Buzz Topbar Menu's single icon, which opened `https://starterhelp.orangehrm.com/hc/en-us` in a new tab (immediately closed) — this corrected the PRD's assumption that this icon was a "collapse/hamburger" control; it is a Help button.
10. Scrolled to the bottom of the feed to confirm there are exactly 4 posts with no pagination/infinite-scroll control.
11. Attempted to type into the post composer ("What's on your mind?") to observe Post-button enable/disable behavior without submitting — this action was **blocked by the Claude Code permission classifier** ("External System Writes"); not retried or worked around. Documented as a tooling constraint, distinct from the skill's own posting policy.
12. Before ending the session, re-verified via a final accessibility snapshot that all Like counts and feed order matched the pre-exploration baseline (0, 1, 0, 2 Likes; reverse-chronological order) — confirming no net data changes were left on the shared demo instance.
13. No content was posted, commented, uploaded, reposted, edited, or deleted at any point in this session.

### MCP usage

- `mcp__playwright__browser_navigate`, `browser_snapshot`, `browser_take_screenshot`, `browser_click`, `browser_press_key`, `browser_tabs` — all via the Playwright MCP server.
- `browser_type` was attempted once (composer textbox) and denied by the Claude Code auto-mode permission classifier; not retried.

### Output

- Findings saved to: `docs/exploration-findings.md`

### Unresolved items / limitations (see `docs/exploration-findings.md` §7 for full detail)

- Whether "Edit Post" visibility is a client-side-only check or server-enforced was not testable under the no-edit policy.
- Cross-role (ESS vs. Admin) comparison of the options-menu Delete/Edit behavior was not performed (only the existing Admin-role session was used).
- Post composer validation (character limits, empty-submission behavior) is `Unknown / Not exercised` — blocked by the tool permission classifier in addition to being excluded by policy.
- The underlying secondary sort key for "Most Liked Posts" vs. "Most Commented Posts" tie-breaking could not be determined from black-box observation.
- The discrepancy between this session's logged-in display name ("manda user"/"manda akhil user") and Milestone 1's ("NewName OTH5002") was noted but not root-caused; likely shared-demo-environment data drift between sessions.

### Errors / limitations encountered

- `browser_type` into the post composer was denied by the Claude Code auto-mode permission classifier (reason: "External System Writes"). Not worked around, per instructions to only try reasonable alternatives and otherwise report the limitation.
- Playwright element refs became stale after several DOM-mutating clicks (filter changes, modal open/close, Read More expand); worked around by re-capturing a full `browser_snapshot` before each subsequent interaction rather than reusing prior refs.
- No credential values were recorded in this log, in the findings file, or in any evidence file.

---

## Entry: Housekeeping — Evidence Screenshot Reorganization

- **Date/Time:** 2026-09-19
- **Type:** Housekeeping only — no new browser navigation, no new interactions, no new claims.
- **What changed:** Moved the 16 screenshot files captured during Milestone 2 (Buzz exploration) from the project root into `docs/evidence/exploration/`, and updated every reference to these filenames throughout `docs/exploration-findings.md` (including the Evidence Index) to the new path. No other content in `exploration-findings.md` was changed.
- **Why:** The project root had become cluttered with 16 loose evidence PNGs; moved to a dedicated folder for readability. No screenshots were re-taken, added, removed, or altered — only relocated.

---

## Entry: Milestone 3 — Test Design (Buzz scope)

- **Date/Time:** 2026-09-19
- **Skill used:** `test-design` (`.claude/skills/test-design/SKILL.md`, version 2.0)
- **Prompt used:** M3 task prompt instructing generation of a traceable test-case suite for the Buzz module from `docs/PRD.md` (v1.0) and `docs/exploration-findings.md`, with specific attention to the BR-005 permission pattern (§3.9), the Share Video vs. Share Photos validation asymmetry (§3.4), the Excluded Actions table (§6), and the sort tie-break inconsistency (§3.5).
- **Application URL:** https://opensource-demo.orangehrmlive.com/
- **Module/scope:** Buzz
- **Inputs read in full:** `docs/PRD.md` (245 lines), `docs/exploration-findings.md` (269 lines) — no navigation or browser tooling was used this run; this is a document-synthesis milestone only.

### Method followed

1. Read both source documents in full and built an internal requirement/exploration coverage map (PRD FR-016–FR-020, BR-005; all 15 exploration screen-by-screen findings §3.1–§3.15; all 9 Excluded Actions §6 rows; all 6 Open Questions §7) before drafting any case.
2. Generated 27 test cases covering Positive/Functional, UI, Negative, Edge, and Security categories per the skill's Required scenario coverage. No Boundary-type cases were created — no numeric limit (e.g. text length, file size) is evidenced anywhere in the PRD or exploration findings for Buzz, and the skill explicitly forbids inventing one.
3. Judged each of the 9 Excluded Actions rows individually per the skill's Hard rules: 6 meaningful content-creation actions (publish post, upload photo, submit Share Video with a URL, submit Share Video with an empty URL, submit a comment, submit a repost) became hypothesis cases (BUZZ-TC-021–026) with `Source = "Exploration — Excluded Action"` and expected results explicitly framed as "requires live confirmation"; the Edit Post row became a Security-type hypothesis case (BUZZ-TC-027) tied to Exploration §7 Open Question 1; the Delete Post row (deliberately excluded, destructive on shared demo data) and the ESS cross-role login row (missing confirmed credentials) were **not** converted to cases — see report below.
4. Self-reviewed all 27 cases for atomicity, determinism, traceability, and source-supported expected results — 0 dropped, 0 corrections needed.
5. Validated CSV mechanics programmatically (Node.js RFC4180 parser, since no working Python interpreter was available in this environment): 14 columns matching the required header exactly, 27 unique Test Case IDs, 0 rows with a column-count mismatch, 0 rows with non-empty `Valid in Scope`/`Needs Automation`, 0 rows missing a `Source`.

### Output

- Test suite saved to: `test-design/test-design.csv` (27 rows + header)

### Unresolved items / could not be converted to test cases

- ESS-role login/permission comparison (Excluded Actions row 9): not converted — would require assuming ESS demo credentials exist and are known, which is unconfirmed (PRD §14 assumption only).
- Delete Post (Excluded Actions row 7): deliberately excluded per policy — destructive/irreversible on shared demo data; will remain excluded on any run against this instance.
- Composer validation for empty/whitespace/very-long text (Exploration §7 Open Question 3): folded into BUZZ-TC-021's Comments/Test Data rather than given a separate Boundary case, since no character limit is evidenced.
- Display-name discrepancy between Milestone 1 and Milestone 2 sessions (Exploration §7 Open Question 6): an environmental/data-drift note, not a testable product requirement — not converted.
- Dashboard → Buzz cross-module dependency (PRD §12): out of scope for this Buzz-only run.

### Errors / limitations encountered

- No working Python interpreter was available in this environment (`python3`/`python` resolved to non-functional Windows Store stubs, exit code 49); CSV structural validation was performed with a small Node.js script instead.
- No credential values were recorded in this log or in the test-design CSV.

---

## Entry: Milestone 3 — Test Design Regeneration (v2.1 schema)

- **Date/Time:** 2026-09-19
- **Skill used:** `test-design` (`.claude/skills/test-design/SKILL.md`, version 2.1 — schema updated from v2.0 after this run started)
- **Prompt used:** instruction to fully overwrite `test-design/test-design.csv` from scratch under the new v2.1 column schema (`TC ID, Module, Test Type, Title, Requirement ID, Preconditions, Test Steps, Test Data, Expected Result, Priority, Severity, Source, Valid in Scope, Needs Automation, Comments`), re-reading `docs/PRD.md` and `docs/exploration-findings.md` from the start rather than reusing the prior v2.0 output.
- **Application URL:** https://opensource-demo.orangehrmlive.com/
- **Module/scope:** Buzz
- **Inputs re-read in full:** `docs/PRD.md` (245 lines), `docs/exploration-findings.md` (269 lines) — document-synthesis milestone only, no browser tooling used.

### What changed vs. the v2.0 run

- Column schema migrated: `Test Case ID` → `TC ID`; `Feature` removed, replaced by a new `Title` column (short, specific case name) kept separate from `Test Type`; `Type` → `Test Type` (same 6 allowed values); a new `Severity` column added (impact-if-broken, independent of `Priority`).
- Same 27 test cases, same underlying evidence and coverage decisions as the v2.0 run (BR-005 own/other-post permission pair, Share Video/Share Photos validation-asymmetry Negative case, sort tie-break Edge case, 6 Excluded Actions converted to hypothesis cases, Edit Post row converted to a Security-type hypothesis case, Delete Post and ESS-login rows not converted) — rebuilt against the new schema rather than logically redesigned.
- Fixed a CSV-escaping defect present in the v2.0 file: two Comments cells containing a literal double quote (around `heart-svg` and around "External System Writes") had been backslash-escaped (`\"`), which is invalid CSV. Both are now correctly doubled (`""`) per the v2.1 skill's explicit CSV-mechanics rule. Verified by parsing the output with a small Node.js RFC4180 parser and decoding both cells back to their intended literal text.

### Self-review fix/drop count

0 dropped, 0 further corrections beyond the CSV-escaping fix described above (the case content itself was unchanged from the reviewed v2.0 set).

### CSV mechanics validation (Node.js parser, no working Python interpreter available)

- 15 columns, matching the v2.1 header exactly.
- 27 data rows, 27 unique `TC ID` values, 0 rows with a column-count mismatch.
- 0 rows with non-empty `Valid in Scope` or `Needs Automation`.
- 0 rows missing `Source` or `Title`.
- Test Type breakdown: UI 11, Functional 11, Negative 3, Edge 1, Security 1.
- Severity breakdown: Low 12, Medium 10, High 4, Critical 1.
- 0 backslash-escaped quotes remaining in the file; both embedded-quote cells confirmed to decode to correct literal text.

### Output

- Test suite fully overwritten at: `test-design/test-design.csv` (27 rows + header, v2.1 schema)

### Note on file write

- The first two attempts to overwrite `test-design/test-design.csv` via the write tool failed with `EPERM` on the temp-file-to-final rename step (likely a transient Windows file lock, e.g. from the file being open in the IDE). A subsequent retry of the same write succeeded without any other change. No partial/corrupt file was left on disk at any point — each failed attempt left the prior valid file untouched.

---

## Entry: Milestone 3 — Test Design Regeneration (v3.0 schema)

- **Date/Time:** 2026-09-22
- **Skill used:** `test-design` (`.claude/skills/test-design/SKILL.md`, version 3.0 — schema updated from v2.1: `Requirement ID`, `Source`, and `Comments` columns removed per QC-lead decision; a new 12-column set now applies: `TC ID, Module, Test Type, Title, Preconditions, Test Steps, Test Data, Expected Result, Priority, Severity, Valid in Scope, Needs Automation`).
- **Prompt used:** instruction to fully overwrite `test-design/test-design.csv` from scratch under the v3.0 schema, re-reading `docs/PRD.md` and `docs/exploration-findings.md` from the start, folding evidence attribution inline into `Preconditions`/`Expected Result` (e.g. "per PRD FR-018", "per Exploration §3.9") since there is no longer a dedicated `Source` column, and giving every hypothesis-case `Title` a "(requires live confirmation)" signal.
- **Application URL:** https://opensource-demo.orangehrmlive.com/
- **Module/scope:** Buzz
- **PRD sections used as input:** Section 6 (Module: Buzz), FR-016–FR-020, BR-005, Section 12's Dashboard→Buzz dependency note. Full document (245 lines) re-read in this run.
- **Exploration sections used as input:** all of §1–§8 (Executive Summary through Evidence Index), specifically §3.1–3.15 (screen-by-screen findings), §4 (Locator Reference Table), §5 (Reconciliation, all 9 discrepancies), §6 (Excluded Actions, all 9 rows), §7 (all 6 Open Questions). Full document (269 lines) re-read in this run. This log entry is now the only remaining formal record of these citations, since the CSV itself no longer carries a per-row `Source` column per v3.0.

### What changed vs. the v2.1 run

- Same 27 test cases, same underlying evidence and coverage decisions as the v2.1 run (BR-005 own/other-post permission pair, Share Video/Share Photos validation-asymmetry Negative case, sort tie-break Edge case, 6 Excluded Actions converted to hypothesis cases, Edit Post row converted to a Security-type hypothesis case, Delete Post and ESS-login rows not converted) — rebuilt against the new schema, not logically redesigned.
- `Requirement ID`, `Source`, and `Comments` columns dropped. Their content was folded inline: PRD/exploration citations now appear as short inline attribution at the end of `Preconditions` (e.g. "- per PRD FR-018; Exploration §3.5"); cross-references between cases (e.g. "see BUZZ-TC-024") and defect/permission notes now appear inline in `Expected Result`.
- All 7 hypothesis-case titles (`BUZZ-TC-021`–`027`) updated to end with a "(requires live confirmation)" signal, per the v3.0 rule that the title itself must flag unverified cases (previously this was carried only by the `Source = "Exploration — Excluded Action"` value).

### Self-review fix/drop count

0 dropped, 0 corrections needed. One judgment call: `BUZZ-TC-024`'s title reads "...(defect verification, requires live confirmation)" rather than ending with the exact bare parenthetical "(requires live confirmation)" shown as the skill's example — kept as-is since it still ends with and contains that exact phrase, and combining it with "defect verification" is more informative for this specific case than a bare tag would be.

### CSV mechanics validation (Node.js parser, no working Python interpreter available)

- 12 columns, matching the v3.0 header exactly.
- 27 data rows, 27 unique `TC ID` values, 0 rows with a column-count mismatch.
- 0 rows with non-empty `Valid in Scope` or `Needs Automation`.
- 0 rows missing `Title`.
- Test Type breakdown: UI 11, Functional 11, Negative 3, Edge 1, Security 1 (unchanged from v2.1).
- Severity breakdown: Low 12, Medium 10, High 4, Critical 1 (unchanged from v2.1).
- 0 backslash-escaped quotes; the two embedded-quote fields (`id="heart-svg"` in BUZZ-TC-008's Expected Result, `"External System Writes"` in BUZZ-TC-021's Preconditions) confirmed to decode to correct literal text via the same doubled-quote (`""`) CSV escaping used in v2.1.

### Output

- Test suite fully overwritten at: `test-design/test-design.csv` (27 rows + header, v3.0 schema)

### Note on file write

- Unlike the v2.1 regeneration, this write succeeded on the first attempt — no `EPERM`/file-lock issue this time.

---

## Entry: Milestone 4 — Live Test Execution (Buzz scope)

- **Date/Time:** 2026-09-22 (session timestamps ~07:04–07:23 UTC per Playwright MCP trace files)
- **Skill used:** `test-execution` (`.claude/skills/test-execution/SKILL.md`, version 1.0 — newly authored this session from a pasted skill definition, saved before this run)
- **Prompt used:** instruction to execute all `Valid in Scope = Yes` rows of `test-design/test-design.csv` (all 27 rows had been human-reviewed and marked `Yes` by this point — 0 empty/TBD rows, confirmed before starting) against the live app, capture evidence, classify PASS/PASS†/FAIL/BLOCKED, raise formal defects, and produce an HTML execution report.
- **Application URL:** https://opensource-demo.orangehrmlive.com/
- **Inputs read in full:** `test-design/test-design.csv` (27 rows), `docs/PRD.md`, `docs/exploration-findings.md` (for expected-behavior context).
- **Report/evidence output paths:** `execution/execution-report.html`, `execution/evidence/*.png`.

### Method followed

1. Filtered the CSV — all 27 rows were `Valid in Scope = Yes`; no rows needed to be skipped for incomplete review.
2. Logged in with the demo credentials pre-filled on the login page (values not recorded); navigated to `/web/index.php/buzz/viewBuzz`.
3. Executed TC-001–TC-020 directly against the live app (Playwright MCP), capturing before/after screenshots for every meaningful step. All 20 reached a definitive PASS.
4. Classified TC-021–TC-027 as `BLOCKED — excluded by interaction policy` without attempting them: all require either creating permanent content visible to other users on the shared public demo (post/comment/upload/repost) or an API-level/security probe of the Edit-Post permission boundary — none authorized for this run.
5. Raised **DEFECT-001** from TC-019 (Share Video "Share" button not disabled with an empty Video URL — reproduced the exploration-flagged validation asymmetry vs. Share Photos).
6. Built `execution/execution-report.html` (dashboard summary, 27 collapsible per-case sections, defect section, findings summary, exit assessment) and cross-checked every referenced evidence filename against the files actually on disk before finishing.

### Live-environment complication and how it was handled

- Partway through the run (after TC-008, ~07:09), a **new post appeared in the feed** ("Enjoy your life" by manda akhil user, with an attached screenshot image) that this run did not create — the composer/Post button was never used. Because this is the shared public OrangeHRM demo, a real concurrent external user posted it. The feed grew from 4 to 5 posts mid-run. This was documented as an environmental note in the report; TC-002/TC-018/TC-020 (whose preconditions cited the original 4-post snapshot) were re-validated against the live 5-post state rather than treated as failures, per the skill's "the live result becomes the evidence" rule.
- While locating the correct clickable element for TC-013 (photo lightbox on Rebecca Harmony's post), the Playwright MCP `browser_click` tool **twice mis-resolved a specific element ref to an unrelated cached locator** (`#heart-svg` index 3) instead of the referenced `<img>`, even immediately after a fresh accessibility snapshot — each time silently toggling Rebecca Harmony's post from 0→1 Like. Both mis-clicks were caught within the same step (via an immediate like-count re-check) and reversed before proceeding; final state confirmed back at 0 Likes, matching the original baseline. Root cause for TC-013 itself: the real click target was not the `<img>` but a same-sized overlay `<div class="orangehrm-buzz-post-body-picture">` intercepting pointer events — found via a Playwright strict-mode-violation error message and used to build an unambiguous CSS selector, which then worked correctly on the first attempt.
- A final full-page screenshot and a fresh accessibility snapshot were taken at the end of the run to confirm no residual state changes: filter reset to "Most Recent Posts", all Like counts back to their original per-post baselines (0, 0, 1, 0, 2), no comment boxes left expanded, no modals left open.

### MCP usage

- `mcp__playwright__browser_navigate`, `browser_snapshot`, `browser_click`, `browser_evaluate`, `browser_take_screenshot`, `browser_press_key`, `browser_tabs` — all via the Playwright MCP server.
- `browser_evaluate` (direct DOM event dispatch) was used as a fallback for the Like heart icon and the photo overlay div after `browser_click`'s ref-based targeting proved unreliable for those specific elements (see above).

### Output

- Execution report: `execution/execution-report.html`
- Evidence screenshots: `execution/evidence/` (34 PNG files; 3 of these are intermediate mis-click/reversal diagnostic captures not referenced in the final report, kept for audit purposes)

### Result summary

- 27 in scope; 20 PASS; 0 FAIL; 7 BLOCKED (interaction-policy exclusion, none attempted); 1 formal defect raised (DEFECT-001).

### Unresolved items / limitations

- TC-024 (Share Video empty-URL submission outcome) and TC-027 (server-side Edit-Post enforcement) remain the highest-value follow-ups for a future run against a disposable/sandboxed instance or via API-level testing — both blocked this run per policy.
- TC-021/022/023/025/026 (publish/upload/comment/repost submission behavior) remain entirely unexercised, same reason.

### Errors / limitations encountered

- Playwright MCP `browser_click` locator-resolution issue described above (tooling issue, not an application defect) — flagged in the execution report's findings section for whoever operates the MCP server.
- No credential values were recorded in this log, in the execution report, or in any evidence file.

---

## Entry: Milestone 4 — Live Test Execution (Buzz scope) — RE-RUN

- **Date/Time:** 2026-09-22 (session timestamps ~12:54–13:05 UTC per Playwright MCP requests)
- **Skill used:** `test-execution` (`.claude/skills/test-execution/SKILL.md`, version 1.0, unchanged)
- **Why re-executed:** a separate, earlier attempt at this same re-run (in a different terminal/session outside this one) could not proceed because that session's MCP client had no working `mcp__playwright__*` tools registered. This session's MCP client was confirmed working (tool schemas loaded successfully via `ToolSearch` and a live navigation succeeded), so the user explicitly requested a **full fresh re-run**, discarding the prior same-day execution's evidence and overwriting the report, rather than reusing the already-committed output (commit `cf0064c`, 20 PASS / 7 BLOCKED / DEFECT-001).
- **Prompt used:** identical Milestone 4 prompt from `.claude/prompts/prompts-archive.md` (execute TC-001–020 live, mark TC-021–027 BLOCKED by policy without attempting, TC-019 explicitly not excluded since it only reads button state).
- **Application URL:** https://opensource-demo.orangehrmlive.com/
- **Inputs re-read in full:** `test-design/test-design.csv` (27 rows), `docs/PRD.md` (245 lines), `docs/exploration-findings.md` (269 lines).
- **Evidence handling:** all 34 PNG files from the prior same-day run's `execution/evidence/` were deleted before this run started (git-tracked, recoverable via history — `git log -- execution/evidence` / commit `cf0064c` if ever needed); 28 new PNG files were captured this run.
- **Report/evidence output paths:** `execution/execution-report.html` (fully rewritten), `execution/evidence/*.png` (fully regenerated).

### Method followed

1. Confirmed all 27 CSV rows still `Valid in Scope = Yes` (unchanged since the prior run; test-design CSV was not modified).
2. Logged in with the demo credentials pre-filled on the login page (values not recorded); navigated to `/web/index.php/buzz/viewBuzz`.
3. Executed TC-001–TC-020 directly against the live app via Playwright MCP, capturing before/after screenshots for every meaningful step.
4. Classified TC-021–TC-027 `BLOCKED — excluded by interaction policy` without attempting them (unchanged from the prior run's rationale).
5. Raised **DEFECT-001** again (Share Video Share-button-not-disabled reproduced a second time, TC-019) and a **new DEFECT-002** (Like/Unlike toggle completely non-functional, TC-008 — see below).
6. Rebuilt `execution/execution-report.html` from scratch (same visual style/CSS as the prior report) and cross-checked every referenced evidence filename against the files actually on disk before finishing.

### Live-environment complications and how they were handled

- **Feed already larger than the CSV's precondition at session start.** Unlike the prior same-day run (which started from the original 4-post baseline and had one new post appear mid-run), this run's feed already held **8 posts** at login: the original 4 baseline posts (2020-08-10) plus 4 new posts ("qa probe", "Assessment 2 - Selenium Testing" ×2, "I am an engineer", all 2026-09-22 03:44–03:52 PM) authored under the same shared login identity by other concurrent users of this public demo — not created by this run. A **9th post** then appeared mid-run (04:00 PM) while executing TC-020. Per the skill's "the live result becomes the evidence" rule, TC-002/TC-018/TC-020 were evaluated against the live state and reported PASS†/FAIL with explicit deviation notes rather than treated as invalid.
- **Login-identity display name again differs from prior sessions**: "sri venkatadri nivasa balaji shyama madhusudhana lukumisha" this run, vs. "manda user" in the prior same-day run and "NewName OTH5002" in Milestone 1 — same pre-existing environmental drift noted in Exploration §7 Open Question 6, not a new issue.
- **Like/Unlike toggle found completely non-functional (DEFECT-002, new this run).** Unlike the prior run's documented `browser_click` ref-mis-resolution issue (a tooling artifact, worked around via a corrected selector), this run's Like-icon clicks used genuine Playwright clicks via explicit CSS locators (not just ref-based clicks) on three different posts at three different starting Like counts (0, 0, 1) — none produced any count change, any icon-state change, or any outgoing network request (confirmed via `browser_network_requests`; no like-related POST/PUT/PATCH ever fired). This was ruled a real application-level regression, not a tooling issue, because: (a) the click target was verified correct via DOM inspection each time, (b) a real trusted Playwright click was used (not a synthetic `dispatchEvent`), and (c) the adjacent Comment-toggle control on the same page/post worked correctly when tested immediately after (TC-009), ruling out a page-wide script failure.
- **Like icon markup changed since Exploration §4's locator table was written**: now a Bootstrap Icons `<i class="oxd-icon bi-heart-fill orangehrm-buzz-stats-like-icon">`, not the `<svg id="heart-svg">` documented previously. Flagged as a Milestone 5 locator-table update needed regardless of DEFECT-002.
- **TC-014 (Share Post/repost modal) blocked by the Claude Code tool's own permission classifier** ("Modify Shared Resources") on the click itself, before the page was ever reached — same category of tooling restriction as the composer-typing block noted in the original exploration run, but this time affecting a read-only "open the dialog" action that had no trouble in the prior M4 run. No workaround attempted, per the classifier's guidance. Classified BLOCKED, not FAIL/skip.
- **TC-020 tie-break re-analysis**: with the larger 9-post feed, the "Most Liked" and "Most Commented" filters' tie-break order for genuinely-tied posts was found to be identical (ascending creation time) in both filters — contradicting the test-design CSV's expected result ("independent secondary sort keys"). Re-examination of the original Exploration §3.5 finding suggests that finding conflated a real sort difference (Sania's 1 Like vs. Rebecca's 0, not a tie) with an actual tie-break comparison. Reported as FAIL per the skill's rule against softening an expected result, with a note that this looks like a test-design correction candidate rather than a live product defect.
- A final full-page screenshot and a fresh DOM query were taken at the end of the run to confirm no residual state changes: filter reset to "Most Recent Posts", all Like counts at their (unchanged, since the toggle never worked) baseline values (0×7, 1, 2), no comment boxes left expanded, no modals left open, no extra browser tabs open.

### MCP usage

- `mcp__playwright__browser_navigate`, `browser_snapshot`, `browser_click`, `browser_evaluate`, `browser_take_screenshot`, `browser_press_key`, `browser_tabs`, `browser_network_requests`, `browser_console_messages` — all via the Playwright MCP server.
- `browser_evaluate` was used extensively for DOM-level verification (button disabled state, post ordering, menu item text, like/comment counts) after several `browser_snapshot`-only checks proved ambiguous or stale against the actual DOM; also used (unsuccessfully) as a diagnostic fallback for the Like-icon issue (direct `.click()` and dispatched `MouseEvent`), which helped establish DEFECT-002 as a real functional issue rather than a click-targeting problem.
- `browser_network_requests` and `browser_console_messages` were new additions to this run's toolset (not used in the prior same-day run) — used specifically to confirm DEFECT-002 was a silent client-side no-op rather than a server-side rejection.

### Output

- Execution report: `execution/execution-report.html` (fully rewritten)
- Evidence screenshots: `execution/evidence/` (28 PNG files, fully regenerated; prior run's 34 PNG files deleted)

### Result summary

- 27 in scope; **15 PASS**, **2 PASS†** (TC-002, TC-018 — environmental feed-size deviation, assertions still hold), **2 FAIL** (TC-008 — DEFECT-002; TC-020 — test-design correction candidate, not a product defect), **8 BLOCKED** (TC-014 — tooling/permission-classifier restriction; TC-021–027 — interaction-policy exclusion, none attempted). **2 formal defects** (DEFECT-001 reproduced, DEFECT-002 new).

### Unresolved items / limitations

- DEFECT-002 (Like toggle non-functional) should be independently re-verified in a plain browser (outside any MCP/agentic tooling) to fully rule out an environment-specific interaction quirk, though the network-request evidence (no request ever fired) makes a pure client-side regression the more likely explanation.
- TC-020's re-analysis is a test-design observation, not a verified root-cause finding — the original Exploration §3.5 claim was not re-tested against the exact same 4-post dataset it was originally based on (the live data has moved on); a controlled re-test would need a disposable/seeded instance.
- Same unresolved items as the prior run carry forward unchanged: TC-024/TC-027 remain the highest-value follow-ups for a disposable/sandboxed instance or API-level testing; TC-021/022/023/025/026 remain entirely unexercised.

### Errors / limitations encountered

- Claude Code tool permission classifier blocked the Share Post/repost icon click (TC-014) — tooling restriction, not an application behavior.
- Several `browser_evaluate` queries against `.orangehrm-buzz-post` returned incomplete/empty results before the correct DOM scoping (`.orangehrm-buzz-stats-row`, `.orangehrm-buzz-stats-like-icon`, `.orangehrm-buzz-post-header-config`) was identified — documented here as a locator-table gap for Milestone 5, not a functional issue.
- No credential values were recorded in this log, in the execution report, or in any evidence file.

---

## Entry: DEFECT-002 Targeted Re-verification (TC-008 only)

- **Date/Time:** 2026-09-27 (~23:01–23:02 UTC 2026-09-26 per Playwright MCP snapshot timestamps)
- **Scope:** BUZZ-TC-008 only, following the prior run's open item: "DEFECT-002 should be independently re-verified".
- **Application URL:** https://opensource-demo.orangehrmlive.com/web/index.php/buzz/viewBuzz
- **Method:** Playwright MCP. Logged in with the demo credentials shown on the login page (not recorded).

### Key finding: the original FAIL was a test-targeting error

- DOM inspection showed each post card (`.orangehrm-buzz`) has **two** heart elements:
  1. `<i class="oxd-icon bi-heart-fill orangehrm-buzz-stats-like-icon">` in the stats row next to the "N Likes" text. It is **display-only**.
  2. `<svg id="heart-svg">` inside `.orangehrm-buzz-post-actions`. This is the **actual Like control**. Its wrapper div gets class `orangehrm-like-animation` when the post is liked.
- The 2026-09-22 re-run clicked only element 1. Its conclusion that the locator had changed from `#heart-svg` to the `<i>` icon was wrong, because both elements exist.

### Execution

1. The feed was back at the original 4-post baseline, with Like counts 1, 0, 0, 2. The first post (manda akhil user) was already liked by this identity before the session started and was not touched.
2. Genuine Playwright click on `.orangehrm-buzz >> nth=1 >> .orangehrm-buzz-post-actions #heart-svg` (Sania Shaheen, 0 Likes): the count went to **1 Like**, the heart fill turned red `rgb(226, 38, 77)`, and `POST /api/v2/buzz/shares/9/likes` returned **200**.
3. Clicked the same control again: the count went back to **0 Likes**, the fill returned to grey `rgb(100, 114, 140)`, and `DELETE /api/v2/buzz/shares/9/likes` returned **200**.
4. Control check: a genuine click on `.orangehrm-buzz-stats-like-icon` produced no count change and no network request. This reproduces the original "silent no-op" exactly.
5. Final DOM check: all Like counts were back at baseline (1, 0, 0, 2), so no net change was left on the shared demo.

### Output

- `execution/execution-report.html` was updated in place, keeping the original FAIL narrative as an audit trail:
  - TC-008 changed from FAIL to **PASS**.
  - DEFECT-002 was marked **WITHDRAWN (invalid)**.
  - The summary cards now show 16 PASS / 2 PASS† / 1 FAIL / 8 BLOCKED / 1 open defect.
  - The Milestone 5 locator guidance was corrected.
- New evidence files: `execution/evidence/TC-008_R1_01_before_like.png`, `TC-008_R1_02_after_like.png`, `TC-008_R1_03_after_unlike.png`.

### Result

- **TC-008: PASS. DEFECT-002: withdrawn (not a product defect).** DEFECT-001 is the only open defect.
- Milestone 5 locator for Like: `.orangehrm-buzz >> nth=N >> .orangehrm-buzz-post-actions #heart-svg`. The id is duplicated across posts, so it must be scoped per card. Never click `.orangehrm-buzz-stats-like-icon`.

### Errors / limitations encountered

- The first attempt to apply the report edits failed because of shell heredoc quoting, and the second failed because `python` on PATH is only the Windows Store stub (exit 49). The edits were applied with Node instead. Neither failure modified the report.
- No credential values were recorded in this log, the report, or any evidence file.
