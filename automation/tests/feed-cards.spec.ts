import { test, expect, evidence, note, TIER } from '../utils/fixtures';
import { normalise, parsePostTime } from '../pages/BuzzPage';

test.describe('Buzz feed post cards', { tag: TIER.readOnly }, () => {
  test('BUZZ-TC-002 - Feed post card displays author, timestamp, content, and counters', async ({ buzz, page }, testInfo) => {
    // The CSV's 4-post precondition is snapshot-specific (M4 saw 8-9 posts, TC-002 PASS†).
    // Assert the structure on every card, whatever the live count is.
    const count = await buzz.cards.count();
    expect(count).toBeGreaterThan(0);
    const fmt = await buzz.dateFormat();
    note(testInfo, 'feed-size', `${count} post cards at observation time; app date format "${fmt}"`);

    for (let i = 0; i < count; i++) {
      const card = buzz.card(i);
      await expect(card.authorName, `card ${i} author`).toHaveText(/\S/);
      await expect(card.avatar, `card ${i} avatar`).toBeVisible();
      const time = normalise(await card.time.innerText());
      expect(parsePostTime(time, fmt), `card ${i} timestamp "${time}" is a valid date/time in the app's "${fmt}" format`).not.toBeNaN();
      const hasText = (await card.bodyText.count()) > 0 && /\S/.test(await card.bodyText.innerText());
      const hasImage = (await card.bodyPicture.count()) > 0;
      expect(hasText || hasImage, `card ${i} has text and/or image content`).toBe(true);
      await expect(card.likeCount, `card ${i} like counter`).toHaveCount(1);
      await expect(card.commentToggle, `card ${i} comment counter`).toHaveCount(1);
      await expect(card.shareCount, `card ${i} share counter`).toHaveCount(1);
    }
    await evidence(page, testInfo, 'TC-002', 'feed_cards');
  });

  test("BUZZ-TC-007 - 'Read More' expands truncated post text", async ({ buzz, page }, testInfo) => {
    const posts = await buzz.snapshot();
    let target = -1;
    // Every card renders a Read More element, but it is hidden unless the text is
    // actually truncated, so select on visibility rather than presence.
    for (const p of posts) {
      if (await buzz.card(p.index).readMore.isVisible()) { target = p.index; break; }
    }
    test.skip(target < 0, 'BLOCKED - no post with a Read More link in the live feed (data precondition unmet)');
    note(testInfo, 'target-post', `${posts[target].author} (${posts[target].time})`);

    const card = buzz.card(target);
    await expect(card.bodyText).toHaveClass(/--truncate/);
    await evidence(page, testInfo, 'TC-007', 'before_readmore');

    await card.readMore.click();
    // M4 TC-007: full text visible, Read More gone, no collapse control appears.
    // The app hides Read More with display:none (v-show) rather than removing the node;
    // M4 observed its disappearance via the accessibility tree, which excludes hidden nodes.
    await expect(card.bodyText).not.toHaveClass(/--truncate/);
    await expect(card.readMore).toBeHidden();
    await expect(card.root.getByText(/^(Show Less|Read Less)$/i)).toHaveCount(0);
    await evidence(page, testInfo, 'TC-007', 'after_readmore');
  });
});
