# Product Requirements Document — OrangeHRM (Live Instance)

**PRD Version:** 1.0 (Milestone 1 — Discovery)
**Observation Date:** 2026-09-19
**Application URL:** https://opensource-demo.orangehrmlive.com/
**Detailed-scope module for this run:** Buzz (reserved for Milestone 2 — UI Exploration)
**Method:** Direct, read-only navigation of the live application using Playwright MCP tools, plus the task requirements supplied for this run. General/trained knowledge of "typical" OrangeHRM behavior was explicitly not used — every claim below is either observed directly (with page/URL evidence) or marked `Unknown / Not observed`.

---

## 1. Application Overview

OrangeHRM is a Human Resource Management (HRM) web application. The instance analyzed is the public OrangeHRM Open Source demo, identified in the page footer as **"OrangeHRM OS 5.9"** (footer text: "© 2005 - 2026 ... OrangeHRM, Inc. All rights reserved.", observed on every page visited).

Observed capability areas (from the persistent sidebar navigation): system/user administration, personnel information management (PIM), leave management, time & attendance, recruitment, self-service employee info, performance management, an employee directory, system maintenance, expense claims, and an internal social feed ("Buzz").

**Scope of this document (Milestone 1):** a full module inventory at overview level (Sections 1–5, 7–15), based only on what is directly reachable and safely observable without submitting forms or changing data. The **Buzz** module additionally receives a dedicated, still high-level, treatment in Section 6, since it is the designated detailed-scope module for the Milestone 2 UI Exploration. Buzz is **not** deep-dived (no field-by-field interaction map, no test scenarios) in this document.

- **Observation Date:** 2026-09-19
- **PRD Version:** 1.0

---

## 2. System Actors

| Actor | Status | Evidence |
|---|---|---|
| **Admin** | Observed | Selectable value in Admin → User Management → System Users → "User Role" filter dropdown (options: `-- Select --`, `Admin`, `ESS`). The demo session used during this run operated under this role (profile name "NewName OTH5002", job title "HR Manager" per the Buzz "Upcoming Anniversaries" widget). |
| **ESS (Employee Self-Service)** | Observed (name only) | Same "User Role" dropdown as above. This run did not authenticate as an ESS user, so ESS-specific menus/permissions were not directly observed. |
| Supervisor / Report-to relationship | Observed as data attribute, not as a login role | "Supervisor" column in PIM Employee List; "Report-to" tab in My Info/PIM employee record. Whether this constitutes a distinct system role (vs. a relationship field between employee records) is `Unknown / Not observed`. |

---

## 3. Modules

`Module | Navigation Path | Purpose | Primary User Roles | Evidence`

| Module | Navigation Path | Purpose | Primary User Roles | Evidence |
|---|---|---|---|---|
| Admin | Sidebar → Admin | System user administration; Job, Organization, Qualifications, Nationalities, Corporate Branding, and Configuration settings | Admin | Heading: "Admin / User Management" (page: "System Users") — path: `/web/index.php/admin/viewSystemUsers` |
| PIM | Sidebar → PIM | Personnel Information Management — employee records list, add employee, PIM reports | Admin | Heading: "PIM" (page: "Employee Information") — path: `/web/index.php/pim/viewEmployeeList` |
| Leave | Sidebar → Leave | Leave application/approval, entitlements, leave list, assign leave, leave reports | Admin; ESS (inferred from "Apply"/"My Leave" sub-nav labels) | Heading: "Leave" (page: "Leave List") — path: `/web/index.php/leave/viewLeaveList` |
| Time | Sidebar → Time | Employee timesheets, attendance, project info, time reports | Admin; ESS (inferred) | Heading: "Time / Timesheets" — path: `/web/index.php/time/viewEmployeeTimesheet` |
| Recruitment | Sidebar → Recruitment | Candidate and vacancy management | Admin | Heading: "Recruitment" (page: "Candidates") — path: `/web/index.php/recruitment/viewCandidates` |
| My Info | Sidebar → My Info | Logged-in employee's own record (Personal, Contact, Emergency Contacts, Dependents, Immigration, Job, Salary, Report-to, Qualifications, Memberships tabs) | Admin; ESS (inferred — self-service by definition) | Page shows employee name; tab "Personal Details" — path: `/web/index.php/pim/viewPersonalDetails/empNumber/7` |
| Performance | Sidebar → Performance | Performance review configuration, manage reviews, trackers | Admin | Heading: "Performance / Manage Reviews" (page: "Employee Reviews") — path: `/web/index.php/performance/searchEvaluatePerformanceReview` |
| Dashboard | Sidebar → Dashboard | Landing page with summary widgets | Admin; ESS (inferred) | Heading: "Dashboard" — path: `/web/index.php/dashboard/index` |
| Directory | Sidebar → Directory | Employee directory lookup | Admin; ESS (inferred) | Heading: "Directory" (page: "Directory") — path: `/web/index.php/directory/viewDirectory` |
| Maintenance | Sidebar → Maintenance | Critical administrator functions (e.g., Purge Employee Records) | Admin | Heading: "Administrator Access" re-authentication prompt observed — path: `/web/index.php/maintenance/purgeEmployee`. **Status: partially observed** — the re-auth confirmation was intentionally cancelled (not confirmed) to avoid a data-changing/destructive action; module contents beyond the gate are `Unknown / Not observed`. |
| Claim | Sidebar → Claim | Expense claim submission, employee claims, assign claim, configuration | Admin; ESS (inferred) | Heading: "Claim" (page: "Employee Claims") — path: `/web/index.php/claim/viewAssignClaim` |
| Buzz | Sidebar → Buzz | Internal social/collaboration newsfeed — **detailed scope module for Milestone 2** | Admin; ESS (inferred) | Heading: "Buzz" (page text: "Buzz Newsfeed") — path: `/web/index.php/buzz/viewBuzz` |

