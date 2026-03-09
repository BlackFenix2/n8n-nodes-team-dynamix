/* eslint-disable @n8n/community-nodes/no-restricted-imports */
import { test, expect } from '@playwright/test';

test.describe('n8n - Smoke Tests', () => {
	test('should verify n8n webpage is live and accessible', async ({ page }) => {
		// Navigate to home page
		await page.goto('/');

		// Verify we're logged in (should be on workflows page)
		await expect(page).toHaveURL(/\/home\/workflows/, { timeout: 10000 });
		await expect(page).toHaveTitle(/Workflows - n8n|n8n/, { timeout: 5000 });

		// Check for authenticated UI elements
		const authenticatedElement = page
			.getByRole('button', { name: 'Add new item' })
			.or(page.locator('[data-test-id="new-workflow-button"]'))
			.or(page.locator('button:has-text("New workflow")'));
		await expect(authenticatedElement.first()).toBeVisible({ timeout: 5000 });

		// Take screenshot for verification
		await page.screenshot({
			path: 'tests/e2e/screenshots/auth-signed-in.png',
			fullPage: true,
		});
	});
});
