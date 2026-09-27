import { test, expect, evidence, note, TIER } from '../utils/fixtures';
import { BuzzPage, PostSnapshot, likeLabel } from '../pages/BuzzPage';

/**
 * Cleanup timing (Hard Rule 5). Verified on Playwright 1.63: an afterEach hook
 * runs in its own slot sized by the config timeout (60s) unless the hook calls
 * testInfo.setTimeout(), and is killed mid-cleanup when it overruns. The
 * worst-case reversal budget below exceeds 60s, so the hook raises its own
 * timeout to CLEANUP_HOOK_TIMEOUT_MS, and the check below enforces
 * budget < hook timeout whenever this file is loaded.
 */
const CLEANUP = {
  attempts: 3,
  retryDelayMs: 2_000,
  reloadMs: 15_000,
  clickMs: 5_000,
  responseMs: 8_000,
  verifyMs: 5_000,
};
const PER_ATTEMPT_MS = CLEANUP.reloadMs + CLEANUP.clickMs + CLEANUP.responseMs + CLEANUP.verifyMs;
const CLEANUP_BUDGET_MS = CLEANUP.attempts * PER_ATTEMPT_MS + (CLEANUP.attempts - 1) * CLEANUP.retryDelayMs; // 103s
const CLEANUP_HOOK_TIMEOUT_MS = 130_000;
if (CLEANUP_BUDGET_MS >= CLEANUP_HOOK_TIMEOUT_MS) {
  throw new Error(`Cleanup budget ${CLEANUP_BUDGET_MS}ms must be < hook timeout ${CLEANUP_HOOK_TIMEOUT_MS}ms`);
}

const LIKES_API = /\/api\/v2\/buzz\/shares\/\d+\/likes$/;

/** Set before the first Like click, so cleanup runs even if the click itself fails. */
let touched: { post: PostSnapshot; baselineLikes: number } | null = null;

test.describe('Buzz Like/Unlike', { tag: TIER.stateChanging }, () => {
  test.use({ writePolicy: { allow: [{ method: 'POST', url: LIKES_API }, { method: 'DELETE', url: LIKES_API }] } });

  test.afterEach(async ({ page }, testInfo) => {
    if (!touched) return;
    testInfo.setTimeout(CLEANUP_HOOK_TIMEOUT_MS);
    const { post, baselineLikes } = touched;
    const buzz = new BuzzPage(page);

    for (let attempt = 1; attempt <= CLEANUP.attempts; attempt++) {
      try {
        // Re-read real server state rather than trusting what the test body last saw.
        await page.goto('/web/index.php/buzz/viewBuzz', { timeout: CLEANUP.reloadMs });
        await buzz.waitForFeed();
        const card = buzz.cardFor(post);
        if (await card.likeWrapper.evaluate(el => el.classList.contains('orangehrm-like-animation'), undefined, { timeout: CLEANUP.verifyMs })) {
          const unliked = page.waitForResponse(r => LIKES_API.test(r.url()) && r.request().method() === 'DELETE', { timeout: CLEANUP.responseMs });
          await card.likeControl.click({ timeout: CLEANUP.clickMs });
          expect((await unliked).ok(), 'cleanup DELETE /likes succeeded').toBe(true);
        }
        await expect(card.likeWrapper).not.toHaveClass(/orangehrm-like-animation/, { timeout: CLEANUP.verifyMs });
        const now = (await card.likeCount.innerText()).trim();
        note(testInfo, 'cleanup', `attempt ${attempt}: reversal confirmed, post not liked by this identity, count "${now}" (baseline "${likeLabel(baselineLikes)}")`);
        if (now !== likeLabel(baselineLikes)) {
          // Our own like is confirmed removed; a different count means someone else liked/unliked concurrently.
          note(testInfo, 'drift', `Like count after reversal is "${now}", baseline was "${likeLabel(baselineLikes)}" - concurrent activity on the shared demo`);
        }
        touched = null;
        return;
      } catch (err) {
        const msg = (err as Error).message.split('\n')[0];
        note(testInfo, 'cleanup', `attempt ${attempt} of ${CLEANUP.attempts} failed: ${msg}`);
        console.error(`[TC-008 cleanup] attempt ${attempt} failed: ${msg}`);
        if (attempt < CLEANUP.attempts) await page.waitForTimeout(CLEANUP.retryDelayMs);
      }
    }
    const post_ = `${post.author} (${post.time})`;
    touched = null;
    note(testInfo, 'cleanup-failed', `Could not confirm reversal of the Like on ${post_}; the shared demo may still show it liked.`);
    throw new Error(`CLEANUP FAILED: Like on ${post_} could not be confirmed reversed after ${CLEANUP.attempts} attempts`);
  });

  test('BUZZ-TC-008 - Like/Unlike toggle updates count and icon state', async ({ buzz, page }, testInfo) => {
    // Only touch a post this shared identity has not already liked (M4 re-verification
    // found the first baseline post pre-liked by another session), so the test's own
    // Like is the only change and the reversal restores the starting state exactly.
    const target = (await buzz.snapshot()).find(p => !p.likedByMe && !Number.isNaN(p.likes));
    test.skip(!target, 'BLOCKED - every post is already liked by this shared identity (data precondition unmet)');
    const n = target!.likes;
    note(testInfo, 'target-post', `${target!.author} (${target!.time}), starting count "${likeLabel(n)}"`);

    const card = buzz.cardFor(target!);
    await expect(card.likeCount).toHaveText(likeLabel(n));
    await expect(card.likeWrapper).not.toHaveClass(/orangehrm-like-animation/);
    await evidence(page, testInfo, 'TC-008', '01_before_like');

    // Step 1: Like.
    touched = { post: target!, baselineLikes: n };
    const liked = page.waitForResponse(r => LIKES_API.test(r.url()) && r.request().method() === 'POST');
    await card.likeControl.click();
    expect((await liked).ok(), 'POST /likes succeeded').toBe(true);
    await expect(card.likeCount).toHaveText(likeLabel(n + 1));
    await expect(card.likeWrapper).toHaveClass(/orangehrm-like-animation/);
    await evidence(page, testInfo, 'TC-008', '02_after_like');

    // Step 3: Unlike.
    const unliked = page.waitForResponse(r => LIKES_API.test(r.url()) && r.request().method() === 'DELETE');
    await card.likeControl.click();
    expect((await unliked).ok(), 'DELETE /likes succeeded').toBe(true);
    await expect(card.likeCount).toHaveText(likeLabel(n));
    await expect(card.likeWrapper).not.toHaveClass(/orangehrm-like-animation/);
    await evidence(page, testInfo, 'TC-008', '03_after_unlike');
    // afterEach still reloads and independently confirms the post is not left liked.
  });
});
