/* eslint-disable @n8n/community-nodes/no-restricted-imports, @n8n/community-nodes/no-restricted-globals */
import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config for n8n-nodes-team-dynamix E2E tests
 * Uses config-level global setup/teardown for Docker lifecycle + auth bootstrap
 */
export default defineConfig({
	testDir: './tests/e2e',
	globalSetup: './tests/e2e/global.setup.ts',
	globalTeardown: './tests/e2e/global.teardown.ts',
	fullyParallel: false,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: 1,
	reporter: 'html',
	use: {
		baseURL: 'http://localhost:5679',
		trace: 'on-first-retry',
		screenshot: 'only-on-failure',
		video: 'on',
		launchOptions: {
			slowMo: 800, // ms delay after every action (try 200–800)
		},
	},

	projects: [
		// Setup project: handles authentication and auth state
		{
			name: 'setup',
			testMatch: /.*\.setup\.ts/,
		},
		// Test projects depend on setup completing
		{
			name: 'chromium',
			use: {
				...devices['Desktop Chrome'],
				storageState: 'tests/e2e/.auth/user.json',
			},
			dependencies: ['setup'],
		},
	],
});
