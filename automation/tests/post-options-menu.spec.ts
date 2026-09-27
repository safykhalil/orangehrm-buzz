import { test, expect, evidence, note, TIER } from '../utils/fixtures';
import { PostSnapshot } from '../pages/BuzzPage';

/**
 * The banner shows first + last name ("manda user") while post cards show
 * first + middle + last ("manda akhil user"), so "own post" is matched on the
 * first and last name tokens. Milestone 4 matched by avatar/display name the
 * same way and confirmed it with the Edit+Delete pattern.
 */
function isOwnPost(post: PostSnapshot, userName: string): boolean {
  const u = userName.toLowerCase().split(' ');
  const a = post.author.toLowerCase().split(' ');
  return u.length >= 2 && a[0] === u[0] && a[a.length - 1] === u[u.length - 1];
}

// Menu items are observed only; Edit Post / Delete Post are never clicked.
test.describe('Buzz post options menu (BR-005)', { tag: TIER.readOnly }, () => {
  test('BUZZ-TC-010 - Options menu on own post shows Edit Post and Delete Post', async ({ buzz, page }, testInfo) => {
    const user = await buzz.loggedInUserName();
    const own = (await buzz.snapshot()).find(p => isOwnPost(p, user));
    test.skip(!own, `BLOCKED - no post by the logged-in user ("${user}") in the live feed; creating one is policy-excluded`);
    note(testInfo, 'target-post', `${own!.author} (${own!.time}); banner user "${user}"`);

    const items = await buzz.card(own!.index).openOptionsMenu();
    // Exactly these two items, in the order M4 evidence shows (TC-010_01_own_post_options_menu.png).
    // The CSV names both items but not their order; see the report's source reconciliation.
    expect(items).toEqual(['Delete Post', 'Edit Post']);
    await evidence(page, testInfo, 'TC-010', 'own_post_options_menu');
  });

  test("BUZZ-TC-011 - Options menu on another author's post shows Delete Post only", async ({ buzz, page }, testInfo) => {
    const user = await buzz.loggedInUserName();
    const other = (await buzz.snapshot()).find(p => !isOwnPost(p, user));
    test.skip(!other, 'BLOCKED - every post in the live feed is by the logged-in user (data precondition unmet)');
    note(testInfo, 'target-post', `${other!.author} (${other!.time}); banner user "${user}"`);

    const items = await buzz.card(other!.index).openOptionsMenu();
    expect(items).toEqual(['Delete Post']);
    await evidence(page, testInfo, 'TC-011', 'other_author_options_menu');
  });
});
