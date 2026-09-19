# UI Exploration Findings — Buzz Module

**Milestone:** 2 — UI Exploration
**PRD input:** `docs/PRD.md`, Version 1.0 (Milestone 1 — Discovery), Section 6 (Module: Buzz) and related FR-016–FR-019, BR-005
**Application URL:** https://opensource-demo.orangehrmlive.com/
**Coverage scope for this run:** Buzz only
**Observation date:** 2026-09-19
**Method:** Direct interaction via Playwright MCP tools, authenticated as the demo Admin-role user. Every claim below is either observed directly this run (with evidence) or explicitly marked `Unknown / Not exercised`.

---

## 1. Executive Summary

The Buzz module was deep-dived under the skill's default Interaction Policy: safe/reversible actions (filters, expand/collapse, modal previews, Like-then-Unlike with confirmed reversal) were exercised; content-creating actions (posting, commenting, uploading, sharing, editing, deleting) were not performed. All four PRD-documented feed regions — post composer, feed filters, post feed, and Upcoming Anniversaries panel — were located and functionally exercised.

Headline findings:
- **Feed filters work as sort controls, not just labels.** "Most Liked Posts" correctly sorts descending by like count; "Most Commented Posts" reorders too, but its tie-break order (all posts had 0 comments) differs from "Most Liked Posts"' tie-break order, implying independent secondary sort keys.
- **The per-post "..." options menu resolves part of PRD's BR-005 (previously entirely `Unknown / Not observed`)**: it shows **"Edit Post" + "Delete Post"** on the logged-in user's own post, but **only "Delete Post"** on every other author's post. This is concrete, if partial, evidence of the permission model — the logged-in Admin-role account can delete any post but edit only their own.
- **PRD correction:** Section 5 described the Buzz Topbar Menu's single icon as a "collapse/hamburger control." It is actually a **Help ("?") button** that opens `https://starterhelp.orangehrm.com/hc/en-us` in a new browser tab — not a navigation control at all.
- **A validation asymmetry**: the "Share Photos" modal's Share button is disabled until a photo is attached; the "Share Video" modal's Share button is **not** disabled even with an empty Video URL field.
- **Automation-readiness concern**: several interactive icons (Like, Comment toggle, Share/repost, "...", the photo-viewer close button) have no accessible name and had to be located by DOM structure/ordinal position rather than role+name. The Like icon additionally uses a **duplicated, non-unique `id="heart-svg"`** across every post on the page — invalid HTML and a locator hazard for later automation.
- **Tooling constraint, not an app behavior**: typing into the post composer ("What's on your mind?") was blocked by the Claude Code permission classifier itself ("External System Writes"), independent of and in addition to the skill's own no-posting policy.

Counts: 4 posts in the feed (no pagination or load-more control observed — the page footer appears immediately after the 4th post). Of the 4 PRD Functional Requirements for Buzz (FR-016–FR-019), all 4 had at least their structural claims confirmed; posting/commenting/sharing *submission* behavior remains `Unknown / Not exercised` by policy design. One PRD navigation claim (the "collapse/hamburger" control) was found to be incorrect and is corrected here.

---

## 2. Scope & Method

- **Module covered:** Buzz only (`/web/index.php/buzz/viewBuzz`).
- **PRD version used as input:** 1.0 (Milestone 1), specifically Section 6 (Module: Buzz), FR-016–FR-019, BR-005, and Section 12's Dashboard→Buzz dependency note.
- **Observation date:** 2026-09-19.
- **Authenticated as:** the demo Admin-role account (banner displayed "manda user"; one feed post's author displayed as "manda akhil user" — see Reconciliation §5 for a note on this discrepancy against the PRD's Milestone 1 session, which recorded a different display name).
- **Interaction Policy applied this run (per the `ui-exploration` skill, narrowed further by the task prompt):**
  - **Allowed and exercised:** navigation; opening/closing modals that don't submit; feed filter clicks; Read More expand; Like → Unlike (only where the reversal was confirmed successful before moving on); Comment-box expand/collapse (without typing/submitting); opening the photo lightbox; opening (not submitting) the Share Photos, Share Video, and Share Post (repost) modals; opening the per-post "..." options menu (without selecting Edit or Delete); opening the profile menu; clicking the Topbar icon.
  - **Explicitly excluded, per task instructions:** creating new content — publishing a post, submitting a comment, uploading a photo/video, completing a repost — even though the PRD (Section 6, Section 13, BR-005) flagged the posting/comment flow as needing verification. This gap is intentional and is catalogued in §6, not resolved in either direction.
  - **Also excluded, per skill default policy:** Delete Post, Edit Post (both are edit/delete actions on shared demo records with uncertain/irreversible effect).

