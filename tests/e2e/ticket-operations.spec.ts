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

test.describe('TeamDynamix - Ticket Operations', () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to n8n home
		await page.goto('/');

		// Wait for n8n to load
		await page.waitForLoadState('networkidle');
	});

	test('should create a workflow with TeamDynamix Ticket node', async ({ page }) => {
		// Create new workflow
		await createNewWorkflow(page);

		// Verify Manual Trigger node is present (n8n adds it by default)
		const manualTrigger = page
			.locator('[data-test-id="canvas-node"]')
			.filter({ hasText: 'Manual' })
			.or(page.locator('.node-wrapper').filter({ hasText: 'Manual' }));

		await expect(manualTrigger.first()).toBeVisible({ timeout: 10000 });

		// Add TeamDynamix node to canvas
		await addTeamDynamixNode(page);

		// Verify TeamDynamix node is on canvas
		const tdxNodeOnCanvas = page
			.locator('[data-test-id="canvas-node"]')
			.filter({ hasText: 'TeamDynamix' })
			.or(page.locator('.node-wrapper').filter({ hasText: 'TeamDynamix' }));

		await expect(tdxNodeOnCanvas.first()).toBeVisible({ timeout: 5000 });

		// Verify Ticket resource is available
		const nodePanel = page
			.locator('[data-test-id="parameter-input"]')
			.or(page.locator('.parameter-input'));

		const resourceDropdown = nodePanel
			.filter({ hasText: 'Resource' })
			.locator('select, [role="combobox"]')
			.first();

		if (await resourceDropdown.isVisible()) {
			await resourceDropdown.click();

			const ticketOption = page
				.locator('option:has-text("Ticket"), [role="option"]:has-text("Ticket")')
				.first();
			await expect(ticketOption).toBeVisible({ timeout: 3000 });
		}

		// Take screenshot for verification
		await takeScreenshot(page, 'ticket-workflow-created');
	});

	test('should configure TeamDynamix Ticket Get Many with guided search', async ({ page }) => {
		// Create new workflow
		await createNewWorkflow(page);

		// Add TeamDynamix node
		await addTeamDynamixNode(page);

		// Click on TeamDynamix node to open parameters
		await page
			.locator('[data-test-id="canvas-node"]')
			.filter({ hasText: 'TeamDynamix' })
			.first()
			.click();

		// Configure node
		await selectResource(page, 'Ticket');
		await selectOperation(page, 'Get Many');

		// Configure guided search mode
		await configureGuidedSearch(page);

		// Take screenshot for verification
		await takeScreenshot(page, 'ticket-guided-search-configured');
	});
});
