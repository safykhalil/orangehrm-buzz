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

---

## Entry: Milestone 5 — Playwright Automation (Buzz scope)

- **Date/Time:** 2026-09-27 (final suite run started 23:50 UTC 2026-09-26 per Playwright JSON results)
- **Skill used:** `playwright-automation` (`.claude/skills/playwright-automation/SKILL.md`, version 3.2)
- **Prompt used:** Milestone 5 prompt: automate the `Needs Automation = Yes` cases, follow the skill exactly (Pre-Automation Inspection first), treat the execution report as source of truth, build the DEFECT-001 regression probe (button state only, never click Share), tag every test with a scheduling tier, run the credential-leak grep check.
- **Application URL:** https://opensource-demo.orangehrmlive.com/
- **Inputs read:** `test-design/test-design.csv` (27 rows; 15 with `Needs Automation = Yes`, all `Valid in Scope = Yes`), `execution/execution-report.html` (final version: 16 PASS / 2 PASS† / 1 FAIL / 8 BLOCKED, DEFECT-001 open, DEFECT-002 withdrawn), `docs/exploration-findings.md` (§3, §4 locator table), this log.
- **Method:** Real Playwright (`@playwright/test` 1.63.0, Chromium), not MCP. The standalone scripts were run with `npx playwright test`.

### Method followed

1. **Pre-Automation Inspection.** No existing framework (`automation/` held only empty `tests/ pages/ utils/ reports/` folders; no `package.json` or Playwright config), so a new one was created in `automation/`. All 15 approved cases were confirmed in scope. From the execution report: Like locator `.orangehrm-buzz-post-actions #heart-svg` (never the stats-row icon), active filter = `oxd-button--label-warn` class, Escape does not close Share modals, DEFECT-001 boundary (state only), DEFECT-002 withdrawn, TC-014 blocked only by the MCP tool, TC-020 expected result contradicted.
2. **Read-only DOM probes** (standalone Playwright scripts, nothing clicked that writes) to confirm locators before writing tests. Findings: the banner shows "manda user" but the own post shows "manda akhil user"; every card has a hidden Read More element (`display:none`) unless truncated; the post options and profile menus do not close with Escape; the repost icon has no accessible name (`bi-share-fill`).
3. **Framework:** `playwright.config.ts` (1 worker, 0 retries, traces off), a `setup` project that logs in once per run by reading the demo credentials shown on the login page (values not recorded) and saves `automation/.auth/state.json` (gitignored), page objects `pages/LoginPage.ts` and `pages/BuzzPage.ts` (`PostCard`), and `utils/fixtures.ts`. The fixtures include an auto **API write guard** that aborts and fails any non-GET API request a test's tier does not allow, plus an evidence helper that refuses to screenshot the login page.
4. **Tests:** one per approved TC, each tagged `@read-only` (13), `@state-changing` (1: TC-008) or `@regression-probe` (1: TC-019, `defect-001.regression-probe.spec.ts`, inverted assertion + console banner). TC-020 is written as `test.fixme` (BLOCKED — expected behavior requires confirmation).
5. **Hook-timeout check (Hard Rule 5):** a local experiment on Playwright 1.63 showed `afterEach` runs in its own slot sized by the config timeout and is killed mid-cleanup when it overruns, unless the hook calls `testInfo.setTimeout()`. TC-008's cleanup budget (3 × 33 s + 2 × 2 s = 103 s) exceeds the 60 s config timeout, so its `afterEach` raises its timeout to 130 s, and a load-time check enforces budget < hook timeout.
6. Ran the suite, triaged failures, healed, re-ran, then did a clean final full run.
7. Built `automation/reports/automation-execution-report.html` (`utils/build-report.js`) and wrote `automation/reports/healing-log.md`.
8. Ran `utils/credential-leak-check.js` (after both reports and this entry existed).

### Healing and reconciliation

- **Run 1:** 12 passed, 3 failed, 1 skipped (TC-020). All three failures were Category 1 automation defects in the first draft:
  - **H-01 (TC-008):** `test.use()` treated the array option as a fixture tuple, so the write guard threw. The Like POST never reached the server, and cleanup confirmed Sania Shaheen's post was left at "0 Likes", not liked. Fixed with an object-shaped option, and the guard now fails closed.
  - **H-02 (TC-007):** the Read More target was picked by element presence and matched a hidden element. Fixed by selecting on visibility.
  - **H-03 (TC-007, Run 2):** "Read More disappears" was checked as DOM removal, but the app hides the node with `display:none`. Fixed with `toBeHidden()`; the expected outcome is unchanged.