---

## 3. Screen-by-Screen Findings

### 3.1 Buzz Newsfeed — main page (entry point)

- **Entry path:** Sidebar → Buzz, or direct URL `/web/index.php/buzz/viewBuzz`.
- **Elements present:** post composer, three feed-filter buttons, a scrollable post feed (4 posts), and a right-hand "Upcoming Anniversaries" panel. Page footer ("OrangeHRM OS 5.9 © 2005–2026...") appears immediately after the last post — confirming the feed is not paginated and does not lazy-load additional posts on scroll.
- **Evidence:** URL `https://opensource-demo.orangehrmlive.com/web/index.php/buzz/viewBuzz`; heading "Buzz" (role heading, level 6); on-page text "Buzz Newsfeed".

### 3.2 Post composer (idle state)

- **Elements:** avatar image, `textbox "What's on your mind?"`, `button "Post"`, `button "Share Photos"`, `button "Share Video"`.
- **Observed behavior:** Composer renders identically before and after other feed interactions (filters, like toggles) — its state does not reset or change based on feed activity.
- **Not exercised:** typing into the textbox. This was attempted (to observe whether the Post button's enabled/disabled state responds to input, matching the skill's "read validation indicators without submitting" allowance) but the action was **blocked by the Claude Code permission classifier** itself, citing "External System Writes" — a tool-level restriction independent of the skill's own posting ban. See §6.
- **Evidence:** `textbox "What's on your mind?"` (ref captured via accessibility snapshot), `button "Post"`.

### 3.3 Share Photos modal

- **Entry:** click `button "Share Photos"` in the composer.
- **Elements:** dialog titled "Share Photos"; avatar; `textbox "What's on your mind?"`; a "Choose File" control plus an "Add Photos" dropzone (`cursor=pointer`); `button "Share"`.
- **Observed behavior:** The **"Share" button is disabled** (`[disabled]` state confirmed in the accessibility tree) while no photo is attached. This is a validation state read without submitting, per policy.
- **Not exercised:** invoking the native file chooser ("Choose File" / "Add Photos") or attaching any file — this is an upload action, excluded by policy.
- **Closed via:** the "×" button, confirmed the underlying page was unaffected afterward.
- **Evidence:** `dialog` with `paragraph "Share Photos"`, `button "Share" [disabled]`.

### 3.4 Share Video modal

- **Entry:** click `button "Share Video"` in the composer.
- **Elements:** dialog titled "Share Video"; avatar; `textbox "What's on your mind?"`; a "Video URL" field (`textbox "Paste Video URL"`); `button "Share"`.
- **Observed behavior:** Unlike Share Photos, the **"Share" button here is NOT disabled**, even though the "Paste Video URL" field is empty. This is a discrepancy/asymmetry — see §5.
- **Not exercised:** typing a URL or clicking Share (would create content).
- **Closed via:** the "×" button.
- **Evidence:** `dialog` with `paragraph "Share Video"`, `textbox "Paste Video URL"`, `button "Share"` (enabled).

### 3.5 Feed filters: Most Recent / Most Liked / Most Commented Posts

