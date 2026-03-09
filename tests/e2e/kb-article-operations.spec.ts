/* eslint-disable @n8n/community-nodes/no-restricted-imports */
import { test, expect } from '@playwright/test';
import {
	createNewWorkflow,
	addTeamDynamixNode,
	selectResource,
	selectOperation,
	configureGuidedSearch,
	takeScreenshot,
} from './helpers';

test.describe('TeamDynamix - KB Article Operations', () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to n8n home
		await page.goto('/');

		// Wait for n8n to load
		await page.waitForLoadState('networkidle');
	});

	test('should create a workflow with TeamDynamix KB Article node', async ({ page }) => {
		// Create new workflow
		await createNewWorkflow(page);

		// Add TeamDynamix node to canvas
		await addTeamDynamixNode(page);

		// Click on the TeamDynamix node to open parameters
		const tdxNodeOnCanvas = page
			.locator('[data-test-id="canvas-node"]')
			.filter({ hasText: 'TeamDynamix' })
			.or(page.locator('.node-wrapper').filter({ hasText: 'TeamDynamix' }));

		await expect(tdxNodeOnCanvas.first()).toBeVisible({ timeout: 5000 });
		await tdxNodeOnCanvas.first().click();

		// Select Resource: KB Article
		await selectResource(page, 'KB Article');

		// Verify KB Article operations are available
		const operationDropdown = page
			.locator('select, [role="combobox"]')
			.filter({ has: page.locator('text=/Operation/i') })
			.first();

		await expect(operationDropdown).toBeVisible({ timeout: 5000 });

		// Take screenshot for verification
		await takeScreenshot(page, 'kb-article-workflow-created');
	});

	test('should configure TeamDynamix KB Article Get Many with guided search', async ({ page }) => {
		// Create new workflow
		await createNewWorkflow(page);

		// Add TeamDynamix node
		await addTeamDynamixNode(page);

		// Click on the TeamDynamix node to open parameters
		const tdxNodeOnCanvas = page
			.locator('[data-test-id="canvas-node"]')
			.filter({ hasText: 'TeamDynamix' })
			.or(page.locator('.node-wrapper').filter({ hasText: 'TeamDynamix' }));

		await tdxNodeOnCanvas.first().click();

		// Configure node
		await selectResource(page, 'KB Article');
		await selectOperation(page, 'Get Many');

		// Configure guided search mode
		await configureGuidedSearch(page);

		// Take screenshot for verification
		await takeScreenshot(page, 'kb-article-guided-search-configured');
	});
});
