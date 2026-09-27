import { test, expect, evidence, note, TIER } from '../utils/fixtures';
import { PostSnapshot } from '../pages/BuzzPage';

const key = (p: PostSnapshot) => `${p.author} | ${p.time} | ${p.text}`;

function expectNonIncreasing(values: number[], what: string) {
  for (let i = 1; i < values.length; i++) {
    expect(values[i], `${what}: position ${i} (${values[i]}) must not exceed position ${i - 1} (${values[i - 1]})`)
      .toBeLessThanOrEqual(values[i - 1]);
  }
}

// Filters re-sort the client view only (GET /api/v2/buzz/feed); no data is written.
test.describe('Buzz feed filters', { tag: TIER.readOnly }, () => {
  test("BUZZ-TC-003 - Default feed filter is 'Most Recent Posts'", async ({ buzz, page }, testInfo) => {
    expect(await buzz.activeFilters()).toEqual(['Most Recent Posts']);
    const posts = await buzz.snapshot();
    expect(posts.every(p => !Number.isNaN(p.timestamp)), 'every post timestamp parses').toBe(true);
    expectNonIncreasing(posts.map(p => p.timestamp), 'reverse-chronological order');
    note(testInfo, 'observed-order', posts.map(p => `${p.author} (${p.time})`).join(' -> '));
    note(testInfo, 'date-format', await buzz.dateFormat());
    await evidence(page, testInfo, 'TC-003', 'default_filter_active');
  });

  test("BUZZ-TC-004 - 'Most Liked Posts' filter sorts descending by Like count", async ({ buzz, page }, testInfo) => {
    await buzz.applyFilter('Most Liked Posts');
    expect(await buzz.activeFilters()).toEqual(['Most Liked Posts']);
    const posts = await buzz.snapshot();
    expect(posts.every(p => !Number.isNaN(p.likes)), 'every like count parses').toBe(true);
    expectNonIncreasing(posts.map(p => p.likes), 'descending Like count');
    note(testInfo, 'observed-order', posts.map(p => `${p.author} (${p.likes})`).join(' -> '));
    await evidence(page, testInfo, 'TC-004', 'most_liked_sorted');
  });

  test("BUZZ-TC-005 - 'Most Recent Posts' restores original feed order", async ({ buzz, page }, testInfo) => {
    const baseline = await buzz.snapshot();
    await buzz.applyFilter('Most Liked Posts');
    await buzz.applyFilter('Most Recent Posts');
    const restored = await buzz.snapshot();

    // Same posts in the same order, and re-sorting altered no counts (non-destructive).
    expect(restored.map(key)).toEqual(baseline.map(key));
    expect(restored.map(p => [p.likes, p.comments, p.shares])).toEqual(baseline.map(p => [p.likes, p.comments, p.shares]));
    expect(await buzz.activeFilters()).toEqual(['Most Recent Posts']);
    note(testInfo, 'posts-compared', String(baseline.length));
    await evidence(page, testInfo, 'TC-005', 'restored_recent');
  });

  test("BUZZ-TC-020 - 'Most Liked' and 'Most Commented' use the same tie-break order", async ({ buzz, page }, testInfo) => {
    // Expected result corrected in the CSV on 2026-09-27 (QC-approved test-design defect fix,
    // per M4 TC-020 re-analysis): both filters break ties the same way, oldest post first.
    await buzz.applyFilter('Most Liked Posts');
    const liked = await buzz.snapshot();
    await evidence(page, testInfo, 'TC-020', '01_most_liked_order');
    await buzz.applyFilter('Most Commented Posts');
    const commented = await buzz.snapshot();
    await evidence(page, testInfo, 'TC-020', '02_most_commented_order');

    expect([...liked, ...commented].every(p => !Number.isNaN(p.timestamp)), 'every post timestamp parses').toBe(true);
    note(testInfo, 'date-format', await buzz.dateFormat());

    // Primary keys first, so the tie groups below are really ties.
    expectNonIncreasing(liked.map(p => p.likes), 'Most Liked: descending Like count');
    expectNonIncreasing(commented.map(p => p.comments), 'Most Commented: descending Comment count');

    const tieGroups = (posts: PostSnapshot[], primary: (p: PostSnapshot) => number) => {
      const groups: PostSnapshot[][] = [];
      for (const p of posts) {
        const last = groups[groups.length - 1];
        if (last && primary(last[0]) === primary(p)) last.push(p); else groups.push([p]);
      }
      return groups.filter(g => g.length > 1);
    };
    const likedTies = tieGroups(liked, p => p.likes);
    const commentedTies = tieGroups(commented, p => p.comments);
    test.skip(likedTies.length === 0 || commentedTies.length === 0,
      'BLOCKED - the live feed has no tied posts under one of the filters (data precondition unmet)');
    note(testInfo, 'most-liked-ties', likedTies.map(g => g.map(p => `${p.author} ${p.time}`).join(' -> ')).join(' | '));
    note(testInfo, 'most-commented-ties', commentedTies.map(g => g.map(p => `${p.author} ${p.time}`).join(' -> ')).join(' | '));

    // 1. Within every tie group, ascending chronological order (timestamps are minute-granular,
    //    so equal neighbours are allowed).
    for (const [name, groups] of [['Most Liked', likedTies], ['Most Commented', commentedTies]] as const) {
      for (const g of groups) {
        for (let i = 1; i < g.length; i++) {
          expect(g[i].timestamp, `${name} tie group: "${key(g[i])}" must not be older than "${key(g[i - 1])}"`)
            .toBeGreaterThanOrEqual(g[i - 1].timestamp);
        }
      }
    }

    // 2. Same secondary key: any two posts tied under both filters keep the same relative order.
    const pos = (list: PostSnapshot[]) => new Map(list.map((p, i) => [key(p), i]));
    const lp = pos(liked), cp = pos(commented);
    let pairs = 0;
    for (let i = 0; i < liked.length; i++) {
      for (let j = i + 1; j < liked.length; j++) {
        const a = liked[i], b = liked[j];
        if (a.likes !== b.likes || a.comments !== b.comments) continue;
        pairs++;
        expect(Math.sign(cp.get(key(b))! - cp.get(key(a))!), `"${key(a)}" vs "${key(b)}" order differs between filters`)
          .toBe(Math.sign(lp.get(key(b))! - lp.get(key(a))!));
      }
    }
    note(testInfo, 'pairs-tied-under-both', String(pairs));
  });
});
