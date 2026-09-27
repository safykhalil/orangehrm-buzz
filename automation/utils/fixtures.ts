import { test as base, expect, Page, TestInfo } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { BuzzPage } from '../pages/BuzzPage';

/** Scheduling tiers (skill: "Scheduling Tiers"). Every test carries exactly one. */
export const TIER = {
  readOnly: '@read-only',
  stateChanging: '@state-changing',
  regressionProbe: '@regression-probe',
} as const;

/**
 * API writes a test is allowed to make. Anything else that is not a GET is
 * aborted before it leaves the browser and fails the test. Read-only and
 * probe tests allow nothing, so a stray click on "Share"/"Post" can never
 * publish content on the shared demo (Hard Rule 2).
 */
export type AllowedWrite = { method: string; url: RegExp };

type Fixtures = {
  // Wrapped in an object: test.use() reads a bare array option as a [value, options] tuple.
  writePolicy: { allow: AllowedWrite[] };
  writeGuard: { blocked: string[]; allowed: string[] };
  buzz: BuzzPage;
};

const EVIDENCE_DIR = path.join(__dirname, '..', 'reports', 'evidence');

export const test = base.extend<Fixtures>({
  writePolicy: [{ allow: [] }, { option: true }],

  writeGuard: [
    async ({ page, writePolicy }, use, testInfo) => {
      const log = { blocked: [] as string[], allowed: [] as string[] };
      await page.route('**/web/index.php/api/**', async route => {
        const req = route.request();
        const method = req.method();
        if (method === 'GET') return route.continue();
        const entry = `${method} ${new URL(req.url()).pathname}`;
        let allowed = false;
        try {
          allowed = writePolicy.allow.some(w => w.method === method && w.url.test(req.url()));
        } catch (err) {
          // Fail closed: a broken policy must never let a write through.
          log.blocked.push(`${entry} (policy error: ${(err as Error).message})`);
          return route.abort('blockedbyclient');
        }
        if (allowed) {
          log.allowed.push(entry);
          return route.continue();
        }
        log.blocked.push(entry);
        return route.abort('blockedbyclient');
      });
      await use(log);
      testInfo.annotations.push({
        type: 'write-guard',
        description: `allowed: [${log.allowed.join(', ') || 'none'}]; blocked: [${log.blocked.join(', ') || 'none'}]`,
      });
      expect(log.blocked, 'test attempted an API write outside its tier').toEqual([]);
    },
    { auto: true },
  ],

  buzz: async ({ page }, use) => {
    const buzz = new BuzzPage(page);
    await buzz.goto();
    await use(buzz);
  },
});

export { expect };

/**
 * Saves a named evidence screenshot to reports/evidence/ and attaches it to
 * the test result. Refuses to shoot the login page, which displays the demo
 * credentials.
 */
export async function evidence(page: Page, testInfo: TestInfo, tcId: string, name: string) {
  if (/\/auth\/login/.test(page.url())) {
    throw new Error('Refusing to capture evidence on the login page (it displays the demo credentials).');
  }
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
  const file = path.join(EVIDENCE_DIR, `${tcId}_${name}.png`);
  await page.screenshot({ path: file });
  await testInfo.attach(`${tcId}_${name}`, { path: file, contentType: 'image/png' });
}

/** Records a note on the test result; surfaced in the automation report. */
export function note(testInfo: TestInfo, type: string, description: string) {
  testInfo.annotations.push({ type, description });
}
