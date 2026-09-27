import { Page, expect } from '@playwright/test';

/**
 * The demo instance publishes its own login credentials on the login page.
 * Project convention (Milestones 1-4): read them from the page at runtime and
 * never write them anywhere — not in code, logs, reports or evidence.
 */
export class LoginPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/web/index.php/auth/login');
    await expect(this.page.getByRole('textbox', { name: 'Username' })).toBeVisible();
  }

  /** Parses the demo-credentials hint block. Values are returned, never logged. */
  async readDemoCredentials(): Promise<{ username: string; password: string }> {
    const hint = await this.page.locator('.orangehrm-demo-credentials').innerText();
    const username = /Username\s*:\s*(\S+)/.exec(hint)?.[1];
    const password = /Password\s*:\s*(\S+)/.exec(hint)?.[1];
    if (!username || !password) {
      throw new Error('Demo credentials are not shown on the login page (Unknown / Not observed).');
    }
    return { username, password };
  }

  async loginWithDemoCredentials() {
    const { username, password } = await this.readDemoCredentials();
    await this.page.getByRole('textbox', { name: 'Username' }).fill(username);
    await this.page.getByRole('textbox', { name: 'Password' }).fill(password);
    await this.page.getByRole('button', { name: 'Login' }).click();
    await this.page.waitForURL(/\/dashboard\//);
  }
}
