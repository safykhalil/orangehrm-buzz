// Credential-leak verification (skill Hard Rule 4).
//
// Reads the demo credentials from the live login page (the same way the suite
// does), then searches every automation output and audit file for the actual
// values. Prints and records match COUNTS and file names only, never the values.
// Run after the suite, the report and the healing log exist:
//   node utils/credential-leak-check.js
const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const ROOT = path.join(__dirname, '..');
const REPO = path.join(ROOT, '..');
const TARGETS = [
  path.join(ROOT, 'reports'),
  path.join(ROOT, 'test-results'),
  path.join(ROOT, '.auth'),
  path.join(ROOT, 'tests'),
  path.join(ROOT, 'pages'),
  path.join(ROOT, 'utils'),
  path.join(ROOT, 'playwright.config.ts'),
  path.join(REPO, 'logs', 'session-log.md'),
];
const OUT = path.join(ROOT, 'reports', 'credential-leak-check.json');

function files(p) {
  if (!fs.existsSync(p)) return [];
  const st = fs.statSync(p);
  if (st.isFile()) return [p];
  return fs.readdirSync(p).flatMap(f => files(path.join(p, f)));
}

/** File contents to search: raw bytes, plus inflated text for zip entries (e.g. traces). */
function searchable(file) {
  const buf = fs.readFileSync(file);
  const parts = [buf.toString('utf8')];
  if (buf.slice(0, 2).toString() === 'PK') {
    // Walk local file headers and inflate deflated entries.
    let i = 0;
    while ((i = buf.indexOf('PK\u0003\u0004', i, 'latin1')) !== -1) {
      const method = buf.readUInt16LE(i + 8);
      const size = buf.readUInt32LE(i + 18);
      const start = i + 30 + buf.readUInt16LE(i + 26) + buf.readUInt16LE(i + 28);
      const data = buf.slice(start, start + size);
      try { parts.push((method === 8 ? zlib.inflateRawSync(data) : data).toString('utf8')); } catch { /* skip */ }
      i = start;
    }
  }
  return parts.join('\n');
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  const hint = await page.locator('.orangehrm-demo-credentials').innerText();
  await browser.close();
  const values = {
    username: /Username\s*:\s*(\S+)/.exec(hint)?.[1],
    password: /Password\s*:\s*(\S+)/.exec(hint)?.[1],
  };
  if (!values.username || !values.password) throw new Error('Could not read demo credentials from the login page');

  const scanned = [...new Set(TARGETS.flatMap(files))].filter(f => f !== OUT);
  const result = { checkedAt: new Date().toISOString(), filesScanned: scanned.length, password: { matches: 0, files: [] }, username: { matches: 0, files: [] } };
  for (const file of scanned) {
    const text = searchable(file);
    const rel = path.relative(REPO, file).replace(/\\/g, '/');
    // Password: exact substring. Username: whole word, case-sensitive.
    const pw = text.split(values.password).length - 1;
    const un = (text.match(new RegExp(`\\b${values.username.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g')) || []).length;
    if (pw) { result.password.matches += pw; result.password.files.push(`${rel} (${pw})`); }
    if (un) { result.username.matches += un; result.username.files.push(`${rel} (${un})`); }
  }
  fs.writeFileSync(OUT, JSON.stringify(result, null, 2));
  console.log(`Scanned ${result.filesScanned} files (zip entries inflated).`);
  console.log(`Password value: ${result.password.matches} match(es)${result.password.files.length ? ' in ' + result.password.files.join(', ') : ''}`);
  console.log(`Username value: ${result.username.matches} match(es)${result.username.files.length ? ' in ' + result.username.files.join(', ') : ''}`);
  process.exitCode = result.password.matches ? 1 : 0;
})();
