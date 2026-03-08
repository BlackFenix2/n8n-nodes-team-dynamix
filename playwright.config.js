const { defineConfig, devices } = require('@playwright/test');

/**
 * Playwright config for n8n-nodes-team-dynamix E2E tests
 * Starts n8n via Docker Compose and waits for http://localhost:5678
 */
module.exports = defineConfig({
	testDir: './tests/e2e',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: 'html',
	use: {
		baseURL: 'http://localhost:5678',
		trace: 'on-first-retry',
		screenshot: 'only-on-failure',
	},

	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
	],

	webServer: {
		command: 'docker compose up n8n-e2e',
		url: 'http://localhost:5678',
		reuseExistingServer: true,
		timeout: 180 * 1000,
	},
});
