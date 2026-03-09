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
import { e2eEnv } from './env';

test.describe('Complete TeamDynamix Workflow Demo', () => {
	test('01 - Setup: Credentials creation', async ({ page }) => {
		// Step 1: Verify we're signed in and on the workflows page
		await page.goto('/');
		await expect(page).toHaveURL(/\/home\/workflows/, { timeout: 10000 });
		await expect(page).toHaveTitle(/Workflows - n8n|n8n/, { timeout: 5000 });

		// Step 2: Create TeamDynamix API credentials
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
		await takeScreenshot(page, 'demo-02-credentials-created');
	});

	test('02 - Workflow: Creation and manual trigger verification', async ({ page }) => {
		// Navigate to workflows
		await page.goto('/');
		await expect(page).toHaveURL(/\/home\/workflows/, { timeout: 10000 });
		await page.waitForLoadState('networkidle');
		await page.waitForTimeout(500);

		// Create new workflow
		await createNewWorkflow(page);
		await page.waitForTimeout(500);

		// Verify we're in the workflow editor and manual trigger node is present
		await expect(page).toHaveURL(/\/workflow\/.*/, { timeout: 10000 });
		const manualTrigger = page
			.locator('*')
			.filter({ hasText: /When clicking.*Execute workflow/ })
			.or(page.locator('[data-test-id*="node"]'))
			.first();

		await expect(manualTrigger).toBeVisible({ timeout: 10000 });
		await takeScreenshot(page, 'demo-03-workflow-with-trigger');
	});

	test.fixme('03 - Node: Add TeamDynamix node to workflow', async ({ page }) => {
		// FIXME: TeamDynamix node addition is not working reliably with current n8n UI
		// The node search and selection mechanism appears to have changed
		// Navigate to a workflow (create new one for this test)
		await page.goto('/');
		await expect(page).toHaveURL(/\/home\/workflows/, { timeout: 10000 });
		await page.waitForLoadState('networkidle');
		await page.waitForTimeout(500);

		await createNewWorkflow(page);
		await page.waitForTimeout(500);

		// Add TeamDynamix node
		await addTeamDynamixNode(page);
		await page.waitForTimeout(1000);

		// Verify TeamDynamix node is on canvas
		const tdxNodeOnCanvas = page
			.locator('[data-test-id="canvas-node"]')
			.filter({ hasText: 'TeamDynamix' })
			.or(page.locator('.node-wrapper').filter({ hasText: 'TeamDynamix' }));

		await expect(tdxNodeOnCanvas.first()).toBeVisible({ timeout: 5000 });
		await takeScreenshot(page, 'demo-04-node-added');
	});

	test.fixme('04 - Configuration: Resource and operation selection', async ({ page }) => {
		// FIXME: Depends on node addition which is not working
		// Navigate and create workflow with TeamDynamix node
		await page.goto('/');
		await expect(page).toHaveURL(/\/home\/workflows/, { timeout: 10000 });
		await page.waitForLoadState('networkidle');
		await page.waitForTimeout(500);

		await createNewWorkflow(page);
		await page.waitForTimeout(500);

		await addTeamDynamixNode(page);
		await page.waitForTimeout(1000);

		// Get TeamDynamix node reference
		const tdxNodeOnCanvas = page
			.locator('[data-test-id="canvas-node"]')
			.filter({ hasText: 'TeamDynamix' })
			.or(page.locator('.node-wrapper').filter({ hasText: 'TeamDynamix' }));

		await expect(tdxNodeOnCanvas.first()).toBeVisible({ timeout: 5000 });

		// Configure Ticket resource and Get Many operation
		await tdxNodeOnCanvas.first().click();
		await page.waitForTimeout(500);

		await selectResource(page, 'Ticket');
		await page.waitForTimeout(500);

		await selectOperation(page, 'Get Many');
		await page.waitForTimeout(500);

		await takeScreenshot(page, 'demo-05-operation-selected');
	});

	test.fixme('05 - Search: Guided search configuration', async ({ page }) => {
		// FIXME: Depends on node addition and configuration which are not working
		// Navigate and create workflow with configured TeamDynamix node
		await page.goto('/');
		await expect(page).toHaveURL(/\/home\/workflows/, { timeout: 10000 });
		await page.waitForLoadState('networkidle');
		await page.waitForTimeout(500);

		await createNewWorkflow(page);
		await page.waitForTimeout(500);

		await addTeamDynamixNode(page);
		await page.waitForTimeout(1000);

		const tdxNodeOnCanvas = page
			.locator('[data-test-id="canvas-node"]')
			.filter({ hasText: 'TeamDynamix' })
			.or(page.locator('.node-wrapper').filter({ hasText: 'TeamDynamix' }));

		await tdxNodeOnCanvas.first().click();
		await page.waitForTimeout(500);

		await selectResource(page, 'Ticket');
		await page.waitForTimeout(500);

		await selectOperation(page, 'Get Many');
		await page.waitForTimeout(500);

		// Configure guided search mode
		await configureGuidedSearch(page);
		await page.waitForTimeout(1000);

		await takeScreenshot(page, 'demo-06-guided-search-configured');

		// Final view of complete workflow
		await page.waitForTimeout(500);
		await takeScreenshot(page, 'demo-07-workflow-complete');
	});
});