---

## 4. Authentication

- **Login mechanism:** a login form at `/web/index.php/auth/login` (page title: "OrangeHRM") with a **Username** textbox, **Password** textbox, a **Login** button, and a **"Forgot your password?"** link.
- **Demo credentials:** the live login page itself displays a demo Username and Password directly above the form — a standard OrangeHRM sandbox convention. Per task instructions, **credential values are not recorded** anywhere in this PRD, in logs, or in evidence; they are referenced only as "demo credentials shown on login page."
- **Successful authentication** redirects to the Dashboard at `/web/index.php/dashboard/index`. (Observed.)
- **Session/account menu:** clicking the profile name in the top banner opens a menu with **About**, **Support**, **Change Password**, and **Logout** items. (Observed.)
- **Elevated re-authentication:** navigating to a "critical Administrator function" (observed via Maintenance → Purge Employee Records) triggers a secondary **"Administrator Access"** interstitial requiring the username/password to be re-entered and confirmed before proceeding. This step was cancelled during this run rather than confirmed. (Observed.)
- **Roles gated by authentication:** two `User Role` values exist in the system (Admin, ESS — see Section 2), but role-specific login/permission differences were not tested in this run.
- `Unknown / Not observed`: invalid-credential error message text (an attempted empty-field submission was inconclusive because the browser resubmitted previously-entered demo credentials via autofill rather than empty fields); session timeout behavior; the "Forgot your password?" flow; self-registration (no such option was offered on the login page).

---

## 5. Navigation

- **Persistent sidebar ("Sidepanel"):** present on every authenticated page. Contains a global **Search** box, followed by 12 top-level module links in this fixed order: **Admin, PIM, Leave, Time, Recruitment, My Info, Performance, Dashboard, Directory, Maintenance, Claim, Buzz.** (Observed via accessibility snapshot on every module visited.)
- **Top banner:** shows a breadcrumb-style heading for the current module and, where applicable, its sub-section (e.g., "Admin / User Management", "Time / Timesheets", "Performance / Manage Reviews"), plus an "Upgrade" button and the user profile menu.
- **Per-module sub-navigation ("Topbar Menu"):** most modules expose a horizontal row of sub-navigation links/tabs beneath the banner:
  - Admin: User Management, Job, Organization, Qualifications, Nationalities, Corporate Branding, Configuration
  - PIM: Configuration, Employee List, Add Employee, Reports
  - Leave: Apply, My Leave, Entitlements, Reports, Configure, Leave List, Assign Leave
  - Time: Timesheets, Attendance, Reports, Project Info
  - Recruitment: Candidates, Vacancies
  - Performance: Configure, Manage Reviews, My Trackers, Employee Trackers
  - Claim: Configuration, Submit Claim, My Claims, Employee Claims, Assign Claim
