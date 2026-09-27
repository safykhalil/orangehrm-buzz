import { Locator, Page, Response, expect } from '@playwright/test';

export type FeedFilter = 'Most Recent Posts' | 'Most Liked Posts' | 'Most Commented Posts';

/** A snapshot of one post card's observable data, read from the DOM. */
export interface PostSnapshot {
  index: number;
  author: string; // whitespace-normalised ("Sania  Shaheen" -> "Sania Shaheen")
  time: string; // e.g. "2020-10-08 05:38 AM"
  timestamp: number; // parsed from `time`, for ordering checks
  text: string; // first 80 chars of body text ('' for image-only posts)
  likes: number;
  comments: number;
  shares: number;
  likedByMe: boolean;
}

export const normalise = (s: string) => s.replace(/\s+/g, ' ').trim();

/**
 * "2020-10-08 05:38 AM" -> epoch ms, using the app's configured date format
 * (e.g. "Y-m-d", "Y-d-m", "d/m/Y"). The shared demo's format is changed by
 * other users between runs (seen: Y-m-d and Y-d-m on the same day), so it must
 * never be assumed. Returns NaN for a format or value it cannot parse.
 */
export function parsePostTime(time: string, dateFormat: string): number {
  const order = dateFormat.replace(/[^Ymd]/g, '');
  const tm = /^(.+?) (\d{1,2}):(\d{2}) (AM|PM)$/.exec(time.trim());
  if (order.length !== 3 || new Set(order).size !== 3 || !tm) return NaN;
  const nums = tm[1].split(/\D+/).filter(Boolean).map(Number);
  if (nums.length !== 3) return NaN;
  const part = (k: string) => nums[order.indexOf(k)];
  const [y, mo, d] = [part('Y'), part('m'), part('d')];
  if (y < 1000 || mo < 1 || mo > 12 || d < 1 || d > 31) return NaN;
  const hour = (Number(tm[2]) % 12) + (tm[4] === 'PM' ? 12 : 0);
  return Date.UTC(y, mo - 1, d, hour, Number(tm[3]));
}

/** Count label as the app renders it: "0 Likes", "1 Like", "2 Likes". */
export const likeLabel = (n: number) => `${n} ${n === 1 ? 'Like' : 'Likes'}`;

export class BuzzPage {
  readonly composerTextbox: Locator;
  readonly postButton: Locator;
  readonly sharePhotosButton: Locator;
  readonly shareVideoButton: Locator;
  readonly cards: Locator;
  readonly dialog: Locator;
  readonly userDropdown: Locator;

  constructor(readonly page: Page) {
    this.composerTextbox = page.getByRole('textbox', { name: "What's on your mind?" }).first();
    this.postButton = page.getByRole('button', { name: 'Post', exact: true });
    this.sharePhotosButton = page.getByRole('button', { name: 'Share Photos' });
    this.shareVideoButton = page.getByRole('button', { name: 'Share Video' });
    this.cards = page.locator('.orangehrm-buzz');
    this.dialog = page.getByRole('dialog');
    this.userDropdown = page.locator('.oxd-userdropdown-tab');
  }

  async goto() {
    await this.page.goto('/web/index.php/buzz/viewBuzz');
    await this.waitForFeed();
  }

  async waitForFeed() {
    await expect(this.cards.first()).toBeVisible();
  }

  filterButton(name: FeedFilter): Locator {
    // Accessible names carry a leading icon glyph (" Most Recent Posts"), so match by substring.
    return this.page.getByRole('button', { name });
  }

  /**
   * The active filter carries `oxd-button--label-warn`; inactive ones carry
   * `oxd-button--text`. This build exposes no aria-pressed/[active] state
   * (Milestone 4, TC-003), so the class is the confirmed state indicator.
   */
  async activeFilters(): Promise<string[]> {
    const names: FeedFilter[] = ['Most Recent Posts', 'Most Liked Posts', 'Most Commented Posts'];
    const active: string[] = [];
    for (const n of names) {
      const cls = (await this.filterButton(n).getAttribute('class')) ?? '';
      if (cls.includes('oxd-button--label-warn')) active.push(n);
    }
    return active;
  }

  /** Clicks a filter and waits for the feed request it triggers to complete. */
  async applyFilter(name: FeedFilter) {
    const feedLoaded = this.page.waitForResponse(
      (r: Response) => r.url().includes('/api/v2/buzz/feed') && r.request().method() === 'GET' && r.ok(),
    );
    await this.filterButton(name).click();
    await feedLoaded;
    await expect(this.filterButton(name)).toHaveClass(/oxd-button--label-warn/);
    await this.waitForFeed();
  }

  private dateFormatCache?: string;

  /** The app's configured display date format, read via a GET (allowed by the write guard). */
  async dateFormat(): Promise<string> {
    if (!this.dateFormatCache) {
      const r = await this.page.request.get('/web/index.php/api/v2/admin/localization');
      expect(r.ok(), 'GET /api/v2/admin/localization').toBe(true);
      this.dateFormatCache = String((await r.json()).data.dateFormat);
    }
    return this.dateFormatCache;
  }

