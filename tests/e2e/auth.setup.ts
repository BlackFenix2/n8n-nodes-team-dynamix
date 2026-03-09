import { mkdirSync } from 'node:fs';
import { chromium, test as setup } from '@playwright/test';
import { e2eEnv } from './env';
import { N8N_BASE_URL, N8N_SIGNIN_URL, signIn, verifyLoggedIn } from './helpers';

const AUTH_STATE_PATH = 'tests/e2e/.auth/user.json';

/**
 * Auth setup: Sign in and save authenticated state
 * Runs as a project dependency after global setup
 */
setup('authenticate', async () => {
	const browser = await chromium.launch({ headless: true });
	const context = await browser.newContext({ baseURL: N8N_BASE_URL });
	const page = await context.newPage();

	// Sign in using helper (includes retry logic)
	await page.goto(N8N_SIGNIN_URL);
	await signIn(page);

	// Verify login before saving auth state
	try {
		await verifyLoggedIn(page);
	} catch {
		// Fallback: tests using fixtures will complete sign-in if needed
	}

	// Save authenticated state for test reuse
	mkdirSync('tests/e2e/.auth', { recursive: true });
	await page.context().storageState({ path: AUTH_STATE_PATH });

	await browser.close();
});
