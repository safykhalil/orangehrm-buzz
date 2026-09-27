import { test as setup } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { AUTH_STATE } from '../playwright.config';

// Logs in once per run and saves the session cookie for the 'buzz' project, so
// the shared demo sees one login per run instead of one per test.
setup('authenticate with the demo credentials shown on the login page', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.loginWithDemoCredentials();
  await page.context().storageState({ path: AUTH_STATE });
});
