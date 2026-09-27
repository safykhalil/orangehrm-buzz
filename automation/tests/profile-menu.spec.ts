import { test, expect, evidence, TIER } from '../utils/fixtures';

test.describe('Global profile menu on the Buzz page', { tag: TIER.readOnly }, () => {
  test('BUZZ-TC-017 - Profile menu shows About/Support/Change Password/Logout on Buzz page', async ({ buzz, page }, testInfo) => {
    await buzz.userDropdown.click();
    // M4 TC-017: DOM query of [role="menuitem"] returned exactly these four. None is selected.
    await expect(page.getByRole('menuitem')).toHaveText(['About', 'Support', 'Change Password', 'Logout']);
    await evidence(page, testInfo, 'TC-017', 'profile_menu');
  });
});
