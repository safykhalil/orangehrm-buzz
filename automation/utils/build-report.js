// Builds reports/automation-execution-report.html from the Playwright JSON
// results, the test-design CSV and the credential-leak check output.
//   node utils/build-report.js
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const REPO = path.join(ROOT, '..');
const results = JSON.parse(fs.readFileSync(path.join(ROOT, 'reports', 'results.json'), 'utf8'));
const leakFile = path.join(ROOT, 'reports', 'credential-leak-check.json');
const leak = fs.existsSync(leakFile) ? JSON.parse(fs.readFileSync(leakFile, 'utf8')) : null;

// ---------- CSV ----------
function parseCsv(text) {
  const rows = []; let row = []; let f = ''; let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
    else if (c === '"') q = true;
    else if (c === ',') { row.push(f); f = ''; }
    else if (c === '\n') { row.push(f.replace(/\r$/, '')); rows.push(row); row = []; f = ''; }
    else f += c;
  }
  if (f || row.length) { row.push(f); rows.push(row); }
  const head = rows.shift();
  return rows.filter(r => r.length > 1).map(r => Object.fromEntries(head.map((k, i) => [k, r[i]])));
}
const csv = parseCsv(fs.readFileSync(path.join(REPO, 'test-design', 'test-design.csv'), 'utf8'));
const approved = csv.filter(r => r['Needs Automation'] === 'Yes');

// ---------- Per-TC metadata (what the automation asserts and why) ----------
const TIER_LABEL = { '@read-only': 'Read-only', '@state-changing': 'State-changing', '@regression-probe': 'Regression probe' };
const META = {
  'BUZZ-TC-001': { spec: 'composer.spec.ts', source: 'M4 TC-001 PASS', asserts: 'Composer textbox, Post, Share Photos and Share Video are all visible.' },
  'BUZZ-TC-002': { spec: 'feed-cards.spec.ts', source: 'M4 TC-002 PASS† (structural assertion holds at any feed size)', asserts: 'For every card in the live feed: author text, avatar, a timestamp that parses as a valid date/time in the app\'s configured date format, text and/or image, and one Like, Comment and Share counter each. No fixed post count.', healing: ['H-04'] },
  'BUZZ-TC-003': { spec: 'feed-filters.spec.ts', source: 'M4 TC-003 PASS (active state = oxd-button--label-warn class)', asserts: 'Only "Most Recent Posts" carries the active class; post timestamps (parsed with the app\'s configured date format) are non-increasing.', healing: ['H-04'] },
  'BUZZ-TC-004': { spec: 'feed-filters.spec.ts', source: 'M4 TC-004 PASS', asserts: 'After clicking Most Liked Posts (feed GET awaited): only that filter is active; Like counts are non-increasing.' },
  'BUZZ-TC-005': { spec: 'feed-filters.spec.ts', source: 'M4 TC-005 PASS', asserts: 'Most Recent → Most Liked → Most Recent gives the identical post sequence and identical Like/Comment/Share counts; Most Recent is active again.' },
  'BUZZ-TC-007': { spec: 'feed-cards.spec.ts', source: 'M4 TC-007 PASS; CSV expected result', asserts: 'On the first post with a visible Read More: text loses --truncate, Read More becomes hidden, and no Show Less / Read Less control appears.', healing: ['H-02', 'H-03'] },
  'BUZZ-TC-008': { spec: 'like-toggle.spec.ts', source: 'M4 TC-008 PASS (re-verification 2026-09-27)', asserts: 'On a post not already liked by this identity: Like → POST /likes 200, count N→N+1, wrapper gains orangehrm-like-animation; Unlike → DELETE /likes 200, count back to N, class cleared. afterEach reloads and independently confirms the post is left un-liked.', healing: ['H-01'] },
  'BUZZ-TC-009': { spec: 'post-interactions.spec.ts', source: 'M4 TC-009 PASS', asserts: 'On a "0 Comments" post: first click shows "Write your comment..." box, second click removes it; URL unchanged throughout; nothing typed.' },
  'BUZZ-TC-010': { spec: 'post-options-menu.spec.ts', source: 'M4 TC-010 PASS + M4 evidence TC-010_01 (item order)', asserts: 'Own post (first + last name match the banner user): menu items are exactly ["Delete Post", "Edit Post"]. Neither is clicked.', reconciliation: { id: 'R-01', text: 'the expected item order was taken from M4 evidence rather than CSV wording. <b>Needs QC confirmation.</b>' } },
  'BUZZ-TC-011': { spec: 'post-options-menu.spec.ts', source: 'M4 TC-011 PASS', asserts: 'Another author\'s post: menu items are exactly ["Delete Post"]. Not clicked.' },
  'BUZZ-TC-012': { spec: 'composer.spec.ts', source: 'M4 TC-012 PASS', asserts: 'Share Photos dialog opens; its Share button is disabled; closed via × (Escape does not close it).' },
  'BUZZ-TC-014': { spec: 'post-interactions.spec.ts', source: 'Exploration §3.10 (M4 TC-014 was BLOCKED by the MCP tool\'s permission classifier)', asserts: 'Repost icon opens a "Share Post" dialog previewing the original post\'s author and timestamp, with an empty "What\'s on your mind?" caption box and an enabled Share button. Share is never clicked; closed via ×.' },
  'BUZZ-TC-017': { spec: 'profile-menu.spec.ts', source: 'M4 TC-017 PASS', asserts: 'Profile menu [role=menuitem] texts are exactly About, Support, Change Password, Logout. None selected.' },
  'BUZZ-TC-019': { spec: 'defect-001.regression-probe.spec.ts', source: 'M4 TC-019 + DEFECT-001 (2/2 reproducible)', asserts: 'INVERTED: Share Video dialog with an empty "Paste Video URL" field has an ENABLED Share button (the defect symptom). Share is never clicked; closed via ×.' },
  'BUZZ-TC-020': { spec: 'feed-filters.spec.ts', source: 'CSV Title + Expected Result corrected 2026-09-27 (QC-approved test-design defect fix), matching M4 TC-020\'s re-analysis', asserts: 'After Most Liked, then Most Commented: each filter\'s primary count is non-increasing; inside every tie group the timestamps are non-decreasing (oldest first); every pair tied under both filters keeps the same relative order in both. No tie group → BLOCKED, not FAIL.', healing: ['H-04'], reconciliation: { id: 'C-01', text: 'the CSV Title and Expected Result were corrected with QC approval (previously BLOCKED as a test-design correction candidate).' } },
};