- **Elements:** three buttons in a row above the post feed: `button " Most Recent Posts"`, `button " Most Liked Posts"`, `button " Most Commented Posts"`.
- **Observed behavior:**
  - Default state on page load: "Most Recent Posts" is the active filter (confirmed via `[active]` attribute in the accessibility snapshot) and the feed order was: manda akhil user (0 Likes) → Sania Shaheen (1 Like) → Rebecca Harmony (0 Likes) → Russel Hamilton (2 Likes) — i.e., reverse-chronological by timestamp (05:38 → 05:38 → 05:34 → 05:33).
  - Clicking "Most Liked Posts" re-sorted the same 4 posts descending by like count: Russel Hamilton (2) → Sania Shaheen (1) → Rebecca Harmony (0) → manda akhil user (0). The clicked button gained the `[active]` state.
  - Clicking "Most Commented Posts" re-sorted to: Russel Hamilton → Rebecca Harmony → Sania Shaheen → manda akhil user. All 4 posts have 0 comments, so this is entirely a tie-break order — and it differs from the "Most Liked Posts" tie-break order (which put Sania before Rebecca; "Most Commented" puts Rebecca before Sania). This indicates the two sorts use different secondary keys, not a shared stable sort.
  - Clicking "Most Recent Posts" again restored the original reverse-chronological order exactly — confirming the filter change is fully reversible and non-destructive (no underlying data was altered by re-sorting).
- **Evidence:** `button " Most Liked Posts" [active]` and `button " Most Commented Posts" [active]` observed in successive accessibility snapshots; before/after post orderings recorded above.

### 3.6 Individual post — collapsed/expanded text ("Read More")

- **Screen:** Sania Shaheen's post, which has a long text body.
- **Observed behavior:** Before interaction, the post visually truncates the text (CSS-based; the accessibility tree already exposed the full text even before expansion) and shows a `paragraph "Read More"` link below it. Clicking "Read More" visually expands the full text, and **the "Read More" link itself disappears from the accessibility tree afterward** — there is no "Show Less" or collapse control to re-truncate it.
- **Evidence:** screenshots `docs/evidence/exploration/buzz-sania-truncated.png` (before) and `docs/evidence/exploration/buzz-sania-expanded.png` (after); `paragraph [cursor=pointer]: Read More` present before, absent after.

### 3.7 Individual post — Like / Unlike toggle

- **Screen:** tested on manda akhil user's post (0 Likes) and, during locator exploration, inadvertently also on Rebecca Harmony's post (0 Likes) — both reversed successfully before moving on, per policy.
- **Observed behavior:**
  1. Before: "0 Likes", heart icon rendered grey/outline.
  2. Click heart icon (`#heart-svg`): count becomes "1 Like", heart icon turns solid red. Screenshot confirms the visual state (`docs/evidence/exploration/buzz-liked-state.png`).
  3. Click the same icon again: count returns to "0 Likes", icon returns to grey/outline. Confirmed via a follow-up accessibility snapshot before proceeding — satisfying the skill's requirement that a reversal must be *confirmed* successful.
- **Note:** the Like icon element has **no accessible name** and uses `id="heart-svg"` — an id that is **duplicated across every post's Like icon on the page** (an HTML validity issue; ids must be unique). It had to be targeted via `page.locator('#heart-svg').nth(n)` by feed position, which is fragile for automation (position shifts whenever a sort filter is applied).
- **Evidence:** accessibility snapshots showing `paragraph: 0 Likes` → `paragraph [cursor=pointer]: 1 Like` → `paragraph: 0 Likes`; screenshots `docs/evidence/exploration/buzz-liked-state.png`.

### 3.8 Individual post — Comment box expand/collapse