- **My Info** uses a tab strip (`tablist`) instead of the Topbar Menu list pattern used elsewhere: Personal Details, Contact Details, Emergency Contacts, Dependents, Immigration, Job, Salary, Report-to, Qualifications, Memberships.
- **Directory** and **Buzz** show only a collapse/hamburger control in the Topbar Menu region — no additional sub-navigation links were observed for either module (each is effectively a single top-level page from a navigation standpoint).
- **Diagram candidate:** this section (sidebar + per-module sub-navigation hierarchy) is flagged as a good candidate for a navigation-tree diagram in a later milestone (see closing note below); no diagram was created in Milestone 1.

---

## 6. Module: Buzz

This is a dedicated but intentionally **non-deep-dive** treatment of Buzz, the detailed-scope module reserved for Milestone 2 (UI Exploration). No field-by-field interaction map, validation matrix, or test scenarios are produced here.

- **Entry point:** Sidebar → Buzz → `/web/index.php/buzz/viewBuzz` (heading "Buzz"; on-page text "Buzz Newsfeed").
- **Navigation depth:** no sub-navigation tabs/links exist under Buzz — the Topbar Menu region shows only a single collapse toggle. Buzz is a single page at the top-navigation level.
- **Observed page regions:**
  1. **Post composer** — a "What's on your mind?" text input, a **Post** button, and **Share Photos** / **Share Video** buttons.
  2. **Feed filters** — three buttons: **Most Recent Posts**, **Most Liked Posts**, **Most Commented Posts** (their filtering effect was not exercised in this read-only run).
  3. **Post feed** — a list of posts, each showing: author name and avatar, a timestamp (e.g., "2020-08-10 05:38 AM"), text content and/or an attached image, and engagement controls/counters for **Like** (e.g., "0 Likes", "1 Like", "2 Likes" observed across different posts), **Comment** (e.g., "0 Comments"), and **Share** (e.g., "0 Shares"). At least one post showed a **"Read More"** truncation control (not activated).
  4. **"Upcoming Anniversaries" side panel** — shows an employee's photo, name, job title, a year count (e.g., "36" / "Years"), and a date (e.g., "Oct 11").
- **Cross-module surfacing:** the Dashboard independently displays a **"Buzz Latest Posts"** widget, indicating Buzz content is also surfaced outside the Buzz module itself (see Section 12, Dependencies).
- Full deep-dive of Buzz (posting flow details, comment/like interactions, validation limits, error states, permission model) is explicitly **out of scope** for this document — see Section 13.

---

## 7. Functional Requirements

| ID | Requirement | Source Module |
|---|---|---|
| FR-001 | The system shall present a login form (Username, Password, Login button) at `/web/index.php/auth/login`. | Authentication |
| FR-002 | Upon successful authentication, the system shall redirect the user to the Dashboard (`/web/index.php/dashboard/index`). | Authentication |
| FR-003 | The system shall provide a persistent left-hand sidebar with links to all 12 top-level modules on every authenticated page. | Navigation |
| FR-004 | The Admin module shall provide a searchable System Users list, filterable by Username, User Role (Admin/ESS), Employee Name, and Status. | Admin |
| FR-005 | The PIM module shall provide a searchable Employee List filterable by Employee Name, Employee Id, Employment Status, Include (e.g., "Current Employees Only"), Supervisor Name, Job Title, and Sub Unit, with paginated results displaying Id, Name, Job Title, Employment Status, Sub Unit, and Supervisor. | PIM |
| FR-006 | The PIM module shall provide an "Add Employee" form capturing a photo, Employee Full Name (First/Middle/Last, required), and an Employee Id, with an optional "Create Login Details" toggle. | PIM |
| FR-007 | The Leave module shall provide a Leave List view filterable by date range, with sub-navigation for Apply, My Leave, Entitlements, Reports, Configure, and Assign Leave. | Leave |
| FR-008 | The Time module shall provide an Employee Timesheet view allowing employee selection and displaying "Timesheets Pending Action," with sub-navigation for Timesheets, Attendance, Reports, and Project Info. | Time |
| FR-009 | The Recruitment module shall provide separate Candidates and Vacancies list views. | Recruitment |
| FR-010 | The My Info module shall display the logged-in employee's own record across tabs: Personal Details, Contact Details, Emergency Contacts, Dependents, Immigration, Job, Salary, Report-to, Qualifications, Memberships. | My Info |
| FR-011 | The Performance module shall provide an Employee Reviews (Manage Reviews) view, with sub-navigation for Configure, My Trackers, and Employee Trackers. | Performance |
| FR-012 | The Dashboard shall display the widgets: Time at Work, My Actions, Quick Launch, Buzz Latest Posts, Employees on Leave Today, Employee Distribution by Sub Unit, and Employee Distribution by Location. | Dashboard |
| FR-013 | The Directory module shall provide an employee directory lookup page. | Directory |
| FR-014 | The Maintenance module shall require re-entry of the current user's credentials via an "Administrator Access" confirmation before granting access to critical administrator functions (e.g., Purge Employee Records). | Maintenance |
| FR-015 | The Claim module shall provide Submit Claim, My Claims, Employee Claims, Assign Claim, and Configuration views. | Claim |
| FR-016 | The Buzz module shall allow a user to compose a text post via a "What's on your mind?" input and Post button, and to attach photos or video via dedicated buttons. | Buzz |
| FR-017 | The Buzz module shall display a feed of posts, each showing author, timestamp, content, and Like/Comment/Share counters. | Buzz |
| FR-018 | The Buzz module shall provide feed sorting/filtering controls: Most Recent Posts, Most Liked Posts, Most Commented Posts. | Buzz |
| FR-019 | The Buzz module shall display an "Upcoming Anniversaries" panel showing employee name, job title, photo, and anniversary year/date. | Buzz |
| FR-020 | The system's profile menu shall offer About, Support, Change Password, and Logout actions from any authenticated page. | Navigation / Authentication |