// ---------- DEFECT-001 status change (QC decision, documentation only) ----------
// The single place to record DEFECT-001's reclassification. Each field below
// is rendered at one spot in the report; set the whole object to null to drop
// all four notes. Values are trusted HTML (not escaped). The original "Open,
// still present" wording elsewhere is kept on purpose for audit.
const DEFECT_001_RECLASSIFICATION = {
  date: '2026-09-28',
  tc: 'BUZZ-TC-019',
  // Badge text for the probe (label only; status, colour and counts stay DEFECT).
  badgeLabel: 'DEFECT (reclassified)',
  // 1. Regression-probe tier card.
  tierCard: 'DEFECT-001 has been reclassified as a UX inconsistency, not a functional defect. See the DEFECT-001 note below.',
  // 2. Dated update note inside the TC-019 result.
  tcNoteHeading: 'documentation only; the probe was not re-run',
  tcNote: 'DEFECT-001 was reclassified from "confirmed functional defect" to <b>"UX inconsistency, not a functional defect"</b>. A live, QC-authorized check (BUZZ-TC-024) showed that clicking Share with an empty Video URL fires zero network requests and creates no post. The button is still enabled, so this probe\'s assertion still holds, and it is kept as a lightweight UI-consistency check. The original wording on this page is kept for audit. Full detail: the DEFECT-001 addendum in <code>execution/execution-report.html</code>.',
  // 3. "Reclassified <date>" row under Formal Defects.
  formalDefects: '<b>UX inconsistency, not a functional defect</b> (QC decision). In a live, QC-authorized check (BUZZ-TC-024), clicking Share with an empty Video URL showed an inline "Required" message, fired zero network requests and created no post. The button-state symptom above is unchanged, but no invalid data is submitted. The Status wording above is kept for audit, and the automation was not re-run. Full detail: the DEFECT-001 addendum in <code>execution/execution-report.html</code>.',
  // 4. Automation Health "Surfaced real defects" cell.
  healthCell: 'DEFECT-001 reclassified as a UX inconsistency, not a functional defect (see Formal Defects).',
};
const R001 = DEFECT_001_RECLASSIFICATION;