- **R-01 (TC-010), not healing:** the draft expected `['Edit Post', 'Delete Post']` from the CSV wording. M4 evidence `TC-010_01` and the live app both show Delete Post first. The expected value was changed to the M4-confirmed order, still an exact match. Recorded as "Was Assertion Changed: Yes", **pending QC confirmation**.

### Output

- Test code: `automation/tests/` (8 spec files), page objects `automation/pages/`, helpers `automation/utils/`, config `automation/playwright.config.ts`, `automation/package.json`.
- Report: `automation/reports/automation-execution-report.html` (+ `results.json`, `playwright-html/`, `credential-leak-check.json`, `evidence/` with 18 PNG files).
- Healing log: `automation/reports/healing-log.md`.
- `.gitignore`: added `automation/node_modules/`, `automation/.auth/`, `automation/test-results/`.

### Result summary

- **15 approved cases: 13 PASS, 0 FAIL, 1 BLOCKED (TC-020), 1 DEFECT (TC-019 probe).**
- **Tiers:** read-only 13 (12 PASS, 1 BLOCKED; write guard recorded zero API writes); state-changing 1 (TC-008 PASS; exactly one POST and one DELETE to `/api/v2/buzz/shares/9/likes`, reversal re-confirmed after reload); regression probe 1.
- **DEFECT-001 probe: PASS, so the defect is still present.** This is one automated observation on top of M4's 2/2. Share was never clicked.
- **TC-014:** BLOCKED in M4 (MCP tool classifier), now automated and passing, asserted from Exploration §3.10. The dialog was opened and closed only.
- **Environmental drift:** none affected this run. The feed was at the original 4-post baseline, and the banner identity was "manda user" (M4 saw 8–9 posts and a different display name).
- **Credential-leak check:** see the report's "Credential-Leak Verification" section (`automation/reports/credential-leak-check.json`). Password value: **0 matches**. Every username-value match was reviewed with the value masked. Each is the same word used as the app's module/role label (localStorage UI strings in the gitignored `.auth/state.json`, module/role references in this log, and the CSV's role wording quoted in the report); none is in a credential context.

### Unresolved items / limitations

- **QC decisions needed:** (1) R-01 TC-010 expected-order change; (2) TC-020 expected result (test-design correction candidate), which stays BLOCKED until then; (3) whether H-03's visibility check is acceptable for TC-007.
- TC-014's expected result rests on exploration evidence only (never confirmed in M4).
- A single final run; the suite has not yet been run repeatedly to measure flakiness against the shared demo.

### Errors / limitations encountered

- `python` on PATH is still the Windows Store stub, so all CSV and report tooling was written in Node.
- Bash-tool heredocs collapsed `\\` to `\`, which broke two throwaway regex debug scripts (rewritten with the Write tool), and one heredoc append to this log failed on quoting before writing anything. No project file was affected.
- My own first DOM probe clicked at page coordinates (5, 500), which navigated away via the sidebar. That was a probe bug, not app behavior, and it was replaced with scoped interactions.
- No credential values were recorded in this log, the report, the healing log, the code, or any evidence file.

---

## Entry: Milestone 5 follow-up — TC-020 test-design correction and re-run

- **Date/Time:** 2026-09-27 (same session as the Milestone 5 entry above)
- **Requested by:** the human QC lead, who approved correcting BUZZ-TC-020 as a genuine test-design defect and asked for the Title to be corrected with it.
- **Skill basis:** `test-design` SKILL.md, "Carrying scope decisions forward", which allows direct CSV edits only for "a genuine test-design defect … never to reflect an execution outcome". It applies because the original expectation came from a misreading: Exploration §3.5 compared Sania Shaheen (1 Like) with Rebecca Harmony (0 Likes), a primary-key difference, not a tie.

### What changed

1. **`test-design/test-design.csv`, row BUZZ-TC-020 only:**
   - **Title:** "'Most Liked' vs 'Most Commented' tie-break order differs" → "'Most Liked' and 'Most Commented' use the same tie-break order".
   - **Expected Result:** now says both filters use the same secondary key for genuinely tied posts (ascending chronological, oldest first), and any two posts tied under both filters keep the same relative order. It includes a dated correction note.
   - A cell-by-cell diff against `HEAD` (line endings normalised) confirmed only those two cells changed. All 28 rows still have 12 fields, and `Valid in Scope`/`Needs Automation` are unchanged (Yes/Yes).
   - The first write attempt failed with `EPERM` because Excel had the file open (locked). No change was made until you closed Excel without saving.
2. **TC-020 automation:** `test.fixme` (BLOCKED) was replaced with real assertions (primary counts non-increasing, ascending time within tie groups, same relative order for pairs tied under both filters; no tie group → BLOCKED). The test was renamed to the new Title. Logged as **C-01** in the healing log (Was Assertion Changed: Yes, QC-approved).
3. **H-04, environmental drift, found by inspecting the first post-correction run:** the shared demo's instance-wide date format changed between runs. It was `Y-m-d` earlier today and `Y-d-m` now (read-only `GET /api/v2/admin/localization`), so the same posts displayed `2020-10-08` earlier and `2020-08-10` now. The timestamp parser hard-coded `YYYY-MM-DD`, which could silently mis-order posts from different dates. It now reads the configured format at runtime (TC-002, TC-003, TC-020), and a 7-case parser check passed. No test result had been affected, because all compared posts are from the same day.

### Result (final clean full run)

- **15 approved cases: 14 PASS, 0 FAIL, 0 BLOCKED, 1 DEFECT (TC-019 probe, DEFECT-001 still present).**
- **Tiers:** read-only 13 (13 PASS; zero API writes); state-changing 1 (TC-008 PASS; one POST and one DELETE to `/api/v2/buzz/shares/10/likes` on manda akhil user's post, reversal re-confirmed); regression probe 1.
- **TC-020:** PASS. Most Liked ties: Rebecca 05:34 → manda 05:38. Most Commented ties: Russel 05:33 → Rebecca 05:34 → Sania 05:38 → manda 05:38. One pair tied under both filters, same order in both.
- **Healing totals:** 4 attempts, 4 successful, 5 tests affected; plus C-01 (QC-approved) and R-01 (TC-010, still **pending QC confirmation**).
- **Credential-leak check:** re-run after every output and this entry existed. Password value **0 matches**; username-value matches are all the same app module/role label, as before.

### Unresolved items

- R-01 (TC-010 expected item order) still needs QC confirmation.
- H-03 (TC-007 visibility check) is open to QC review.
- TC-014's expected result still rests on exploration evidence only.
- No credential values were recorded in this log, the report, the healing log, the code, or any evidence file.

---

## Entry: DEFECT-001 live re-verification (BUZZ-TC-024) and QC reclassification

- **Date/Time:** 2026-09-28, about 07:08–07:20 local time (post times in the demo showed 07:12–07:16 AM).
- **Requested by:** the human QC lead, as an explicit, scoped, one-time authorization to run steps 0–8 live on the shared demo. It overrode the Interaction Policy's default exclusion for those actions only. This was not a formal milestone re-run.
- **Method:** a one-off Playwright script in the session scratchpad, using the Playwright already installed in `automation/node_modules`. No file under `automation/` was changed. Logged in with the demo credentials shown on the login page; no values were recorded. Every write request was logged, and every delete ran behind a network guard that allowed only the one expected share ID.

### What was authorized and done

| Step | Action | Result |
|---|---|---|
| 0 | Clean up the QC lead's two manual test posts ("QA team shipped the 0813 leave flow 693679" / "…610494"), matching exact text only | **Neither found.** The feed held only 5 posts (IDs 14, 10, 9, 7, 6) and none contained "0813 leave flow", so the demo appeared freshly reset. **Nothing was deleted.** |
| 1 | TC-021: post "All code is guilty until proven innocent." | Created post 13 / share 15 |
| 2 | TC-027: Edit Post, appending " (edited)" | `PUT /api/v2/buzz/posts/13` → 200; edited text still shown after reload |
| 3 | TC-025: comment "Quality first, always." | Comment 8 on share 15 |
| 4 | TC-026: repost | Share 16, shown as a separate feed entry |
| 5 | Clean up steps 1–4 | `DELETE /api/v2/buzz/shares/16` → 200, then `/shares/15` → 200 |
| 6 | TC-022: Share Photos with `Testing-image.png` | Share 17 created with the image, then deleted (200) |
| 7 | TC-023: Share Video with a valid YouTube URL | Share 18 created (the video embedded), then deleted (200) |
| 8 | TC-024: Share Video with an **empty** URL | See below |

**Cleanup confirmed:** everything created in steps 1–7 was deleted. The feed returned to its original 5 posts with the IDs unchanged (14, 10, 9, 7, 6). Post 14 ("Excited to collaborate…") belonged to another tester under the same shared identity and was not touched.

### DEFECT-001 finding (step 8)

- The URL field was empty (`""`) and the Share button was **enabled** before the click, so the original DEFECT-001 observation still holds.
- After the click, an inline **"Required"** message appeared, the field got a red border, and the dialog stayed open.
- **Zero network requests** of any kind fired in the 6 seconds after the click (0 total, 0 non-GET).
- **No post was created.** The feed had the same 5 posts and IDs after the dialog was closed and the page reloaded.
- **QC decision:** DEFECT-001 is reclassified from "confirmed functional defect" to **"UX inconsistency, not a functional defect"**. Share Photos disables the button in advance, while Share Video blocks the submission and shows an inline message. Each pattern is valid, and neither lets invalid data through.
- **Residual item, NOT verified:** it was not tested whether the server rejects an empty Video URL when the API is called directly. That was outside the authorized, UI-only scope and is noted as a possible follow-up.
- **Evidence (copied into the repo):** `execution/evidence/TC-024_R1_01_empty_url_before_click.png`, `TC-024_R1_02_required_message_after_click.png`, `TC-024_R1_03_feed_unchanged_after.png`, `TC-024_R1_network_log.json` (empty list). Screenshots for steps 0–7 stay in the session scratchpad only.

### Changes made

- `execution/execution-report.html`:
  - A dated addendum added under DEFECT-001; the original writeup is unchanged.
  - The heading now carries a status tag.
  - A dated update note added at the top.
  - The summary card now reads 0 confirmed functional defects + 1 UX inconsistency (was 1 open defect).
  - Pointers added at TC-019 (badge unchanged), BUZZ-TC-024 and the Exit Assessment.
- `test-design/test-design.csv` and `automation/` were not modified.

### Flagged for later (not done now)

- The Milestone 5 automation report (`automation/reports/`) and the DEFECT-001 regression probe (`automation/tests/defect-001.regression-probe.spec.ts`) still describe DEFECT-001 as a fully open functional defect. They have not been updated for this reclassification. This is flagged as a follow-up item for a separate review and was not changed as part of this update.

### Errors / limitations encountered

- The first login attempts timed out: the script waited for `/dashboard`, but after login the app redirects back to Buzz. No write had happened yet at that point.
- In the first step-5 attempt, the delete guard's route handler threw a regex error before the DELETE request was sent. A read-only feed check confirmed nothing had been deleted, and the guard was fixed before retrying.
- No credential values were recorded in this log, the report, or any evidence file.

---

## Entry: DEFECT-001 reclassification carried into Milestone 5 docs (documentation only)

- **Date:** 2026-09-28 (same session as the live re-verification entry above)
- **Requested by:** the human QC lead. This closes the "flagged for later" item in the entry above.
- **Scope:** a documentation and comment update only. **No automation was re-run**, and the probe's assertion logic was not changed. It still asserts that Share is enabled with an empty URL, which is still true.

### What changed

- `automation/tests/defect-001.regression-probe.spec.ts`: a dated "RECLASSIFIED 2026-09-28" paragraph was added to the header comment. It points to the execution-report addendum, records the live finding (zero requests, no post), and says the probe is kept as a lightweight UI-consistency check. The `BANNER` string, the test name, the tags and the assertion are unchanged. `tsc --noEmit` passes.
- `automation/reports/automation-execution-report.html`: dated 2026-09-28 notes were added next to each place that describes DEFECT-001 as open or present: the regression-probe tier card, the TC-019 result, a new "Reclassified 2026-09-28" row under the Formal Defects Status, and the Automation Health "Surfaced real defects" cell. All original wording is kept for audit.

### Unresolved items

- `automation/reports/automation-execution-report.html` is generated by `utils/build-report.js` (`npm run report`), which was not changed. Rebuilding the report would drop these hand-added notes. A future re-run or rebuild needs the reclassification added to the generator, or the notes re-applied.

---

## Entry: BUZZ-TC-027 partial closure (documentation only)

- **Date:** 2026-09-28 (same session as the entries above)
- **Requested by:** the human QC lead. **No new live actions were taken.** This entry records a closure decision based on evidence already gathered.
- **Evidence referenced:** step 2 of the DEFECT-001 live re-verification entry above. A post created by this run (post 13) was edited through "…" → Edit Post; `PUT /api/v2/buzz/posts/13` returned 200, and the edited text was still shown after a reload. The post was later deleted in step 5. The screenshots from that step stayed in the session scratchpad and were not copied into the repo.

### Decision

- **Self-edit:** confirmed working.
- **Cross-account edit enforcement** (whether the server blocks a different authenticated account from editing someone else's post): **not verified**. It would need a second real demo account or a temporary one, and the QC lead chose not to pursue that for now.
- **TC-027 stays BLOCKED** for the cross-account question specifically. This is a deliberate scope boundary.

### What changed

- `execution/execution-report.html`: a "BUZZ-TC-027 — Partial closure (2026-09-28)" note was added directly below the BUZZ-TC-021–027 BLOCKED list. The list item itself and the summary counts are unchanged.
- `test-design/test-design.csv`, `automation/` and the evidence screenshots were not modified.

---

## Entry: BUZZ-TC-021–026 formal reclassification, BLOCKED → PASS (documentation only)

- **Date:** 2026-09-28 (same session as the entries above)
- **Requested by:** the human QC lead. **No new live actions were taken.** This reuses the evidence from the "DEFECT-001 live re-verification (BUZZ-TC-024) and QC reclassification" entry above, steps 1, 3, 4, 6, 7 and 8.

### Status changes

| TC ID | Before | After | Evidence (live-run step) |
|---|---|---|---|
| BUZZ-TC-021 | BLOCKED (policy) | PASS | Step 1: post 13 / share 15 published |
| BUZZ-TC-022 | BLOCKED (policy) | PASS | Step 6: photo post, share 17 |
| BUZZ-TC-023 | BLOCKED (policy) | PASS | Step 7: video post, share 18 |
| BUZZ-TC-024 | BLOCKED (policy) | PASS | Step 8: inline "Required", 0 requests, no post |
| BUZZ-TC-025 | BLOCKED (policy) | PASS | Step 3: comment 8, counter 0 → 1 |
| BUZZ-TC-026 | BLOCKED (policy) | PASS | Step 4: repost share 16, Share counter 0 → 1 |

TC-027 stays BLOCKED (cross-account question only; see the partial-closure entry). TC-014 is unchanged (BLOCKED, tooling-limitation record).

### What changed

- `test-design/test-design.csv`: the Expected Result cell of BUZZ-TC-021 to 026 was replaced with the live-confirmed expectation. This is a test-design correction, the same category as C-01/TC-020. No other column or row was changed.
- `execution/evidence/`: 11 screenshots were copied from the live run's session scratchpad, using the `TC-0NN_R1_` names: TC-021 (post published, cleanup confirmed), TC-022 (photo attached, in feed, deleted), TC-023 (URL entered, in feed, deleted), TC-025 (comment added), TC-026 (repost dialog, repost in feed). The TC-024 evidence was already in the repo.
- `execution/execution-report.html`:
  - The six cases moved out of the grouped BLOCKED section into individual PASS entries. Each has steps, actual result, cleanup and evidence, and notes the QC-authorized override. A historical note records that they were originally BLOCKED.
  - TC-027 now has its own BLOCKED section, with its partial-closure note unchanged.
  - A dated update note was added at the top, and the Exit Assessment was updated.
  - Nothing was deleted.

### New summary totals

27 in scope: **22 PASS, 2 PASS†, 1 FAIL, 2 BLOCKED** (TC-014 tooling, BUZZ-TC-027 cross-account). Previously 16 PASS / 2 PASS† / 1 FAIL / 8 BLOCKED.

### Limitations

- TC-021's empty and whitespace-only input variants (CSV Test Data column) were not exercised in the live run. The PASS covers the normal text-post case only.
- The Milestone 5 automation report and `deliverables/QA-Pipeline-Milestone-Summary.xlsx` were not updated for these new counts.

---

## Entry: DEFECT-001 notes moved into the report generator (closes the rebuild risk)

- **Date:** 2026-09-28 (same session as the entries above)
- **Requested by:** the human QC lead. Documentation/tooling only; no tests were re-run. The report was rebuilt from the existing `results.json`.
- **Closes:** the "Unresolved items" note in the "DEFECT-001 reclassification carried into Milestone 5 docs" entry above. That note warned that `npm run report` would silently drop the hand-added DEFECT-001 notes.

### What changed

- `automation/utils/build-report.js`: added a `DEFECT_001_RECLASSIFICATION` config object, the single place to edit DEFECT-001's status change. The generator now renders the four notes from it: the regression-probe tier card, the TC-019 update note, the "Reclassified 2026-09-28" row under Formal Defects, and the Automation Health "Surfaced real defects" cell. Setting the object to `null` removes all four.
- `test-design/test-design.csv`: in TC-001's Expected Result, "(see BUZZ-TC-021, requires live confirmation)" became "(TC-021 was separately confirmed live and reclassified to PASS on 2026-09-28 - see execution/execution-report.html)". Nothing else changed.
- `automation/reports/automation-execution-report.html`: regenerated with `npm run report`. Compared with the previous committed version, the only change is the TC-001 line, which now comes from the CSV. The four DEFECT-001 notes are generated byte-identical to the earlier hand edits. TC-001's wording is shorter than last time's hand edit: it no longer includes "by this automation run" or the "Needs Automation = No" clause, because it now follows the CSV text exactly.

---

## Entry: BUZZ-TC-027 cross-account Edit Post verification (live) and resolution, BLOCKED → PASS

- **Date/Time:** 2026-09-28, about 10:57–11:04 UTC for the three live attempts, plus a read-only verification pass at 11:10 UTC. Post times in the demo showed 02:02 PM.
- **Requested by:** the human QC lead, as an explicit, scoped, one-time authorization to verify cross-account Edit Post enforcement (BUZZ-TC-027). This included creating one temporary employee and system user login, on condition that everything created (post and account) was deleted by the end of the run. This was not a formal milestone re-run.
- **Method:** a one-off Playwright script in the session scratchpad, using the Playwright already installed in `automation/node_modules`. Playwright MCP was not available in this session. No file under `automation/` was changed.
  - Logged in as Admin with the demo credentials shown on the login page. No values were recorded, and the login page was never screenshotted.
  - The temp account's password was generated in memory for this run only. It was never printed or written anywhere (0 matches in every output).
  - A network guard logged every non-GET API call. It allowed `PUT`/`DELETE` only for this run's own post, share, user and employee IDs.

### Temporary account

| Item | Value |
|---|---|
| PIM employee | "QA TempAccount027" (the suffix makes it unmistakably temporary) |
| System user | `qa-temp-027`, **ESS** role, Enabled |
| Final-run IDs | employee empNumber 446 (Employee Id 0637), user id 124 |
| Test post author | the demo Admin-role account (displayed this session as "JevAgent West") |

### Final (clean) run

| Step | Action | Result |
|---|---|---|
| 1 | As Admin, post "TC-027 cross-account test post - safe to delete." | Post 16 / share 18. The feed API gave the author `permission: {canUpdate: true, canDelete: true}` |
| 1a | Capture the app's own edit request shape: Admin opens Edit Post on their own post and clicks Post, and the guard blocks the `PUT` before it is sent | `PUT /api/v2/buzz/posts/16`, body `{"type","text","deletedPhotos":[]}`. Aborted, and the post text was confirmed unchanged |
| 2 | PIM → Add Employee, then Admin → User Management → Add (ESS, Enabled) | Employee 446 created (200), then user 124 created (200) and listed in System Users |
| 3a | Log out, then log in as `qa-temp-027` and open Buzz | The test post **was visible** to the temp account |
| 3b | Check the post's "…" menu | **No "…" options button** on the card, so no Edit and no Delete. The feed API gave the temp account `permission: {canUpdate: false, canDelete: false}` |
| 3c | The UI offered no path, so send the same edit request directly as the temp account | `PUT /api/v2/buzz/posts/16` with `{"type":"text","text":"… (edited by qa-temp-027)","deletedPhotos":[]}` → **HTTP 403** `{"error":{"status":403,"message":"Unauthorized"}}` |
| 3d | Re-read the post | Text unchanged |
| 4 | Cleanup as Admin, in the requested order | See below |

**Conclusion:** cross-account Edit Post is enforced **at the server**, independently of the UI hiding the option. No security finding. BUZZ-TC-027 → **PASS**.

### Cleanup verification

- **Post 16 / share 18:** deleted via its "…" menu → Delete Post. `DELETE /api/v2/buzz/shares/18` → 200. It was gone from the feed API and the feed UI afterwards.
- **User `qa-temp-027` (id 124):** deleted via System Users → trash → Yes, Delete. `DELETE /api/v2/admin/users` → 200. A System Users search for the username then showed "No Records Found".
- **Employee 446:** deleted via the PIM Employee List. `DELETE /api/v2/pim/employees` → 200.
- **Independent read-only re-check at 11:10 UTC**, covering both temp employee records, 429 (from attempt 2) and 446:
  - `GET /api/v2/pim/employees/429` and `/446` both returned **422 "Invalid Parameter" (empNumber)**. For comparison, the same call for the known Admin employee (empNumber 7) returned 200, so the 422 means "no such employee".
  - The PIM employee list API, searched for "TempAccount", "0621" and "0637", returned 0 records under `onlyCurrent`, `currentAndPast` and `onlyPast`.
  - The PIM UI, searching "TempAccount" with Include = Current and Past Employees, showed **"No Records Found"**.
- **Side effect on shared data:** during the final run the test post picked up **1 comment that this test did not create**, presumably from another user of the shared demo. Deleting the post removed that comment too. This could not be avoided on a shared public instance.

### Operational hiccups (not defects) and how they were resolved

1. **Attempt 1, stopped part-way.** Post 15 / share 17 was created, but the script then failed to find it in the feed: it read `item.post.text`, while the feed API puts the text in `item.text`. The script stopped before creating any account, which left post 15 in the feed. A read-only GET of the feed confirmed the response shape, and the lookup was fixed.
2. **Attempt 2, probe scoping bug.** Attempt 2 reused post 15 instead of creating a duplicate. Its self-edit shape probe was registered as a separate route. The guard route handled the request first and let it through, so the Admin's own edit went out and changed post 15's text to "… [shape-probe]". The same attempt created employee 429, then timed out at user creation, because the guard had blocked the app's password-strength check (`POST /auth/public/validation/password`). Cleanup ran in the script's `finally` block: `DELETE /api/v2/buzz/shares/17` → 200 and employee 429 deleted → 200. No user had been created. For the final run, the probe was moved into the guard itself (it captures the request, then aborts it), the password-validation call was allowed, and a check was added to stop the run if the probe ever changed the post text.

### Evidence (copied into the repo)

`execution/evidence/`, from the final run:
- `TC-027_R1_01_post_created_admin.png`
- `TC-027_R1_02_temp_employee_created.png`
- `TC-027_R1_03_temp_user_created.png`
- `TC-027_R1_04_temp_account_no_options_menu.png`
- `TC-027_R1_05_direct_api_put_403.png`
- `TC-027_R1_06_post_unchanged_after_attempt.png`
- `TC-027_R1_07_cleanup_post_deleted.png`
- `TC-027_R1_08_cleanup_temp_user_deleted.png`
- `TC-027_R1_09_cleanup_temp_employee_deleted.png`
- `TC-027_R1_10_pim_verify_current_and_past.png`

The full request/response log, the attempt-2 screenshots and the scripts stay in the session scratchpad only.

### Changes made

- `execution/execution-report.html`:
  - A dated "BUZZ-TC-027 — RESOLVED (2026-09-28)" note, with the evidence, added below the existing partial-closure note. The original BLOCKED paragraph and the partial-closure note are unchanged.
  - The section heading now reads PASS, with the original BLOCKED framing kept in brackets.
  - A dated update note added at the top.
  - Summary cards updated.
  - In the Exit Assessment, BUZZ-TC-027 moved from "Blocked / Failed / Out of scope" to "Fully validated".
- `test-design/test-design.csv` and `automation/` were not modified.

### New summary totals

27 in scope: **23 PASS, 2 PASS†, 1 FAIL, 1 BLOCKED** (TC-014, tooling only). Previously 22 PASS / 2 PASS† / 1 FAIL / 2 BLOCKED.

### Limitations

- Only an **ESS**-role second account was tested. Cross-account edits between two Admin-role accounts were not tested.
- Cross-account **Delete** was not tested at the API level. The UI offered no Delete option to the temp account, and the feed API reported `canDelete: false`.
- The Milestone 5 automation report and `deliverables/QA-Pipeline-Milestone-Summary.xlsx` were not updated for these new counts.
- No credential values were recorded in this log, the report, or any evidence file.
