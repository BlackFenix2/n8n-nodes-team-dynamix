const { test, expect } = require('@playwright/test');

test.describe('TeamDynamix Node - Workflow Creation', () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to n8n home
		await page.goto('/');

		// Wait for n8n to load
		await page.waitForLoadState('networkidle');
	});

	test('should create a workflow with manual trigger and TeamDynamix node', async ({ page }) => {
		// Click "New Workflow" or similar button (adjust selector based on n8n UI)
		// n8n uses different selectors depending on version, this is a common pattern
		const newWorkflowButton = page
			.locator('[data-test-id="new-workflow-button"]')
			.or(page.locator('button:has-text("New workflow")'))
			.first();

		if (await newWorkflowButton.isVisible()) {
			await newWorkflowButton.click();
		}

		// Wait for canvas to load
		await page.waitForLoadState('networkidle');

		// Verify Manual Trigger node is present (n8n adds it by default)
		const manualTrigger = page
			.locator('[data-test-id="canvas-node"]')
			.filter({
				hasText: 'Manual',
			})
			.or(page.locator('.node-wrapper').filter({ hasText: 'Manual' }));

		await expect(manualTrigger.first()).toBeVisible({ timeout: 10000 });

		// Add TeamDynamix node
		// Click the "+" button or node creator
		const addNodeButton = page
			.locator('[data-test-id="node-creator-plus-button"]')
			.or(page.locator('button[title*="Add"]'))
			.first();

		await addNodeButton.click();

		// Search for TeamDynamix node
		const searchInput = page
			.locator('[data-test-id="node-creator-search-input"]')
			.or(page.locator('input[placeholder*="Search"]'))
			.first();

		await searchInput.fill('TeamDynamix');
		await page.waitForTimeout(500);

		// Click on TeamDynamix node in the list
		const tdxNode = page
			.locator('[data-test-id="node-creator-item"]')
			.filter({
				hasText: 'TeamDynamix',
			})
			.or(page.locator('.node-item').filter({ hasText: 'TeamDynamix' }));

		await tdxNode.first().click();

		// Wait for node to be added to canvas
		await page.waitForLoadState('networkidle');

		// Verify TeamDynamix node is on canvas
		const tdxNodeOnCanvas = page
			.locator('[data-test-id="canvas-node"]')
			.filter({
				hasText: 'TeamDynamix',
			})
			.or(page.locator('.node-wrapper').filter({ hasText: 'TeamDynamix' }));

		await expect(tdxNodeOnCanvas.first()).toBeVisible({ timeout: 5000 });

		// Verify node has resource parameter (Ticket or KB Article)
		const nodePanel = page
			.locator('[data-test-id="parameter-input"]')
			.or(page.locator('.parameter-input'));

		// Check if Resource dropdown exists
		const resourceDropdown = nodePanel
			.filter({ hasText: 'Resource' })
			.locator('select, [role="combobox"]')
			.first();
		if (await resourceDropdown.isVisible()) {
			// Verify we can see ticket and kbArticle options
			await resourceDropdown.click();

			const ticketOption = page
				.locator('option:has-text("Ticket"), [role="option"]:has-text("Ticket")')
				.first();
			await expect(ticketOption).toBeVisible({ timeout: 3000 });
		}

		// Save the workflow
		const saveButton = page
			.locator('[data-test-id="workflow-save-button"]')
			.or(page.locator('button:has-text("Save")'))
			.first();

		if (await saveButton.isVisible()) {
			await saveButton.click();

			// Wait for save confirmation
			await page.waitForLoadState('networkidle');

			// Give it a moment to appear
			await page.waitForTimeout(1000);
		}

		// Take screenshot for verification
		await page.screenshot({ path: 'tests/e2e/screenshots/workflow-created.png', fullPage: true });
	});

	test('should configure TeamDynamix Ticket Get Many with guided search', async ({ page }) => {
		// This test verifies the guided search mode works
		// Create new workflow
		const newWorkflowButton = page
			.locator('[data-test-id="new-workflow-button"]')
			.or(page.locator('button:has-text("New workflow")'))
			.first();

		if (await newWorkflowButton.isVisible()) {
			await newWorkflowButton.click();
		}

		await page.waitForLoadState('networkidle');

		// Add TeamDynamix node (similar to previous test, can be extracted to helper)
		const addNodeButton = page
			.locator('[data-test-id="node-creator-plus-button"]')
			.or(page.locator('button[title*="Add"]'))
			.first();

		await addNodeButton.click();

		const searchInput = page
			.locator('[data-test-id="node-creator-search-input"]')
			.or(page.locator('input[placeholder*="Search"]'))
			.first();

		await searchInput.fill('TeamDynamix');
		await page.waitForTimeout(500);

		const tdxNode = page
			.locator('[data-test-id="node-creator-item"]')
			.filter({
				hasText: 'TeamDynamix',
			})
			.or(page.locator('.node-item').filter({ hasText: 'TeamDynamix' }));

		await tdxNode.first().click();
		await page.waitForLoadState('networkidle');

		// Click on the TeamDynamix node to open parameters
		const tdxNodeOnCanvas = page
			.locator('[data-test-id="canvas-node"]')
			.filter({
				hasText: 'TeamDynamix',
			})
			.or(page.locator('.node-wrapper').filter({ hasText: 'TeamDynamix' }));

		await tdxNodeOnCanvas.first().click();

		// Select Resource: Ticket
		const resourceDropdown = page
			.locator('select, [role="combobox"]')
			.filter({
				has: page.locator('text=/Resource/i'),
			})
			.first();

		if (await resourceDropdown.isVisible()) {
			await resourceDropdown.click();
			await page
				.locator('option:has-text("Ticket"), [role="option"]:has-text("Ticket")')
				.first()
				.click();
		}

		// Select Operation: Get Many
		await page.waitForTimeout(300);
		const operationDropdown = page
			.locator('select, [role="combobox"]')
			.filter({
				has: page.locator('text=/Operation/i'),
			})
			.first();

		if (await operationDropdown.isVisible()) {
			await operationDropdown.click();
			await page
				.locator('option:has-text("Get Many"), [role="option"]:has-text("Get Many")')
				.first()
				.click();
		}

		// Verify Search Mode field exists
		await page.waitForTimeout(300);
		const searchModeField = page.locator('text=/Search Mode/i, text=/search.*mode/i').first();
		await expect(searchModeField).toBeVisible({ timeout: 5000 });

		// Switch to Guided Fields mode
		const searchModeDropdown = page
			.locator('select, [role="combobox"]')
			.filter({
				has: page.locator('text=/Search Mode/i'),
			})
			.first();

		if (await searchModeDropdown.isVisible()) {
			await searchModeDropdown.click();
			const guidedOption = page
				.locator('option:has-text("Guided"), [role="option"]:has-text("Guided")')
				.first();
			await guidedOption.click();
		}

		// Verify search fields collection appears
		await page.waitForTimeout(500);

		// Check for some expected search fields (like StatusID, PriorityID, etc.)
		const searchFieldsSection = page.locator('text=/Search/i, text=/Filters/i').first();
		await expect(searchFieldsSection).toBeVisible({ timeout: 3000 });

		// Take screenshot for verification
		await page.screenshot({
			path: 'tests/e2e/screenshots/guided-search-configured.png',
			fullPage: true,
		});
	});
});