- **Screen:** manda akhil user's post.
- **Observed behavior:** Clicking the "0 Comments" text expands an inline `textbox "Write your comment..."` (with the current user's avatar) directly beneath the Like/Comment/Share row — no existing comments were shown (post has 0 comments). Clicking "0 Comments" a second time collapses the textbox again, with no visible side effects. No text was typed into the box and no comment was submitted.
- **Evidence:** screenshots `docs/evidence/exploration/buzz-comments-expanded.png` and `docs/evidence/exploration/buzz-comments-collapsed-check.png`; snapshot diff showing `textbox "Write your comment..."` appearing then disappearing.

### 3.9 Individual post — options menu ("...")

- **Screens tested:** manda akhil user's post (the logged-in user's own post, by avatar/name match), Sania Shaheen's post, and Rebecca Harmony's post (both other authors).
- **Observed behavior:**
  - On **manda akhil user's own post**: the menu shows two items — **"Edit Post"** and **"Delete Post"**.
  - On **Sania Shaheen's post** (another author): the menu shows **only "Delete Post"** — no Edit option.
  - On **Rebecca Harmony's post** (another author): same as above — **only "Delete Post"**.
  - This is a consistent, reproducible pattern across all three tested posts, not a one-off.
- **Not exercised:** clicking either "Edit Post" or "Delete Post" — both are excluded by policy (editing/deleting shared demo records).
- **Significance:** this directly informs PRD's BR-005 ("Buzz post visibility, moderation, and edit/delete permission rules" — previously `Unknown / Not observed`). It confirms the logged-in Admin-role account can delete *any* post regardless of authorship, but the UI only offers in-place editing for the account's own post. Whether this is enforced server-side (vs. only hidden in the UI) was not tested — see §7 Open Questions.
- **Evidence:** screenshots `docs/evidence/exploration/buzz-post-options-menu.png` (own post: Edit+Delete), `docs/evidence/exploration/buzz-sania-options-menu.png` (Delete only), `docs/evidence/exploration/buzz-rebecca-options-menu.png` (Delete only).

### 3.10 Individual post — Share (repost) modal

- **Screen:** manda akhil user's post, clicking the third action icon (Share) in the Like/Comment/Share row.
- **Elements:** dialog titled "Share Post"; avatar; `textbox "What's on your mind?"` (for an optional caption); a read-only preview of the original post (author name, timestamp, full text); `button "Share"` (not disabled, even with an empty caption).
- **Not exercised:** clicking "Share" (would create a new repost, visible to other users).
- **Closed via:** the "×" button.
- **Evidence:** screenshot `docs/evidence/exploration/buzz-share-icon-click.png`; dialog `paragraph "Share Post"`.

### 3.11 Attached photo — lightbox modal