---

## 8. Business Rules

| ID | Rule | Evidence |
|---|---|---|
| BR-001 | The Admin "User Role" filter is restricted to exactly two values: `Admin` and `ESS`. | Dropdown options observed on `/web/index.php/admin/viewSystemUsers` |
| BR-002 | The PIM Employee List defaults its "Include" filter to "Current Employees Only." | Observed default value on `/web/index.php/pim/viewEmployeeList` |
| BR-003 | The Leave List defaults its "From Date" filter to 2026-01-01 (observed on an observation date of 2026-09-19). | Observed default value on `/web/index.php/leave/viewLeaveList`. Whether the underlying rule is "start of current calendar year" or something else is based on a single data point — treat the general rule as an assumption (Section 14), not a confirmed business rule. |
| BR-004 | Access to critical Administrator functions (e.g., Purge Employee Records under Maintenance) requires a separate "Administrator Access" credential re-validation step beyond the initial login. | Observed on `/web/index.php/maintenance/purgeEmployee` |
| BR-005 | Buzz post visibility, moderation, and edit/delete permission rules. | `Unknown / Not observed` — would require a data-changing action (submitting a post) to verify |

---

## 9. Data Requirements

| Entity | Fields Observed | Source |
|---|---|---|
| Employee (list view) | Id, First (& Middle) Name, Last Name, Job Title, Employment Status, Sub Unit, Supervisor | PIM Employee List, `/web/index.php/pim/viewEmployeeList` |
| Employee (add form) | Photo (upload; .jpg/.png/.gif, ≤1MB, recommended 200×200px), Employee Full Name (First/Middle/Last — required), Employee Id (pre-filled/auto-generated), "Create Login Details" toggle | PIM "Add Employee" form, `/web/index.php/pim/addEmployee` (viewed, not submitted) |
| System User (search filters) | Username, User Role, Employee Name, Status | Admin → System Users, `/web/index.php/admin/viewSystemUsers` |
| Buzz Post | Author name, author photo, timestamp, text content and/or image, Like count, Comment count, Share count | Buzz Newsfeed, `/web/index.php/buzz/viewBuzz` |
| Buzz "Upcoming Anniversary" entry | Employee name, job title, photo, years count, date | Buzz Newsfeed side panel |

All other module data schemas — including the fields revealed by the "Create Login Details" toggle, and full field sets for Leave, Time, Recruitment, Performance, Claim, Directory, and Maintenance records, and the Buzz post-creation payload/comment data model — are `Unknown / Not observed`: they were not safely explorable without opening additional data-changing forms or completing the Maintenance re-authentication gate.

### Addendum (QC review): sub-navigation labels not yet FR-mapped

A QC pass found that Section 7's Functional Requirements gave substantive treatment to only one landing page per module for several modules, while other sub-navigation items enumerated in Section 5 were left as bare labels with no corresponding FR. No new navigation was performed to produce the lines below — each restates only the label already recorded in Section 5.

