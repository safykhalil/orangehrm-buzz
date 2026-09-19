---
name: ui-exploration
description: "Requirement-driven, evidence-only exploration of one or more UI modules in a web application, using a prior PRD as the map of what to verify. Produces a structured exploration findings markdown file distinguishing confirmed behavior from Unknown / Not exercised, plus a locator table for later automation. WHEN: explore the UI, deep-dive this module, verify the PRD against the live app, map interactions for <module>, Milestone 2, UI exploration, before writing test cases."
metadata:
  version: "1.0"
---

# UI Exploration Skill

Requirement-driven, in-depth exploration of one or more designated UI
modules in a given web application, using a prior PRD as the map of what to
verify — documented in a structured markdown file. This is deeper than PRD
generation: it exercises real interactions, not just navigation, but stays
within a defined safety boundary for actions that would leave permanent
traces on a shared/public environment. This is phase 2 of the pipeline
(PRD → **UI Exploration** → Test Design → Test Execution → Automation) and
must not skip ahead into any of those.

## Inputs (ask if not given)

- Application URL.
- The PRD markdown file produced in Milestone 1.
- The designated coverage scope module(s) for this run.
- Where to write the output (default: `docs/exploration-findings.md`, or
  whatever path convention this project already uses).

## Responsibilities

- Re-read the provided PRD's relevant section(s) before exploring, so
  exploration is driven by what the PRD claims/left unknown, not undirected
  clicking.
- Systematically walk every screen/state of the designated scope module(s):
  every entry point, every visible action, every input field, every
  empty/loading/error state reachable within the interaction policy below.
- Record concrete evidence for every finding: URL/path, element role or
  selector, and what was actually observed — never inferred.
- Explicitly reconcile findings against the PRD: confirm what the PRD got
  right, flag what it missed, flag what it got wrong.
- Never invent behavior not actually triggered and observed this run. Where
  something is outside the interaction policy and therefore not verifiable,
  write exactly `Unknown / Not exercised` and say why.

## Scope Handling (per-run parameter, not hardcoded here)

Each invocation designates one or more modules as this run's coverage scope
— supplied by the prompt, never fixed in this skill. Only the designated
scope module(s) get the full interaction-level treatment described here;
other modules are out of scope for this run entirely (not even at PRD's
high level) unless separately named.

## Interaction Policy (default — a run may narrow this further, never widen it)

This skill assumes the target may be a shared/public environment (e.g. a
public demo instance used by many unrelated people), where some actions
leave permanent, visible-to-others traces with no way to undo them. The
default policy, unless the prompt explicitly says otherwise for a specific
action:

**Allowed — exercise these freely:**
- Navigation, opening/closing menus, expanding/collapsing sections.
- Clicking filter/sort controls that only change the current view (e.g.
  "Most Liked Posts") without altering underlying data.
- Reading validation/required-field indicators without submitting.
- Any action that is fully and immediately reversible by the same run — for
  example, toggling a Like and then immediately toggling it back to its
  original state before moving on. If a reversal cannot be confirmed
  successful, treat the action as NOT safe and do not perform it.
- Hovering, expanding truncation controls ("Read More"), opening modals
  that don't submit anything.

**Not allowed by default — do NOT perform, mark `Unknown / Not exercised`
instead, and state what specific action would be needed to resolve it:**
- Creating new content visible to other users of a shared environment (e.g.
  posting, commenting) — even though this may be exactly the kind of
  interaction the PRD flagged as needing verification. The gap between
  "PRD says this needs testing" and "policy says don't test it this way" is
  expected and should be surfaced, not silently resolved either direction.
- Uploading files/media.
- Any action gated by the target application's own destructive-action
  confirmation (e.g. a "critical function" re-authentication prompt).
- Any action whose reversal is uncertain or unverified.
- Deleting, editing, or purging any record.