- **Screen:** Rebecca Harmony's post, which has an attached photo.
- **Observed behavior:** Clicking the photo opens a full-screen lightbox: the image at larger size on the left, and on the right a duplicated post-detail panel — author, timestamp, caption text, Like/Comment/Share row (independently interactive — its own "0 Likes" state matched the feed's), and a "Write your comment..." box. Closing via the "×" (top-left of the lightbox) returned cleanly to the normal feed view with no residual state change.
- **Evidence:** screenshot `docs/evidence/exploration/buzz-image-click.png`; dialog/lightbox with `img "photo"`, `button ""` (close, `.orangehrm-photo-viewer-close`).

### 3.12 Author name and avatar — non-interactive

- **Observed behavior:** Clicking a post author's displayed name (tested: "Sania Shaheen") or their avatar image produced **no navigation and no visible effect** — the URL remained `/web/index.php/buzz/viewBuzz` throughout. There is no profile drill-through from the Buzz feed.
- **Evidence:** URL unchanged across both click attempts (confirmed via page snapshot's `Page URL` field).

### 3.13 Upcoming Anniversaries panel

- **Elements:** panel heading "Upcoming Anniversaries"; one entry showing avatar, name ("manda user"), job title ("HR Manager"), a year-count badge ("36" / "Years"), and a date ("Oct 11").
- **Observed behavior:** Clicking the entry produced no navigation or visible effect — confirmed static/display-only.
- **Evidence:** URL unchanged after click; screenshot `docs/evidence/exploration/buzz-before-readmore.png` shows the panel's baseline appearance.

### 3.14 Topbar Menu icon — corrected from PRD

- **PRD claim (Section 5):** "Directory and Buzz show only a collapse/hamburger control in the Topbar Menu region."
- **Observed behavior:** clicking this icon (which carries `title="Help"`, not a hamburger/collapse role) opened a **new browser tab** to `https://starterhelp.orangehrm.com/hc/en-us` — an external OrangeHRM help/support site. It is not a sidebar or sub-navigation collapse toggle. The tab was closed immediately without further navigation on the external site.
- **Evidence:** screenshot `docs/evidence/exploration/buzz-help-button.png`; tab list showing tab 1 at `https://starterhelp.orangehrm.com/hc/en-us` before it was closed.

### 3.15 Profile menu (global, not Buzz-specific, re-verified on the Buzz page)

- **Elements:** `menuitem "About"`, `menuitem "Support"`, `menuitem "Change Password"`, `menuitem "Logout"`.
- **Observed behavior:** matches PRD FR-020 exactly; opened and closed without selecting an item.
- **Evidence:** accessibility snapshot listing all four menu items under `list [ref] > listitem > menu`.

---

## 4. Locator / Selector Reference Table

| Element | Role / Locator | Screen | Notes |
|---|---|---|---|
| Post composer textbox | `getByRole('textbox', { name: "What's on your mind?" })` | Buzz Newsfeed main | Typing blocked this run by tool permission classifier |
| Post button | `getByRole('button', { name: 'Post' })` | Buzz Newsfeed main | Not clicked (would publish) |
| Share Photos button | `getByRole('button', { name: 'Share Photos' })` | Buzz Newsfeed main | Opens modal |
| Share Video button | `getByRole('button', { name: 'Share Video' })` | Buzz Newsfeed main | Opens modal |
| Most Recent Posts filter | `getByRole('button', { name: ' Most Recent Posts' })` | Buzz Newsfeed main | Default; carries `[active]` state when selected |
| Most Liked Posts filter | `getByRole('button', { name: ' Most Liked Posts' })` | Buzz Newsfeed main | Confirmed descending like-count sort |
| Most Commented Posts filter | `getByRole('button', { name: ' Most Commented Posts' })` | Buzz Newsfeed main | Tie-break order differs from Most Liked |
| Post author name text | `getByText('<Author Name>')` | Post card header | Plain text, not a link; no navigation on click |
| Post avatar image | `getByRole('img', { name: 'profile picture' }).nth(n)` | Post card header | Not a link; ordinal index shifts when feed re-sorts |
| Post options ("...") button | icon-only `button ""`, e.g. `.orangehrm-buzz-post-header-config .oxd-icon-button` | Post card header | No accessible name; opens Edit/Delete (own) or Delete-only (others') menu |
| "Edit Post" menu item | `menuitem`/`listitem` "Edit Post" | Post options menu | Only appears on the logged-in user's own post; not clicked |
| "Delete Post" menu item | `menuitem`/`listitem` "Delete Post" | Post options menu | Appears on every post; not clicked |
| Read More link | `getByRole('paragraph').filter({ hasText: 'Read More' })` | Post card body (truncated) | One-directional; link removed from DOM after expand |
| Like icon | `locator('#heart-svg').nth(n)` | Post card action row | **Duplicate id across all posts** — must disambiguate by index; toggles Like/Unlike |
| Like count text | `paragraph` "N Like(s)" (`cursor=pointer`) | Post card action row | Same toggle target region as heart icon |
| Comment toggle | `getByText('Comments').first()` (or per-post equivalent) | Post card action row | Expands/collapses inline comment textbox; no accessible name on the icon variant |
| Comment input | `getByRole('textbox', { name: 'Write your comment...' })` | Post card (expanded) | Not typed into/submitted |
| Share (repost) icon | icon-only `button ""`, 3rd action icon in the row | Post card action row | No accessible name; opens "Share Post" modal |
| Share Post modal "Share" button | `getByRole('button', { name: 'Share' })` (within Share Post dialog) | Share Post modal | Not clicked (would create new post) |
| Attached photo image | `locator('.orangehrm-buzz-post-body-picture')` | Post card body (posts with image) | Opens lightbox modal |
| Lightbox close button | `locator('.oxd-icon-button.orangehrm-photo-viewer-close')` | Lightbox modal | Closes without side effects |
| Share Photos: Add Photos dropzone | `getByText('Add Photos')` (`cursor=pointer`) | Share Photos modal | Native file chooser not invoked this run |
| Share Photos: "Share" button | `getByRole('button', { name: 'Share' })` `[disabled]` | Share Photos modal | Disabled until a photo is added |
| Share Video: Video URL textbox | `getByRole('textbox', { name: 'Paste Video URL' })` | Share Video modal | Not typed into |
| Share Video: "Share" button | `getByRole('button', { name: 'Share' })` (enabled) | Share Video modal | **Not disabled** despite empty URL — asymmetry vs. Share Photos |
| Modal close ("×") | `getByRole('button', { name: '×' })` | Share Photos / Share Video / Share Post dialogs | Ambiguous across multiple open dialogs — resolves to first match; scope to the open dialog in automation |
| Profile menu trigger | `locator('span').filter({ hasText: 'manda user' })` (banner) | Global banner (visible on Buzz page) | Opens account menu |
| Profile menu items | `menuitem` "About" / "Support" / "Change Password" / "Logout" | Profile menu | Matches FR-020 |
| Topbar "Help" (?) button | `getByTitle('Help')` | Buzz page banner/Topbar area | Opens external URL in a **new tab** — not a collapse/hamburger control |
| Upcoming Anniversaries entry | `getByText('<name>HR Manager<years>Years<date>')` (static block) | Right side panel | Not interactive |

---

## 5. Reconciliation vs. PRD

### Confirmed (PRD claims verified by this exploration)

- FR-016: composer with "What's on your mind?" input, Post button, Share Photos/Share Video buttons — structurally confirmed present and each opens its expected control (§3.2–3.4).
- FR-017: feed post displays author, timestamp, content, and Like/Comment/Share counters — confirmed on all 4 posts, with exact interactive behavior mapped (§3.6–3.9).
- FR-018: three feed sort/filter controls — confirmed to be **functionally correct sorts**, not just present labels (§3.5).
- FR-019: "Upcoming Anniversaries" panel with name, job title, photo, year, date — confirmed, and confirmed static/non-interactive (§3.13).
- PRD Section 6's post-region inventory (post composer, feed filters, post feed, Upcoming Anniversaries side panel) — all four regions located exactly as described.
- PRD's "Read More" truncation control (Section 6) — confirmed to exist and expand successfully (§3.6).

### Discrepancies (PRD incorrect, or PRD silent on something observed)

1. **PRD incorrect — Topbar icon.** PRD Section 5 calls the Buzz Topbar Menu's single icon a "collapse/hamburger control." It is a **Help button** that opens an external support site in a new tab. See §3.14.
2. **New — Share Video vs. Share Photos validation asymmetry.** Not mentioned in PRD Section 10 (Validation Rules). See §3.4.
3. **New — partial resolution of BR-005.** PRD marked Buzz post edit/delete permissions entirely `Unknown / Not observed`. This run found a reproducible pattern: Edit Post is offered only for the logged-in user's own post; Delete Post is offered for every post regardless of author. See §3.9. This is still not a *complete* picture of BR-005 (see §7).
4. **New — photo lightbox modal.** Not documented in PRD Section 6. Clicking an attached photo opens a full post-detail lightbox, distinct from the inline feed view. See §3.11.
5. **New — "Read More" is one-directional.** PRD did not note whether expansion is reversible; it is not — no collapse control appears after expanding. See §3.6.
6. **New — no profile drill-through.** Author name/avatar clicks do nothing. PRD did not make a claim either way; this closes that gap. See §3.12.
7. **New — sort tie-break inconsistency.** "Most Liked Posts" and "Most Commented Posts" order same-count posts differently from each other. PRD only asserted the three filters exist; this is new behavioral detail. See §3.5.
8. **New — locator/automation-readiness issues.** Several icon-only controls (Like, Comment toggle, Share/repost, "...", lightbox close) lack accessible names, and the Like icon's `id="heart-svg"` is duplicated across every post on the page (invalid HTML). PRD did not assess automation-readiness (out of scope for Milestone 1); flagged here because the skill requires this table to feed the automation milestone. See §4.
9. **Identity/session discrepancy (environmental, not a defect).** PRD's Milestone 1 session recorded the logged-in profile name as "NewName OTH5002"; this run's session displayed "manda user" (with one feed post authored by "manda akhil user", the same avatar photo). This is consistent with the shared/public OrangeHRM demo environment's data varying between independent sessions, not an application defect — but it means any future test-data-dependent assertions (e.g., "post by manda akhil user has exactly 0 Likes") should be treated as **snapshot-specific**, not as stable fixtures.

### Newly-clarified (PRD had it right but shallow; this run adds depth)

- FR-018's filters: PRD only asserted their existence; this run confirmed actual sort correctness and exposed the tie-break inconsistency (§3.5).
- Section 6's Like/Comment/Share counters: PRD listed them as present; this run confirmed Like is a live, reversible toggle with a distinct visual "liked" state (filled red heart) and that Comment expands an inline composer without requiring page navigation (§3.7–3.8).
- Feed size: PRD did not state a count; this run confirms exactly 4 posts exist with no pagination/infinite-scroll mechanism (§3.1).

---

## 6. Excluded Actions & Why

All of the following fall under the skill's default "not allowed" policy, the task prompt's explicit narrowing (no posting/commenting even though PRD flagged it), or both. Each is marked `Unknown / Not exercised`:

| Excluded action | Why excluded | What would resolve it |
|---|---|---|
| Typing into / submitting the "What's on your mind?" composer, then clicking Post | Creates new content visible to other users of a shared public demo; additionally, the typing step itself was blocked by the Claude Code tool's own permission classifier ("External System Writes") before the policy question was even reached | Explicit authorization to post, in a disposable/sandboxed instance, plus a tool-permission allowance for text entry into this field |
| Uploading a photo via "Share Photos" → "Add Photos"/"Choose File" | File upload, explicitly disallowed by policy | Authorization to upload in a disposable instance |
| Entering a URL and submitting "Share Video" | Creates new content | Same as above |
| Typing and submitting a comment | Creates new content visible to others | Same as above |
| Clicking "Share" in the Share Post (repost) modal | Creates a new post visible to others | Same as above |
| Clicking "Edit Post" (even just to view the edit form) | Skill policy explicitly excludes editing any record, out of caution about whether opening the form itself triggers a lock/draft state; reversal was not certain | A policy decision from the QC lead confirming that *opening* (not saving) the edit form is safe to explore |
| Clicking "Delete Post" | Destructive, irreversible for shared demo data | Never — this remains excluded on any run against this shared demo instance |
| Verifying whether the enabled Share-Video "Share" button actually submits with an empty URL (would confirm/deny a validation bug) | Would require clicking Share, i.e., creating content | Authorization to submit in a disposable instance, or server-side/API-level testing outside the UI |
| Logging in as an ESS-role user to compare permissions on the options menu | Out of scope for this run (task used the existing Admin-role demo session); would also require separate credentials not confirmed to exist | ESS credentials and explicit scope to test cross-role Buzz behavior |

---

## 7. Open Questions

1. **Is Edit Post visibility a client-side UI check or a server-enforced permission?** This run only observed which menu items *render*; it did not (and could not, per policy) attempt to submit an edit to another user's post to see whether the server would reject it. Resolving this needs either a sanctioned edit-flow test on a disposable instance or a code/API review.
2. **Can a non-Admin (ESS) user delete other users' posts, or is "Delete any post" specific to the Admin role?** This run only tested one account (Admin-role, per Milestone 1's PRD). Needs a second, ESS-role session to compare.
3. **What does the composer's Post button do with empty vs. whitespace-only vs. very long text?** Blocked this run by the tool's permission classifier before the skill's own policy was even relevant. Needs either a policy exception plus a tool-permission allowance, or a decision to test this at the API layer instead of the UI.
4. **Does "Most Commented Posts"' tie-break actually key off comment recency/id, and does "Most Liked Posts" key off something else?** Both sorts were only observed with all-zero comment counts; the underlying secondary sort key was not determinable from black-box observation alone.
5. **Is there a maximum feed size / does the feed ever paginate?** Only 4 posts exist in this environment; whether a larger post volume would trigger pagination or infinite scroll is unconfirmed.
6. **Why did this session's logged-in display name ("manda user"/"manda akhil user") differ from Milestone 1's ("NewName OTH5002")?** Likely explained by the shared public demo resetting or rotating seed data between sessions, but this was not independently confirmed — worth a quick sanity check before Milestone 3 test design relies on any specific named fixture data.

---

## 8. Evidence Index

**URLs / paths visited:**
- `https://opensource-demo.orangehrmlive.com/web/index.php/auth/login` (session start)
- `https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index` (post-login redirect)
- `https://opensource-demo.orangehrmlive.com/web/index.php/buzz/viewBuzz` (all Buzz screen states in this document)
- `https://starterhelp.orangehrm.com/hc/en-us` (external target of the Topbar "Help" button; opened in a new tab and immediately closed, no further navigation)

**Key roles/selectors cited above (see §4 for the full table):**
`getByRole('textbox', { name: "What's on your mind?" })`, `getByRole('button', { name: 'Post' })`, `getByRole('button', { name: 'Share Photos' })`, `getByRole('button', { name: 'Share Video' })`, `getByRole('button', { name: ' Most Recent Posts' })`, `getByRole('button', { name: ' Most Liked Posts' })`, `getByRole('button', { name: ' Most Commented Posts' })`, `locator('#heart-svg')`, `getByText('Comments')`, `getByRole('textbox', { name: 'Write your comment...' })`, `locator('.orangehrm-buzz-post-body-picture')`, `locator('.oxd-icon-button.orangehrm-photo-viewer-close')`, `getByRole('button', { name: '×' })`, `getByTitle('Help')`, `menuitem "About"/"Support"/"Change Password"/"Logout"`.

**Screenshots captured this run (local evidence files, project root):**
`docs/evidence/exploration/buzz-before-readmore.png`, `docs/evidence/exploration/buzz-sania-truncated.png`, `docs/evidence/exploration/buzz-sania-expanded.png`, `docs/evidence/exploration/buzz-top-after-expand.png`, `docs/evidence/exploration/buzz-first-post-actions.png`, `docs/evidence/exploration/buzz-liked-state.png`, `docs/evidence/exploration/buzz-comments-expanded.png`, `docs/evidence/exploration/buzz-comments-collapsed-check.png`, `docs/evidence/exploration/buzz-post-options-menu.png`, `docs/evidence/exploration/buzz-sania-options-menu.png`, `docs/evidence/exploration/buzz-rebecca-options-menu.png`, `docs/evidence/exploration/buzz-image-click.png`, `docs/evidence/exploration/buzz-share-photos-click.png`, `docs/evidence/exploration/buzz-share-icon-click.png`, `docs/evidence/exploration/buzz-help-button.png`, `docs/evidence/exploration/buzz-feed-bottom.png`.

**Final-state verification:** before ending this session, a final accessibility snapshot confirmed the feed's Like counts (0, 1, 0, 2 across the four posts, in original reverse-chronological order) matched the state observed at the very start of this run — confirming no net data changes were left behind despite the two Like→Unlike round-trips performed during exploration (§3.7).