- Admin sub-items Job, Organization, Qualifications, Nationalities, Corporate Branding, Configuration: labels observed in navigation only (Section 5), not deep-inspected in Milestone 1.
- PIM sub-items Configuration, Reports: labels observed in navigation only (Section 5), not deep-inspected in Milestone 1.
- Leave sub-items Apply, My Leave, Entitlements, Reports, Configure, Assign Leave: labels observed in navigation only (Section 5), not deep-inspected in Milestone 1.
- Time sub-items Attendance, Reports, Project Info: labels observed in navigation only (Section 5), not deep-inspected in Milestone 1.
- Performance sub-items Configure, My Trackers, Employee Trackers: labels observed in navigation only (Section 5), not deep-inspected in Milestone 1.

---

## 10. Validation Rules

- The "Add Employee" form marks "Employee Full Name" as required, indicated by an asterisk and the form footer note "* Required." (Observed on `/web/index.php/pim/addEmployee`, form viewed but not submitted.)
- All other validation rules (field formats, max lengths, inline/toast error messages) are `Unknown / Not observed`. Triggering them would require submitting forms, which was outside the read-only scope of this run. An attempted empty-field login submission was inconclusive: the browser resubmitted previously-entered demo credentials via autofill instead of empty values, so no login validation message was captured.

---

## 11. Error Handling

- The Dashboard's "My Actions" widget shows an explicit empty state: **"No Pending Actions to Perform"** (with an accompanying icon). (Observed on `/web/index.php/dashboard/index`.)
- The Maintenance module shows an explicit re-authentication interstitial ("Administrator Access — You have requested to access a critical Administrator function in OrangeHRM and are required to validate your credentials below") rather than a generic error when a critical function is requested. (Observed on `/web/index.php/maintenance/purgeEmployee`.)
- All other error, loading, and empty states (e.g., invalid-login error text, empty search-result states, network/server error pages, Buzz-specific errors) are `Unknown / Not observed` — reproducing them would require data-changing or credential-invalidating actions outside this run's read-only scope.

---

## 12. Dependencies

| Dependency | Evidence |
|---|---|
| Dashboard → Buzz | The Dashboard's "Buzz Latest Posts" widget surfaces content originating in the Buzz module. |
| Dashboard → Leave | The Dashboard's "Employees on Leave Today" widget implies a dependency on Leave module data (widget label only; underlying data linkage not further verified). |
| Dashboard → PIM | The Dashboard's "Employee Distribution by Sub Unit" and "by Location" widgets imply a dependency on PIM organizational/employee data (widget labels only). |
| My Info ↔ PIM | My Info (`/web/index.php/pim/viewMyDetails`) renders the same tab structure (Personal Details, Job, etc.) used for PIM employee records, indicating My Info is a self-service view over the same underlying PIM data model. |
| Buzz "Upcoming Anniversaries" → (unknown source) | Implies dependency on employee tenure/join-date data likely managed in PIM, but the exact source module/field was not confirmed. `Unknown / Not observed`. |
| All other inter-module dependencies (e.g., Recruitment → PIM on hire, Performance → PIM, Claim → PIM/Time) | `Unknown / Not observed` — not verifiable through read-only navigation alone. |

---

## 13. Out of Scope

- A full deep-dive of the Buzz module (complete field/interaction map, validation matrix, error states, edge cases) — reserved for Milestone 2 (UI Exploration).
- Any page or workflow reachable only by submitting forms, creating/editing/deleting records, or completing the Maintenance module's "Administrator Access" re-authentication step (e.g., the Purge Employee Records feature itself) — not exercised in this read-only run.
- Test case generation, test execution, and automation of any kind — excluded by the governing skill's rules for this milestone.
- ESS-role-specific UI/permission behavior — this run authenticated only under the demo Admin-role credentials shown on the login page.
- The "Forgot your password?" flow and any email/notification behavior.

---

## 14. Assumptions

- **ESS is assumed to be a distinct, more limited login role** than Admin, based on the "ESS" label and the presence of self-service-oriented sub-navigation items (Apply, My Leave, My Claims, My Trackers). This is inferred from naming/labels only; ESS was not directly logged into or observed.
- **The Leave List "From Date" default is assumed to follow a "start of current calendar year" pattern**, based on a single observation (default value 2026-01-01 on an observation date of 2026-09-19). The exact default-computation logic is not confirmed.
- **"Supervisor" and "Report-to" are assumed to represent an organizational-hierarchy relationship between employee records**, not a separate access-control role, since they appear as data columns/tabs rather than as `User Role` options.
- **The "Create Login Details" toggle on Add Employee is assumed to reveal username/password provisioning fields for that employee** when enabled, based on its label; the actual revealed fields were not confirmed because the toggle could not be activated within this session.

