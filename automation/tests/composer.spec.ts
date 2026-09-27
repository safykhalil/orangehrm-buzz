import { test, expect, evidence, TIER } from '../utils/fixtures';

test.describe('Buzz composer', { tag: TIER.readOnly }, () => {
  test('BUZZ-TC-001 - Post composer displays required controls', async ({ buzz, page }, testInfo) => {
    // Structural presence only; nothing is typed or published (Exploration §3.2, M4 TC-001 PASS).
    await expect(buzz.composerTextbox).toBeVisible();
    await expect(buzz.postButton).toBeVisible();
    await expect(buzz.sharePhotosButton).toBeVisible();
    await expect(buzz.shareVideoButton).toBeVisible();
    await evidence(page, testInfo, 'TC-001', 'composer');
  });

  test("BUZZ-TC-012 - Share Photos 'Share' button disabled until photo attached", async ({ buzz, page }, testInfo) => {
    await buzz.sharePhotosButton.click();
    await expect(buzz.dialog).toBeVisible();
    await expect(buzz.dialog.getByText('Share Photos', { exact: true })).toBeVisible();
    // M4 TC-012: button "Share" [disabled] with no photo attached. No file chooser is opened.
    await expect(buzz.dialog.getByRole('button', { name: 'Share', exact: true })).toBeDisabled();
    await evidence(page, testInfo, 'TC-012', 'share_photos_disabled');

    // Escape does not close this modal (known quirk), so close via the dialog's own ×.
    await buzz.dialog.getByRole('button', { name: '×' }).click();
    await expect(buzz.dialog).toHaveCount(0);
  });
});
