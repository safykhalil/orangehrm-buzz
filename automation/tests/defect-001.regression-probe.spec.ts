import { test, expect, evidence, note, TIER } from '../utils/fixtures';

/**
 * ⚠ REGRESSION PROBE — INVERTED ASSERTION ⚠
 *
 *   runner PASS = DEFECT-001 is STILL PRESENT (expected, not alarming)
 *   runner FAIL = the symptom did NOT reproduce — needs a human QC decision
 *                 (fixed? flaky repro? something else changed?). Do not flip
 *                 this probe to expect success; report it instead.
 *
 * DEFECT-001: Share Video "Share" button is not disabled while the Video URL
 * field is empty (unlike Share Photos, BUZZ-TC-012). Source: BUZZ-TC-019,
 * M4 reproducibility 2/2.
 *
 * Boundary (matches the M4 defect writeup exactly): observe the button's
 * disabled state only. Share is NEVER clicked — submitting is BUZZ-TC-024,
 * excluded by the interaction policy. The write guard also aborts any API
 * write from this test.
 */
const BANNER = '⚠ REGRESSION PROBE (DEFECT-001): PASS = defect still present; FAIL = symptom did not reproduce (human QC decision needed)';

test.describe('DEFECT-001 regression probe', { tag: TIER.regressionProbe }, () => {
  test('BUZZ-TC-019 - [REGRESSION PROBE, inverted] DEFECT-001 Share Video Share button still enabled with empty URL', async ({ buzz, page }, testInfo) => {
    console.log(BANNER);
    note(testInfo, 'regression-probe', BANNER);

    await buzz.shareVideoButton.click();
    const dialog = buzz.dialog;
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText('Share Video', { exact: true })).toBeVisible();
    await expect(dialog.getByPlaceholder('Paste Video URL')).toHaveValue('');

    // INVERTED: asserts the defect symptom (enabled with an empty URL) is still present.
    await expect(dialog.getByRole('button', { name: 'Share', exact: true }),
      'DEFECT-001 symptom: Share should be disabled with an empty URL but is enabled').toBeEnabled();
    await evidence(page, testInfo, 'TC-019', 'share_video_empty_url_enabled');

    await dialog.getByRole('button', { name: '×' }).click();
    await expect(dialog).toHaveCount(0);
  });
});