  async snapshot(): Promise<PostSnapshot[]> {
    const fmt = await this.dateFormat();
    const raw = await this.cards.evaluateAll(cards =>
      cards.map(c => {
        const txt = (sel: string) => c.querySelector(sel)?.textContent ?? '';
        const stats = Array.from(c.querySelectorAll('.orangehrm-buzz-stats p')).map(p => p.textContent ?? '');
        const num = (re: RegExp) => {
          const hit = stats.map(s => re.exec(s)).find(Boolean);
          return hit ? Number(hit[1]) : NaN;
        };
        return {
          author: txt('.orangehrm-buzz-post-emp-name'),
          time: txt('.orangehrm-buzz-post-time'),
          text: txt('.orangehrm-buzz-post-body-text'),
          likes: num(/^(\d+) Likes?$/),
          comments: num(/^(\d+) Comments?$/),
          shares: num(/^(\d+) Shares?$/),
          likedByMe: !!c.querySelector('.orangehrm-buzz-post-actions .orangehrm-like-animation'),
        };
      }),
    );
    return raw.map((r, index) => ({
      index,
      author: normalise(r.author),
      time: normalise(r.time),
      timestamp: parsePostTime(normalise(r.time), fmt),
      text: normalise(r.text).slice(0, 80),
      likes: r.likes,
      comments: r.comments,
      shares: r.shares,
      likedByMe: r.likedByMe,
    }));
  }

  /** Display name in the top banner, e.g. "manda user". */
  async loggedInUserName(): Promise<string> {
    return normalise(await this.page.locator('.oxd-userdropdown-name').innerText());
  }

  card(index: number): PostCard {
    return new PostCard(this.page, this.cards.nth(index));
  }

  /**
   * Re-finds a post by author + timestamp rather than feed position, so it
   * still resolves after a re-sort or after another user's post lands on top.
   */
  cardFor(post: Pick<PostSnapshot, 'author' | 'time'>): PostCard {
    const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Author text is rendered with irregular spacing ("Sania  Shaheen"), so match whitespace loosely.
    const name = new RegExp(`^\\s*${post.author.split(' ').map(esc).join('\\s+')}\\s*$`);
    const loc = this.cards
      .filter({ has: this.page.locator('.orangehrm-buzz-post-time', { hasText: post.time }) })
      .filter({ has: this.page.locator('.orangehrm-buzz-post-emp-name', { hasText: name }) });
    return new PostCard(this.page, loc.first());
  }
}

/** One post card (`.orangehrm-buzz`). All locators are scoped to the card. */
export class PostCard {
  readonly authorName: Locator;
  readonly avatar: Locator;
  readonly time: Locator;
  readonly bodyText: Locator;
  readonly readMore: Locator;
  readonly bodyPicture: Locator;
  readonly likeCount: Locator;
  readonly commentToggle: Locator;
  readonly shareCount: Locator;
  /**
   * The real Like control. `#heart-svg` is duplicated on every post, so it must
   * be scoped to this card's action bar. Never click the stats-row
   * `.orangehrm-buzz-stats-like-icon` — it is display-only (DEFECT-002 withdrawal).
   */
  readonly likeControl: Locator;
  readonly likeWrapper: Locator;
  /** Icon-only buttons with no accessible name; identified by their Bootstrap icon. */
  readonly repostButton: Locator;
  readonly optionsButton: Locator;
  readonly optionsMenuItems: Locator;
  readonly commentBox: Locator;

  constructor(readonly page: Page, readonly root: Locator) {
    this.authorName = root.locator('.orangehrm-buzz-post-emp-name');
    this.avatar = root.locator('.orangehrm-buzz-post-header').getByRole('img', { name: 'profile picture' });
    this.time = root.locator('.orangehrm-buzz-post-time');
    this.bodyText = root.locator('.orangehrm-buzz-post-body-text');
    this.readMore = root.locator('.orangehrm-buzz-post-body-readmore');
    this.bodyPicture = root.locator('.orangehrm-buzz-post-body-picture');
    this.likeCount = root.locator('.orangehrm-buzz-stats p').filter({ hasText: /^\d+ Likes?$/ });
    this.commentToggle = root.locator('.orangehrm-buzz-stats p').filter({ hasText: /^\d+ Comments?$/ });
    this.shareCount = root.locator('.orangehrm-buzz-stats p').filter({ hasText: /^\d+ Shares?$/ });
    this.likeControl = root.locator('.orangehrm-buzz-post-actions #heart-svg');
    this.likeWrapper = root.locator('.orangehrm-buzz-post-actions > div').filter({ has: page.locator('#heart-svg') });
    this.repostButton = root.locator('.orangehrm-buzz-post-actions button').filter({ has: page.locator('i.bi-share-fill') });
    this.optionsButton = root.locator('.orangehrm-buzz-post-header-config button');
    this.optionsMenuItems = root.locator('.orangehrm-buzz-post-header-config [role="menu"] li');
    this.commentBox = root.getByPlaceholder('Write your comment...');
  }

  async openOptionsMenu(): Promise<string[]> {
    await this.optionsButton.click();
    await expect(this.optionsMenuItems.first()).toBeVisible();
    return (await this.optionsMenuItems.allInnerTexts()).map(normalise);
  }
}
