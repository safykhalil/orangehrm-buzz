import { test, expect, evidence, note, TIER } from '../utils/fixtures';
import { normalise } from '../pages/BuzzPage';

test.describe('Buzz post interactions (no submission)', { tag: TIER.readOnly }, () => {
  test('BUZZ-TC-009 - Comment toggle expands/collapses inline comment box', async ({ buzz, page }, testInfo) => {
    const posts = await buzz.snapshot();
    const target = posts.find(p => p.comments === 0);
    test.skip(!target, "BLOCKED - no post showing '0 Comments' in the live feed (data precondition unmet)");
    note(testInfo, 'target-post', `${target!.author} (${target!.time})`);

    const card = buzz.card(target!.index);
    const url = page.url();
    await expect(card.commentBox).toHaveCount(0);

    await card.commentToggle.click();
    await expect(card.commentBox).toBeVisible();
    expect(page.url()).toBe(url);
    await evidence(page, testInfo, 'TC-009', 'comment_box_expanded');

    // Nothing is typed into the box (submission is BUZZ-TC-025, policy-excluded).
    await card.commentToggle.click();
    await expect(card.commentBox).toHaveCount(0);
    expect(page.url()).toBe(url);
    await evidence(page, testInfo, 'TC-009', 'comment_box_collapsed');
  });

  test('BUZZ-TC-014 - Share Post (repost) modal opens with optional caption', async ({ buzz, page }, testInfo) => {
    // M4 could not reach this (tool permission classifier). Expected result is taken from
    // Exploration §3.10, the highest-precedence source that confirmed it.
    const [post] = await buzz.snapshot();
    note(testInfo, 'target-post', `${post.author} (${post.time})`);
    await buzz.card(post.index).repostButton.click();

    const dialog = buzz.dialog;
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText('Share Post', { exact: true })).toBeVisible();
    // Read-only preview of the original post.
    await expect(dialog.getByText(post.time, { exact: true })).toBeVisible();
    expect(normalise(await dialog.innerText())).toContain(post.author);
    // Optional caption box, left empty; Share is enabled regardless.
    const caption = dialog.getByRole('textbox', { name: "What's on your mind?" });
    await expect(caption).toBeVisible();
    await expect(caption).toHaveValue('');
    await expect(dialog.getByRole('button', { name: 'Share', exact: true })).toBeEnabled();
    await evidence(page, testInfo, 'TC-014', 'share_post_modal');

    // Never click Share (BUZZ-TC-026 repost submission is policy-excluded). Close via ×.
    await dialog.getByRole('button', { name: '×' }).click();
    await expect(dialog).toHaveCount(0);
  });
});
