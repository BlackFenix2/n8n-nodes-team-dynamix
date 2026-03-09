import { execSync } from 'node:child_process';
import { chromium, expect, type FullConfig } from '@playwright/test';
import { N8N_BASE_URL, N8N_SIGNIN_URL, N8N_SETUP_URL, completeInitialSetupIfVisible } from './helpers';

/**
 * Global setup: Start Docker and seed initial owner account
 * Authentication/auth state is handled by auth.setup.ts project dependency
 */
export default async function globalSetup(_config: FullConfig): Promise<void> {
	// Start Docker container for n8n
	execSync('docker compose up -d n8n-e2e', { stdio: 'inherit' });

	const browser = await chromium.launch({ headless: true });
	const context = await browser.newContext({ baseURL: N8N_BASE_URL });
	const page = await context.newPage();

	// Wait for n8n to be ready
	await expect
		.poll(
			async () => {
				try {
					const response = await page.request.get(N8N_SIGNIN_URL);
					return response.status();
				} catch {
					return 0;
				}
			},
			{ timeout: 120000, intervals: [1000, 2000, 5000] },
		)
		.toBeGreaterThan(0);

	// Complete initial setup to seed owner account
	await page.goto(N8N_SETUP_URL);
	await page.waitForLoadState('networkidle');
	await completeInitialSetupIfVisible(page);

	await browser.close();
}
