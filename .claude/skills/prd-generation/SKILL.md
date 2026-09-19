# PRD Generation Skill

## Purpose

Generate a structured, controlled-format Product Requirements Document for a
given web application, based on direct read-only observation of the live
application plus any task requirements provided for that run.

## Responsibilities

- Access and navigate the live application (read-only).
- Understand the overall system before drilling into detail.
- Identify modules, major workflows, actors/users, business functionality,
  navigation structure, and important rules — from direct observation or
  explicitly provided requirements only, never from general/trained
  knowledge of what this type of application "usually" contains.
- Generate the PRD in the fixed structure below — do not produce a
  free-form or generic PRD instead of this structure.
- Keep every claim traceable to a real source (a page observed, or a
  requirement supplied in the prompt).
- Never invent requirements, fields, validation messages, error states, or
  business rules that were not actually observed or provided. Where the
  application doesn't demonstrate something and it wasn't safely
  observable, write exactly: `Unknown / Not observed` — do not guess based
  on typical patterns for this type of application.

## Scope Handling (per-run parameter, not hardcoded here)

Each invocation may designate one module as the "detailed testing scope" for
a later exploration milestone. Section 6 of the PRD is reserved for that
module, referenced generically here as `{{detailed-scope-module}}` — the
actual module name is supplied by the prompt for each run, never fixed in
this skill. Document it at the same high level as other modules in sections
1–3; section 6 gives it a dedicated (but still non-deep-dive) treatment.
The full deep-dive is reserved for the UI Exploration milestone.

If no detailed-scope module is specified for a given run, omit section 6 or
mark it "Not applicable for this run" — never default to a specific module.

## Required PRD Structure

Save output using exactly these numbered sections:

1. **Application Overview** — system purpose, application under analysis,
   scope, observation date, PRD version.
2. **System Actors** — roles actually observed or explicitly provided;
   distinguish observed from inferred/unverified.
3. **Modules** — full module inventory table:
   `Module | Navigation Path | Purpose | Primary User Roles | Evidence`.
   "Evidence" = actual page title/URL observed. Never filled from inference.
4. **Authentication** — login mechanism observed, roles it gates, any
   credential handling notes (never credential values themselves).
5. **Navigation** — overall nav structure/hierarchy as observed (this is
   also a candidate for a later diagram).
6. **Module: {{detailed-scope-module}}** — dedicated (non-deep-dive)
   section for the run's designated scope module, if any.
7. **Functional Requirements** — concise, testable, stable IDs (FR-001,
   FR-002, ...); one or more per module.
8. **Business Rules** — only rules supported by direct observation or
   provided requirements; mark anything else `Unknown / Not observed`.
9. **Data Requirements** — entities/fields actually observed per module.
   Anything not safely observable (e.g. behind a data-changing action):
   `Unknown / Not observed`.
10. **Validation Rules** — validation actually observed (required fields,
    formats, max lengths, error messages verbatim). Do not guess typical
    validation for this UI framework — if it can't be triggered read-only,
    mark `Unknown / Not observed`.
11. **Error Handling** — error/empty/loading states actually observed.
    Same rule: `Unknown / Not observed` rather than invented.
12. **Dependencies** — cross-module dependencies actually observed (e.g.
    a module's data feeding another). `Unknown / Not observed` if not
    determinable read-only.
13. **Out of Scope** — explicitly excluded from this PRD/run (e.g. modules
    not accessible with available credentials).
14. **Assumptions** — anything presented as likely-but-unverified; never
    blend with confirmed information.
15. **Traceability & Sources** — for each FR and each module inventory row,
    the source it traces to: either a page/URL/date actually navigated, or
    a specific line from the provided task requirements.

## Method

1. Navigate the live application via the available browser/automation
   tools, read-only: open menus, follow navigation, read titles/labels/
   fields/structure. Never submit forms, create/edit/delete data, execute
   test scenarios, or change configuration.
2. If a page requires a data-changing action to proceed, do not perform
   it — mark the relevant fields `Unknown / Not observed` and continue.
3. Inspect one level of child navigation per top-level module by default;
   note deeper nesting without fully expanding it.
4. Build sections 1–15 in order, applying the `Unknown / Not observed`
   rule anywhere direct evidence is missing — across all sections, not
   only Data/Validation/Error/Dependencies.
5. Record this run in the project's session/prompt log if one exists; if
   not, create a fallback log and say so. Never log credential values.

## Rules

- Do not generate test cases.
- Do not perform test actions/assertions against the application.
- Do not automate anything.
- Do not invent requirements, modules, roles, fields, validations, error
  messages, or business rules.
- Never write credential values into the PRD, logs, or evidence.
- Use the fixed 15-section structure — do not substitute a generic PRD
  format.

## Quality bar (QC gate)

Before finishing, verify:
- All major modules are identified.
- The detailed-scope module (if any) is correctly identified and placed
  in section 6, not deep-dived.
- Requirements (section 7) are functional and testable, each with a
  stable FR ID.
- Business rules (section 8) are separated from assumptions (section 14).
- Validations (section 10) are documented from direct observation only.
- Negative/error behaviors (section 11) are documented, not invented.
- Every unknown is explicitly marked `Unknown / Not observed`, never
  silently assumed.
- Every module and FR is traceable (section 15) to a real source.