---

## 15. Traceability & Sources

| Item | Source |
|---|---|
| Module rows: Admin, PIM, Leave, Time, Recruitment, My Info, Performance, Dashboard, Directory, Claim, Buzz | Each traced individually to the URL/heading cited in its Section 3 row, navigated on 2026-09-19. |
| Module row: Maintenance | URL `/web/index.php/maintenance/purgeEmployee` and the "Administrator Access" prompt, navigated on 2026-09-19; sub-navigation beyond the gate not traceable (gate not confirmed). |
| FR-001, FR-002, FR-020 | `/web/index.php/auth/login` and profile menu, observed 2026-09-19; and task requirement: "use them to authenticate." |
| FR-003 | Sidebar navigation, observed identically across every module page visited on 2026-09-19. |
| FR-004 | `/web/index.php/admin/viewSystemUsers`, observed 2026-09-19. |
| FR-005, FR-006 | `/web/index.php/pim/viewEmployeeList` and `/web/index.php/pim/addEmployee`, observed 2026-09-19. |
| FR-007 | `/web/index.php/leave/viewLeaveList`, observed 2026-09-19. |
| FR-008 | `/web/index.php/time/viewEmployeeTimesheet`, observed 2026-09-19. |
| FR-009 | `/web/index.php/recruitment/viewCandidates`, observed 2026-09-19. |
| FR-010 | `/web/index.php/pim/viewPersonalDetails/empNumber/7`, observed 2026-09-19. |
| FR-011 | `/web/index.php/performance/searchEvaluatePerformanceReview`, observed 2026-09-19. |
| FR-012 | `/web/index.php/dashboard/index`, observed 2026-09-19. |
| FR-013 | `/web/index.php/directory/viewDirectory`, observed 2026-09-19. |
| FR-014 | `/web/index.php/maintenance/purgeEmployee`, observed 2026-09-19. |
| FR-015 | `/web/index.php/claim/viewAssignClaim`, observed 2026-09-19. |
| Section 9 addendum: Admin sub-items (Job, Organization, Qualifications, Nationalities, Corporate Branding, Configuration) | Section 5's navigation observation of the Admin Topbar Menu, `/web/index.php/admin/viewSystemUsers`, observed 2026-09-19. |
| Section 9 addendum: PIM sub-items (Configuration, Reports) | Section 5's navigation observation of the PIM Topbar Menu, `/web/index.php/pim/viewEmployeeList`, observed 2026-09-19. |
| Section 9 addendum: Leave sub-items (Apply, My Leave, Entitlements, Reports, Configure, Assign Leave) | Section 5's navigation observation of the Leave Topbar Menu, `/web/index.php/leave/viewLeaveList`, observed 2026-09-19. |
| Section 9 addendum: Time sub-items (Attendance, Reports, Project Info) | Section 5's navigation observation of the Time Topbar Menu, `/web/index.php/time/viewEmployeeTimesheet`, observed 2026-09-19. |
| Section 9 addendum: Performance sub-items (Configure, My Trackers, Employee Trackers) | Section 5's navigation observation of the Performance Topbar Menu, `/web/index.php/performance/searchEvaluatePerformanceReview`, observed 2026-09-19. |
| FR-016, FR-017, FR-018, FR-019 | `/web/index.php/buzz/viewBuzz`, observed 2026-09-19. |
| Task requirements: application URL, detailed-scope module = Buzz, 15-section structure, `Unknown / Not observed` policy, read-only constraints, demo-credential handling | Provided directly in the M1 task prompt for this run. |

---

### Diagram candidates flagged for a later milestone (none created in M1)

- **Section 5 (Navigation)** — sidebar + per-module Topbar Menu/tab hierarchy would benefit from a navigation-tree diagram.
- **Section 12 (Dependencies)** — Dashboard-widget-to-module data dependencies would benefit from a simple dependency diagram once confirmed with real data flow (currently based on widget labels only).
- **Section 3 (Modules)** — an overall sitemap diagram combining all 12 top-level modules and their one-level-deep sub-navigation could aid Milestone 2 planning.
