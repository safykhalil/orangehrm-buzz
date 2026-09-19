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
