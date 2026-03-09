/* eslint-disable @n8n/community-nodes/no-restricted-imports, @typescript-eslint/no-unused-vars */
import { test, expect } from '@playwright/test';
import { e2eEnv } from './env';
import { signIn } from './helpers';

test.describe('TeamDynamix - Credentials', () => {
	test('should create TeamDynamix API credentials', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByRole('button', { name: 'Add new item' })).toBeVisible({
			timeout: 10000,
		});

		await page.getByRole('button', { name: 'Add new item' }).click();
		await page.getByRole('link', { name: 'Credential' }).click();

		// Search for TeamDynamix API credential
		await page.getByRole('combobox', { name: 'Search for app...' }).fill('team');
		await page.waitForTimeout(500);
		await page.getByRole('option', { name: 'TeamDynamix API' }).click();
		await page.locator('[data-test-id="new-credential-type-button"]').click();

		// Fill in credential details
		await page
			.locator('[data-test-id="parameter-input-baseUrl"] [data-test-id="parameter-input-field"]')
			.fill(e2eEnv.tdxBaseUrl);
		await page.waitForTimeout(300);

		await page
			.locator('[data-test-id="parameter-input-username"] [data-test-id="parameter-input-field"]')
			.fill(e2eEnv.tdxUsername);
		await page.waitForTimeout(300);

		await page
			.locator('[data-test-id="parameter-input-password"] [data-test-id="parameter-input-field"]')
			.fill(e2eEnv.tdxPassword);
		await page.waitForTimeout(300);

		// Save the credential
		await page.getByRole('button', { name: 'Save' }).click();
		await page.waitForLoadState('networkidle');
		await page.waitForTimeout(500);

		// Close dialog
		await page.getByRole('button', { name: 'Close this dialog' }).click();
		await page.waitForTimeout(500);

		// Take screenshot for verification
		await page.screenshot({
			path: 'tests/e2e/screenshots/credentials-created.png',
			fullPage: true,
		});
	});
});