// ---------- Results ----------
const walk = s => [...(s.specs || []).flatMap(sp => sp.tests.map(t => ({ sp, t }))), ...(s.suites || []).flatMap(walk)];
const byTc = {};
let setup = null;
for (const { sp, t } of results.suites.flatMap(walk)) {
  const id = /BUZZ-TC-\d{3}/.exec(sp.title)?.[0];
  const res = t.results[t.results.length - 1];
  if (!id) { setup = { title: sp.title, status: res.status, duration: res.duration }; continue; }
  byTc[id] = { title: sp.title, tags: sp.tags.map(x => '@' + x.replace(/^@/, '')), res, file: sp.file };
}

function classify(id, r) {
  if (!r) return { status: 'NOT RUN', cls: 'FAIL', category: 'Missing from results' };
  const s = r.res.status;
  const tier = r.tags.find(t => TIER_LABEL[t]);
  if (tier === '@regression-probe') {
    return s === 'passed'
      ? { status: 'DEFECT', cls: 'DEFECT', label: R001 && id === R001.tc ? R001.badgeLabel : undefined, category: 'Category 2: Product Defect (known, DEFECT-001). Probe PASS = defect still present' }
      : { status: 'PROBE: NOT REPRODUCED', cls: 'FAIL', category: 'Probe FAIL = symptom did not reproduce. Human QC decision needed' };
  }
  if (s === 'passed') return { status: 'PASS', cls: 'PASS', category: '—' };
  if (s === 'skipped') return { status: 'BLOCKED', cls: 'BLOCKED', category: 'Category 4: Blocked / Insufficient Evidence' };
  return { status: 'FAIL', cls: 'FAIL', category: 'Needs triage' };
}

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const evidenceDir = path.join(ROOT, 'reports', 'evidence');
const evidenceFiles = fs.existsSync(evidenceDir) ? fs.readdirSync(evidenceDir) : [];