If a run's prompt explicitly authorizes a normally-disallowed action for a
specific, narrow purpose, follow that authorization exactly as scoped —
never broaden it to nearby actions the prompt didn't name.

## Method

1. Read the PRD's module inventory row and (if present) dedicated section
   for each scope module before touching the browser.
2. For each scope module, using the available browser/automation tools:
   - Enumerate every entry point into the module.
   - Exercise every allowed action (see policy above); for each, record the
     before-state, the action, and the after-state.
   - For not-allowed actions, do not attempt them; record what they are and
     why they're excluded.
   - For every input field: read (do not necessarily submit) required/
     format/length indicators; only submit if doing so is itself an allowed
     action per the policy.
   - Capture empty, loading, and error states that are reachable via
     allowed actions only.
3. Build a locator/selector reference table for elements interacted with or
   inspected — this feeds directly into later automation and should record
   role-based locators where available (e.g. getByRole/getByLabel-style
   descriptions) rather than brittle CSS paths, since it will be reused by
   the automation milestone.
4. Reconcile against the PRD explicitly: list (a) PRD claims confirmed by
   this exploration, (b) discrepancies — either an observed behavior the
   PRD didn't capture, or a PRD claim not matched by what was observed, and
   (c) PRD items now further clarified with more depth than the PRD had.
5. Record this run in the project's session/prompt log (per the
   prompt-logging mechanism already established for this project — check
   for it before creating a new one).

## Required Output Structure

Save as a single markdown file with these sections:

1. **Executive Summary** — a few sentences: module(s) covered, headline
   findings, count of confirmed vs. unknown items, any surprises.
2. **Scope & Method** — module(s) covered, PRD version used as input,
   interaction policy applied (state explicitly which actions were allowed/
   excluded for this run), observation date.
3. **Screen-by-Screen Findings** — one subsection per distinct screen/state
   of the scope module(s), each with: entry path, elements present,
   observed behavior for every allowed action exercised, and evidence
   (URL/role/selector).
4. **Locator/Selector Reference Table** — element name | role or locator |
   screen | notes. This is mandatory, not optional.
5. **Reconciliation vs. PRD** — confirmed / discrepancies / newly-clarified,
   as in Method step 4.
6. **Excluded Actions & Why** — every action that fell under the "not
   allowed by default" policy, what would need to change to resolve it
   (e.g. "would require posting to the public feed"), and marked
   `Unknown / Not exercised`.
7. **Open Questions** — anything needing a different role, different data,
   or a policy decision from the human QC lead to resolve.
8. **Evidence Index** — a single consolidated list of every URL/path,
   element role/selector, and observation cited anywhere above, gathered in
   one place for fast review (in addition to, not instead of, citing
   evidence inline where each finding appears).

## Rules

- Do not generate test cases (that's the next milestone).
- Do not automate anything.
- Do not invent behavior not actually observed this run.
- Follow the Interaction Policy exactly — do not perform an excluded
  action even if the PRD or a discrepancy seems to call for it; surface the
  gap instead.
- Never write credential values into the output file, logs, or evidence.
- The Locator/Selector Reference Table and Evidence Index are mandatory.

## Quality bar (QC gate)

Before finishing, verify:
- Every entry point and screen/state of the scope module(s) reachable under
  the interaction policy was actually visited, not assumed.
- Every finding has concrete evidence (URL/role/selector), not inference.
- The PRD reconciliation section is complete and honest — including PRD
  claims the exploration could NOT verify given the interaction policy.
- Every excluded action is explicitly listed with a reason, not silently
  omitted.
- The locator/selector table and evidence index are both populated.
- This run was recorded in the session/prompt log.

## Stop condition

After writing the exploration findings file: report the executive summary,
report every `Unknown / Not exercised` item, report any open questions, and
**stop**. Do not move on to test case design automatically — that is a
separate, deliberate next step the human QC lead invokes (Milestone 3)
after reviewing this output.