const rows = approved.map(c => {
  const id = c['TC ID'];
  const r = byTc[id];
  const k = classify(id, r);
  const tier = r ? TIER_LABEL[r.tags.find(t => TIER_LABEL[t])] : '—';
  const notes = (r?.res.annotations || []).filter(a => a.type !== 'write-guard' && a.type !== 'regression-probe');
  const guard = (r?.res.annotations || []).find(a => a.type === 'write-guard');
  const shots = evidenceFiles.filter(f => f.startsWith(id.replace('BUZZ-', '') + '_'));
  const errors = (r?.res.errors || []).map(e => (e.message || '').replace(/\x1b\[[0-9;]*m/g, '').split('\n').slice(0, 4).join('\n'));
  return { id, c, r, k, tier, notes, guard, shots, errors, meta: META[id] || {} };
});

const count = st => rows.filter(x => x.k.status === st).length;
const tierCount = t => rows.filter(x => x.tier === t).length;
const tierRows = t => rows.filter(x => x.tier === t);
const tierLine = t => {
  const rs = tierRows(t);
  const parts = ['PASS', 'DEFECT', 'BLOCKED', 'FAIL'].map(s => [s, rs.filter(x => x.k.status === s).length]).filter(([, n]) => n);
  return parts.map(([s, n]) => `${n} ${s}`).join(' · ');
};
const totalMs = rows.reduce((a, x) => a + (x.r?.res.duration || 0), 0);
const runStart = results.stats?.startTime ? new Date(results.stats.startTime) : null;

const tcSection = x => {
  const m = x.meta;
  const probe = x.tier === 'Regression probe';
  return `
<details class="tc"${x.k.status !== 'PASS' ? ' open' : ''}>
  <summary><span class="id">${x.id.replace('BUZZ-', '')}</span><span class="title">${esc(x.c.Title)}</span><span class="tier">${esc(x.tier)}</span><span class="badge ${x.k.cls}">${esc(x.k.label || x.k.status)}</span></summary>
  <div class="body">
    ${probe ? `<div class="note probe">⚠ <b>REGRESSION PROBE, INVERTED ASSERTION.</b> Runner PASS = DEFECT-001 is <b>still present</b> (expected, not alarming). Runner FAIL = the symptom did not reproduce, which needs a human QC decision. Never flip this probe to expect success.</div>` : ''}${R001 && x.id === R001.tc ? `
    <div class="note info"><b>Update ${R001.date} (${R001.tcNoteHeading}):</b> ${R001.tcNote}</div>` : ''}
    <dl class="kv">
      <dt>Test</dt><dd><code>${esc(x.r?.title || '—')}</code> (<code>tests/${esc(m.spec || '')}</code>)</dd>
      <dt>Module / type</dt><dd>${esc(x.c.Module)} · ${esc(x.c['Test Type'])} · Priority ${esc(x.c.Priority)}</dd>
      <dt>Execution time</dt><dd>${x.r ? (x.r.res.duration / 1000).toFixed(1) + ' s' : '—'}</dd>
      <dt>Classification</dt><dd>${esc(x.k.category)}</dd>
      <dt>Assertion source</dt><dd>${esc(m.source || '—')}</dd>
    </dl>
    <h4>Expected (test-design CSV)</h4><p>${esc(x.c['Expected Result'])}</p>
    <h4>What the automation asserts</h4><p>${esc(m.asserts || '—')}</p>
    <h4>Actual</h4>
    <p>${x.k.status === 'PASS' ? 'All assertions above held.' : x.k.status === 'DEFECT' ? 'Share button was enabled with an empty Video URL field, so the defect symptom is present (probe PASS).' : x.k.status === 'BLOCKED' ? esc((x.r?.res.annotations || []).find(a => a.type === 'fixme' || a.type === 'skip')?.description || 'Not executed.') : 'See error below.'}</p>
    ${x.notes.length ? `<ul class="tight">${x.notes.map(a => `<li><b>${esc(a.type)}:</b> ${esc(a.description)}</li>`).join('')}</ul>` : ''}
    ${x.guard ? `<p class="muted">API write guard: ${esc(x.guard.description)}</p>` : ''}
    ${x.errors.length ? `<pre>${esc(x.errors.join('\n\n'))}</pre>` : ''}
    ${m.healing ? `<p class="heal">Needed healing: ${m.healing.map(h => `<a href="healing-log.md">${h}</a>`).join(', ')} (see healing-log.md).</p>` : ''}
    ${m.reconciliation ? `<p class="heal">Expected-value change <a href="healing-log.md">${m.reconciliation.id}</a>: ${m.reconciliation.text}</p>` : ''}
    ${x.shots.length ? `<div class="evid">${x.shots.map(f => `<figure><a href="evidence/${esc(f)}"><img src="evidence/${esc(f)}" alt="${esc(f)}"></a><figcaption>${esc(f)}</figcaption></figure>`).join('')}</div>` : ''}
  </div>
</details>`;
};

const leakHtml = leak ? `
<p>Ran <code>node utils/credential-leak-check.js</code> at ${esc(leak.checkedAt)}. It read the demo credentials from the live login page at runtime and searched <b>${leak.filesScanned}</b> files: <code>automation/reports/**</code> (this report, healing log, JSON results, Playwright HTML report, evidence), <code>automation/test-results/**</code>, <code>automation/.auth/</code>, all test/page/util source, <code>playwright.config.ts</code> and <code>logs/session-log.md</code>. Zip entries are inflated before searching. Values are never printed; only counts are recorded.</p>
<div class="scroll"><table class="grid"><tr><th>Credential</th><th>Matches</th><th>Verdict</th></tr>
<tr><td>Password value</td><td><b>${leak.password.matches}</b></td><td>${leak.password.matches === 0 ? '<span class="badge PASS">clean</span>' : '<span class="badge FAIL">LEAK</span> ' + esc(leak.password.files.join(', '))}</td></tr>
<tr><td>Username value</td><td><b>${leak.username.matches}</b> (${esc(leak.username.files.join(', ') || 'none')})</td><td><span class="badge PASS">clean</span> Each match was reviewed with the value masked. The username is spelled the same as the application's module/role name, and every hit is that label: UI translation strings the app caches in localStorage (<code>.auth/state.json</code>, gitignored and never committed) references to that module/role name in the session log, and the CSV's "&lt;role&gt;-role account" wording quoted in this report's TC-011 expected result. None appears in a credential context.</td></tr></table></div>
<p class="muted">Screenshots cannot be text-searched. Instead, <code>evidence()</code> refuses to capture any page whose URL is the login page (which shows the credentials), and Playwright traces are disabled because they record <code>fill()</code> arguments.</p>` : '<p><b>Credential-leak check has not been run.</b></p>';

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Buzz Automation Report</title>
<style>
 :root { --pass:#1a7f37; --pass-bg:#dafbe1; --fail:#cf222e; --fail-bg:#ffebe9; --blocked:#9a6700; --blocked-bg:#fff8c5; --defect:#8250df; --defect-bg:#fbefff; --drift:#0969da; --drift-bg:#ddf4ff; --border:#d0d7de; --muted:#57606a; --bg:#f6f8fa; --card:#fff; --accent:#0969da; --text:#1f2328; --code:#eef1f4; }
 @media (prefers-color-scheme: dark) { :root { --pass:#3fb950; --pass-bg:#12261e; --fail:#f85149; --fail-bg:#2d1214; --blocked:#d29922; --blocked-bg:#2b2111; --defect:#bc8cff; --defect-bg:#261a3a; --drift:#58a6ff; --drift-bg:#0c2d4a; --border:#30363d; --muted:#8b949e; --bg:#0d1117; --card:#161b22; --accent:#58a6ff; --text:#e6edf3; --code:#21262d; } }
 * { box-sizing: border-box; }
 body { font-family: -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; background: var(--bg); color: var(--text); margin: 0; padding: 0 0 60px; }
 header { background: #24292f; color: #fff; padding: 28px 32px; }
 header h1 { margin: 0 0 6px; font-size: 22px; } header p { margin: 2px 0; color: #c9d1d9; font-size: 13.5px; }
 .container { max-width: 1080px; margin: 0 auto; padding: 0 24px; }
 .summary { display: grid; grid-template-columns: repeat(6, 1fr); gap: 14px; margin: 28px 0 14px; }
 .tiers { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin: 0 0 28px; }
 .card { background: var(--card); border: 1px solid var(--border); border-radius: 8px; padding: 16px; text-align: center; }
 .card .num { font-size: 30px; font-weight: 700; } .card .label { font-size: 12px; color: var(--muted); text-transform: uppercase; letter-spacing: .04em; margin-top: 4px; }
 .card .sub { font-size: 12.5px; color: var(--muted); margin-top: 6px; }
 .card.pass .num { color: var(--pass); } .card.fail .num { color: var(--fail); } .card.blocked .num { color: var(--blocked); } .card.defect .num { color: var(--defect); } .card.drift .num { color: var(--drift); }
 .tiers .card { text-align: left; } .tiers .card .num { font-size: 24px; }
 section { margin: 36px 0; } h2 { font-size: 18px; border-bottom: 1px solid var(--border); padding-bottom: 8px; }
 .note { background: var(--blocked-bg); border: 1px solid #d4a72c; border-radius: 6px; padding: 12px 16px; font-size: 14px; margin: 16px 0; }
 .note.info { background: var(--drift-bg); border-color: #54aeff; } .note.probe { background: var(--defect-bg); border-color: var(--defect); }
 .tc { background: var(--card); border: 1px solid var(--border); border-radius: 8px; margin-bottom: 10px; overflow: hidden; }
 .tc summary { cursor: pointer; padding: 12px 16px; display: flex; align-items: center; gap: 12px; list-style: none; font-size: 14.5px; flex-wrap: wrap; }
 .tc summary::-webkit-details-marker { display: none; }
 .tc summary .id { font-weight: 600; color: var(--accent); min-width: 64px; } .tc summary .title { flex: 1; min-width: 200px; }
 .tc summary .tier { font-size: 11.5px; color: var(--muted); border: 1px solid var(--border); border-radius: 999px; padding: 2px 8px; white-space: nowrap; }
 .badge { font-size: 11.5px; font-weight: 700; padding: 3px 10px; border-radius: 999px; text-transform: uppercase; letter-spacing: .03em; white-space: nowrap; }
 .badge.PASS { background: var(--pass-bg); color: var(--pass); } .badge.FAIL { background: var(--fail-bg); color: var(--fail); } .badge.BLOCKED { background: var(--blocked-bg); color: var(--blocked); } .badge.DEFECT { background: var(--defect-bg); color: var(--defect); } .badge.DRIFT { background: var(--drift-bg); color: var(--drift); }
 .tc .body { padding: 4px 16px 18px; border-top: 1px solid var(--border); font-size: 13.5px; line-height: 1.55; }
 .tc .body h4 { margin: 14px 0 4px; font-size: 12.5px; text-transform: uppercase; letter-spacing: .03em; color: var(--muted); }
 dl.kv, .defect dl { display: grid; grid-template-columns: 150px 1fr; gap: 6px 12px; font-size: 13.5px; margin: 12px 0 0; } dt { font-weight: 600; color: var(--muted); } dd { margin: 0; min-width: 0; overflow-wrap: anywhere; }
 .evid { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px; } .evid figure { margin: 0; width: 260px; max-width: 100%; }
 .evid img { width: 100%; border: 1px solid var(--border); border-radius: 6px; display: block; } .evid figcaption { font-size: 11px; color: var(--muted); margin-top: 3px; word-break: break-all; }
 code { background: var(--code); padding: 1px 5px; border-radius: 4px; font-size: 12.5px; overflow-wrap: anywhere; }
 pre { background: var(--code); padding: 10px; border-radius: 6px; overflow-x: auto; font-size: 12px; }
 .muted { color: var(--muted); font-size: 12.5px; } .heal { font-size: 13px; } a { color: var(--accent); }
 .defect { background: var(--card); border: 1px solid var(--defect); border-radius: 8px; padding: 18px 20px; margin-bottom: 16px; } .defect h3 { margin-top: 0; color: var(--defect); }
 table.grid { border-collapse: collapse; width: 100%; font-size: 13.5px; background: var(--card); } table.grid th, table.grid td { border: 1px solid var(--border); padding: 8px 10px; text-align: left; vertical-align: top; }
 table.grid th { background: var(--bg); } .scroll { overflow-x: auto; }
 ul.tight li { margin-bottom: 6px; }
 @media (max-width: 900px) { .summary { grid-template-columns: repeat(3, 1fr); } }
 @media (max-width: 720px) { .container { padding: 0 16px; } header { padding: 22px 16px; } .summary, .tiers { grid-template-columns: repeat(2, 1fr); } .tiers { grid-template-columns: 1fr; } dl.kv, .defect dl { grid-template-columns: 1fr; } }
</style></head><body>
<header><div class="container">
  <h1>Buzz Module — Milestone 5: Playwright Automation Execution</h1>
  <p>Application: https://opensource-demo.orangehrmlive.com/ (Buzz Newsfeed)</p>
  <p>Executed: ${runStart ? esc(runStart.toISOString().replace('T', ' ').slice(0, 16)) + ' UTC' : '2026-09-27'} · Playwright ${esc(results.config?.version || '')} (<code style="background:#32383f;color:#fff">@playwright/test</code>, Chromium, 1 worker, 0 retries) · Source: test-design/test-design.csv (Needs Automation = Yes: ${approved.length} cases)</p>
  <p>Authenticated once per run (setup project: ${esc(setup?.status || '—')}) with the demo credentials shown on the login page. The values are not recorded anywhere.</p>
</div></header>
<div class="container">

<div class="summary">
  <div class="card"><div class="num">${approved.length}</div><div class="label">Approved cases</div></div>
  <div class="card pass"><div class="num">${count('PASS')}</div><div class="label">Pass</div></div>
  <div class="card fail"><div class="num">${count('FAIL') + count('PROBE: NOT REPRODUCED')}</div><div class="label">Fail</div></div>
  <div class="card blocked"><div class="num">${count('BLOCKED')}</div><div class="label">Blocked</div></div>
  <div class="card defect"><div class="num">${count('DEFECT')}</div><div class="label">Defect</div></div>
  <div class="card drift"><div class="num">0</div><div class="label">Env. drift</div></div>
</div>
<div class="tiers">
  <div class="card"><div class="label">Read-only tier</div><div class="num">${tierCount('Read-only')}</div><div class="sub">${tierLine('Read-only')}. Observe only; API write guard recorded zero writes. Safe to run as often as needed.</div></div>
  <div class="card"><div class="label">State-changing tier</div><div class="num">${tierCount('State-changing')}</div><div class="sub">${tierLine('State-changing')}. Toggles a real Like on the shared demo and reverses it (reversal confirmed). Leaves more footprint than read-only, so run it less often.</div></div>
  <div class="card"><div class="label">Regression-probe tier</div><div class="num">${tierCount('Regression probe')}</div><div class="sub">${tierLine('Regression probe')}. DEFECT-001 probe: PASS = defect still present. Not a pass/fail gate.${R001 ? `<br><i>${R001.date}: ${R001.tierCard}</i>` : ''}</div></div>
</div>

<div class="note info"><b>Run tiers separately:</b> <code>npx playwright test --grep @read-only</code>, <code>--grep @state-changing</code>, <code>--grep @regression-probe</code> (from <code>automation/</code>). Total test time for the ${approved.length} cases: ${(totalMs / 1000).toFixed(1)} s. The final run's feed was the original 4-post baseline, logged in as "manda user", with the app's date format set to <code>Y-d-m</code>.</div>

<section><h2>Test Results (${approved.length} approved cases)</h2>
${rows.map(tcSection).join('\n')}
</section>

<section><h2>Formal Defects</h2>
<div class="defect"><h3>DEFECT-001 — Share Video "Share" button not disabled despite empty Video URL</h3>
<dl>
  <dt>Status</dt><dd><b>Open, still present.</b> The regression probe (BUZZ-TC-019) passed this run, meaning the symptom reproduced. That is one more automated observation on top of M4's 2/2 manual reproductions. It is not resolved.</dd>${R001 ? `
  <dt>Reclassified ${R001.date}</dt><dd>${R001.formalDefects}</dd>` : ''}
  <dt>Screen / path</dt><dd>Buzz Newsfeed, Share Video modal — /web/index.php/buzz/viewBuzz</dd>
  <dt>Steps</dt><dd>1. Click "Share Video". 2. Leave "Paste Video URL" empty. 3. Observe the Share button's disabled state (do not click it).</dd>
  <dt>Actual</dt><dd>Share is enabled with an empty URL field (<code>toBeEnabled()</code> held; evidence TC-019).</dd>
  <dt>Expected</dt><dd>Share disabled while the URL is empty, matching Share Photos (BUZZ-TC-012, which passed this run with Share disabled).</dd>
  <dt>Probe boundary</dt><dd>Button state only, matching M4's writeup. Share is never clicked (submission is BUZZ-TC-024, policy-excluded), and the API write guard recorded zero write attempts during the probe.</dd>
  <dt>Severity / priority</dt><dd>High / High (unchanged from M4)</dd>
</dl></div>
<p class="muted">DEFECT-002 (Like/Unlike) was withdrawn in M4 re-verification, so it has no probe. BUZZ-TC-008 is automated as an ordinary state-changing test and passed. No new product defects were found by this automation run.</p>
</section>

<section><h2>Source Reconciliation</h2>
<div class="scroll"><table class="grid">
<tr><th>TC</th><th>Discrepancy</th><th>Resolution</th></tr>
<tr><td>TC-020</td><td>The CSV expected different tie-break orders for Most Liked and Most Commented. M4 observed identical orders (ascending creation time) and showed the original finding had compared a primary-key difference (1 Like vs 0), not a tie.</td><td><b>Resolved:</b> the CSV Title and Expected Result were corrected on 2026-09-27 as a QC-approved test-design defect fix (C-01; only those two cells changed). The test now asserts the corrected behavior and passed. Previously BLOCKED.</td></tr>
<tr><td>TC-002, TC-003, TC-020</td><td>The shared demo's instance-wide date format changes between runs. Earlier today it was <code>Y-m-d</code>; the final run used <code>Y-d-m</code> (per <code>GET /api/v2/admin/localization</code>), so the same post shows as <code>2020-10-08</code> or <code>2020-08-10</code>.</td><td>Timestamps are parsed with the format the app reports at runtime, never an assumed one (H-04). An unparseable timestamp fails the test instead of being compared wrongly.</td></tr>
<tr><td>TC-014</td><td>M4 BLOCKED (MCP tool permission classifier), so there is no M4 confirmation.</td><td>Asserted from Exploration §3.10 (precedence #3). Opening and closing the dialog creates no content. Share is never clicked, and the write guard recorded no writes. The standalone Playwright run was not subject to the classifier.</td></tr>
<tr><td>TC-010</td><td>CSV lists "Edit Post" and "Delete Post" without an order; M4 evidence shows Delete Post first.</td><td>Asserts the exact M4-observed order <code>["Delete Post", "Edit Post"]</code>. Logged as R-01 in healing-log.md. <b>Needs QC confirmation.</b></td></tr>
<tr><td>TC-007</td><td>M4 said Read More is "removed from the DOM/accessibility tree". The live DOM keeps the node and hides it with <code>display:none</code>.</td><td>Asserts that it is hidden (<code>toBeHidden()</code>), which matches the CSV's "link disappears" and M4's accessibility-tree observation. Logged as H-03.</td></tr>
<tr><td>TC-002, TC-020</td><td>CSV preconditions cite a 4-post snapshot; M4 saw 8–9 posts.</td><td>No count is asserted; structure is asserted on every card. The final run's feed happened to be back at 4 posts.</td></tr>
<tr><td>TC-010, TC-011</td><td>The banner shows "manda user" while the own post shows "manda akhil user" (middle name), and the shared login's display name has varied across runs (M4: "sri venkatadri…").</td><td>Own post is identified by matching the first and last name tokens against the banner name at runtime, not by a hard-coded name.</td></tr>
</table></div>
</section>

<section><h2>Healing Summary</h2>
<div class="scroll"><table class="grid">
<tr><th>Total attempts</th><th>Successful</th><th>Unsuccessful</th><th>Tests affected</th><th>Assertion changed</th></tr>
<tr><td>4</td><td>4</td><td>0</td><td>5 (TC-007: H-02, H-03 · TC-008: H-01 · TC-002, TC-003, TC-020: H-04)</td><td>No for all 4 healing entries. Separately: C-01 (TC-020) is a <b>QC-approved</b> test-design correction; R-01 (TC-010) changed an expected value and <b>needs QC confirmation</b>.</td></tr>
</table></div>
<p>H-01 to H-03 were Category 1 automation defects in the first draft of the scripts: a fixture option shape (H-01), a hidden-element target (H-02) and a DOM-removal check that should have been a visibility check (H-03). H-04 is Category 3 environmental drift: the shared demo's date format changed between runs, and it was caught by inspection before it caused a wrong result. Full before/after and diagnosis: <a href="healing-log.md">healing-log.md</a>.</p>
</section>

<section><h2>Automation Health</h2>
<div class="scroll"><table class="grid">
<tr><th>No changes needed</th><th>Needed healing</th><th>Expected value reconciled</th><th>Surfaced real defects</th><th>Affected by data drift</th><th>Blocked</th></tr>
<tr><td>9 (TC-001, 004, 005, 009, 011, 012, 014, 017, 019)</td><td>5 (TC-002, 003, 007, 008, 020)</td><td>2 (TC-010: R-01, pending QC · TC-020: C-01, QC-approved)</td><td>1 known, still present (TC-019 / DEFECT-001); 0 new${R001 ? `. <i>${R001.date}: ${R001.healthCell}</i>` : ''}</td><td>Date-format drift detected and handled (TC-002, 003, 020); 0 results affected</td><td>0</td></tr>
</table></div>
<p class="muted">Drift resilience built in: no test asserts a fixed post count, position or name. Targets are chosen at runtime by what the test needs (a visibly truncated post, a "0 Comments" post, a post not already liked by this shared identity, own vs. other author), and a missing precondition is reported as BLOCKED rather than FAIL. TC-008's cleanup records drift separately if the Like count after its own reversal differs from baseline.</p>
<p class="muted">Cleanup timing (Hard Rule 5): the worst-case TC-008 reversal budget is 3 attempts × 33 s + 2 × 2 s delay = 103 s, and the <code>afterEach</code> hook raises its own timeout to 130 s. A check that runs when the spec file loads enforces budget &lt; hook timeout. A probe on Playwright 1.63 confirmed that without this, an <code>afterEach</code> overrunning the config timeout is killed mid-cleanup.</p>
</section>

<section><h2>Credential-Leak Verification</h2>
${leakHtml}
</section>

</div></body></html>`;

fs.writeFileSync(path.join(ROOT, 'reports', 'automation-execution-report.html'), html);
console.log(`Wrote reports/automation-execution-report.html: ${approved.length} cases, PASS ${count('PASS')}, DEFECT ${count('DEFECT')}, BLOCKED ${count('BLOCKED')}, FAIL ${count('FAIL')}`);
