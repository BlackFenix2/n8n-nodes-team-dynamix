/* eslint-disable @n8n/community-nodes/no-restricted-imports, @n8n/community-nodes/no-restricted-globals */
import { Page, expect } from '@playwright/test';
import { e2eEnv } from './env';

const SIGNIN_EMAIL_LABEL = 'Email';
const SIGNIN_PASSWORD_LABEL = 'Password';
export const N8N_BASE_URL = process.env.N8N_E2E_BASE_URL ?? 'http://localhost:5679';
export const N8N_SIGNIN_URL = `${N8N_BASE_URL}/signin`;
export const N8N_SETUP_URL = `${N8N_BASE_URL}/setup`;

/**
 * Complete the initial n8n setup form if it's visible
 */
export async function completeInitialSetupIfVisible(page: Page): Promise<void> {
	const setupEmail = page.getByRole('textbox', { name: 'Email *' });
	if (!(await setupEmail.isVisible().catch(() => false))) {
		return;
	}

	await setupEmail.fill(e2eEnv.n8nTestEmail);
	await page.getByRole('textbox', { name: 'First Name *' }).fill(e2eEnv.n8nTestFirstName);
	await page.getByRole('textbox', { name: 'Last Name *' }).fill(e2eEnv.n8nTestLastName);
	await page.getByRole('textbox', { name: 'Password *' }).fill(e2eEnv.n8nTestPassword);
	const setupSubmitButton = page
		.locator('[data-test-id="form-submit-button"]')
		.or(page.getByRole('button', { name: /Next|Continue|Create|Submit/i }))
		.first();
	await setupSubmitButton.click();
	await page.waitForLoadState('networkidle');
}

export async function ensureSignedInOrSignUp(page: Page): Promise<void> {
	await signIn(page);
	await page.goto(`${N8N_BASE_URL}/`);
	await page.waitForLoadState('networkidle');
}

/**
 * Verify that user is logged in by checking for authenticated UI elements
 */
export async function verifyLoggedIn(page: Page): Promise<void> {
	await expect
		.poll(
			async () => {
				const currentUrl = page.url();
				if (currentUrl.includes('/signin') || currentUrl.includes('/setup')) {
					return false;
				}

				const cookies = await page.context().cookies();
				return cookies.some((cookie) => cookie.name === 'n8n-auth' && cookie.value.length > 0);
			},
			{ timeout: 30000, intervals: [500, 1000, 2000] },
		)
		.toBe(true);
}

/**
 * Sign in to n8n if the sign-in form is visible
 */
async function signInIfVisible(page: Page): Promise<void> {
	const emailInput = page.getByRole('textbox', { name: SIGNIN_EMAIL_LABEL });
	if (!(await emailInput.isVisible().catch(() => false))) {
		return;
	}

	await emailInput.fill(e2eEnv.n8nTestEmail);
	await page.getByRole('textbox', { name: SIGNIN_PASSWORD_LABEL }).fill(e2eEnv.n8nTestPassword);
	const signInButton = page
		.locator('[data-test-id="form-submit-button"]')
		.or(page.getByRole('button', { name: /Sign in|Log in/i }))
		.first();
	await signInButton.click();
	await page.waitForLoadState('networkidle');
}

/**
 * Sign in to n8n with test credentials
 */
export async function signIn(page: Page): Promise<void> {
	for (let attempt = 0; attempt < 3; attempt++) {
		await page.goto(N8N_SETUP_URL);
		await page.waitForLoadState('networkidle');
		await completeInitialSetupIfVisible(page);

		await page.goto(N8N_SIGNIN_URL);
		await page.waitForLoadState('networkidle');
		await signInIfVisible(page);

		await page.goto(`${N8N_BASE_URL}/`);
		await page.waitForLoadState('networkidle');

		const currentUrl = page.url();
		if (!currentUrl.includes('/signin') && !currentUrl.includes('/setup')) {
			return;
		}

		await page.waitForTimeout(1000);
	}
}

/**
 * Create a new workflow, adds a manual trigger and verify it's ready
 */
export async function createNewWorkflow(page: Page): Promise<void> {
	await page.getByRole('button', { name: 'Add new item' }).click();
	// Be more specific - target the dropdown option, not the main nav tab
	await page
		.locator('[data-test-id="universal-add"]')
		.getByRole('link', { name: 'Workflow' })
		.click();
	await page.locator('[data-test-id="canvas-plus-button"]').click();
	await page.getByText('Trigger manually').click();
}

/**
 * Add TeamDynamix node to workflow
 */
export async function addTeamDynamixNode(page: Page): Promise<void> {
	// Try multiple approaches to add a node

	// Approach 1: Look for canvas-level plus button or connection handle
	const canvasPlusButton = page
		.locator('[data-test-id="canvas-plus-button"]')
		.or(page.locator('[class*="canvas-handle-plus"]'))
		.or(page.locator('[class*="plus"]'))
		.filter({ hasText: '' })
		.or(page.locator('button[class*="plus"]'));

	if (
		await canvasPlusButton
			.first()
			.isVisible({ timeout: 2000 })
			.catch(() => false)
	) {
		await canvasPlusButton.first().click();
	} else {
		// Approach 2: Click on the manual trigger node and look for connection handles
		const triggerNode = page.locator('[class*="group"]').first();
		await triggerNode.hover();
		await page.waitForTimeout(500);

		const connectionHandle = page
			.locator('[class*="handle"]')
			.or(page.locator('[class*="plus"]'))
			.or(page.locator('button[class*="node-creator"]'))
			.first();

		if (await connectionHandle.isVisible({ timeout: 2000 }).catch(() => false)) {
			await connectionHandle.click();
		} else {
			// Approach 3: Try keyboard shortcut or right-click context menu
			await triggerNode.click({ button: 'right' });
			await page.waitForTimeout(500);

			const addNodeOption = page.getByText('Add node').or(page.getByText('Add step'));
			if (await addNodeOption.isVisible({ timeout: 2000 }).catch(() => false)) {
				await addNodeOption.click();
			}
		}
	}

	await page.waitForTimeout(500);

	// Search for and select TeamDynamix node
	const searchInput = page
		.locator('[data-test-id="node-creator-search-input"]')
		.or(page.locator('input[placeholder*="Search"]'))
		.or(page.locator('input[placeholder*="search"]'))
		.first();

	if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
		await searchInput.fill('TeamDynamix');
		await page.waitForTimeout(500);

		// More robust node selection
		const tdxNode = page
			.locator('[data-test-id="node-creator-item"]')
			.filter({ hasText: 'Team Dynamix' })
			.or(page.locator('.node-item').filter({ hasText: 'Team Dynamix' }))
			.or(page.locator('*').filter({ hasText: /Team.*Dynamix/i }))
			.first();

		if (await tdxNode.isVisible({ timeout: 2000 }).catch(() => false)) {
			await tdxNode.click();
		} else {
			// Fallback: click any visible element containing "Team Dynamix"
			const allElements = await page.locator('*:has-text("Team Dynamix")').all();
			for (const element of allElements) {
				if (await element.isVisible()) {
					await element.click();
					break;
				}
			}
		}
	}

	await page.waitForLoadState('networkidle');
}

/**
 * Click on TeamDynamix node to open its parameters
 */
export async function openTeamDynamixNodeParams(page: Page): Promise<void> {
	const tdxNodeOnCanvas = page
		.locator('[data-test-id="canvas-node"]')
		.filter({ hasText: 'TeamDynamix' })
		.or(page.locator('.node-wrapper').filter({ hasText: 'TeamDynamix' }))
		.or(page.locator('*').filter({ hasText: /Team.*Dynamix/i }));

	await expect(tdxNodeOnCanvas.first()).toBeVisible({ timeout: 5000 });
	await tdxNodeOnCanvas.first().click();
}

/**
 * Select a resource type (Ticket, KB Article, etc.)
 */
export async function selectResource(page: Page, resourceName: string): Promise<void> {
	const resourceDropdown = page
		.locator('select, [role="combobox"]')
		.filter({ has: page.locator('text=/Resource/i') })
		.first();

	if (await resourceDropdown.isVisible({ timeout: 2000 }).catch(() => false)) {
		await resourceDropdown.click();
		await page
			.locator(`option:has-text("${resourceName}"), [role="option"]:has-text("${resourceName}")`)
			.first()
			.click();
	}
}

/**
 * Select an operation (Get Many, Create, etc.)
 */
export async function selectOperation(page: Page, operationName: string): Promise<void> {
	await page.waitForTimeout(300);
	const operationDropdown = page
		.locator('select, [role="combobox"]')
		.filter({ has: page.locator('text=/Operation/i') })
		.first();

	if (await operationDropdown.isVisible({ timeout: 2000 }).catch(() => false)) {
		await operationDropdown.click();
		await page
			.locator(`option:has-text("${operationName}"), [role="option"]:has-text("${operationName}")`)
			.first()
			.click();
	}
}

/**
 * Configure guided search mode for Get Many operations
 */
export async function configureGuidedSearch(page: Page): Promise<void> {
	await page.waitForTimeout(300);
	const searchModeField = page.locator('text=/Search Mode/i, text=/search.*mode/i').first();
	await expect(searchModeField).toBeVisible({ timeout: 5000 });

	const searchModeDropdown = page
		.locator('select, [role="combobox"]')
		.filter({ has: page.locator('text=/Search Mode/i') })
		.first();

	if (await searchModeDropdown.isVisible({ timeout: 2000 }).catch(() => false)) {
		await searchModeDropdown.click();
		const guidedOption = page
			.locator('option:has-text("Guided"), [role="option"]:has-text("Guided")')
			.first();
		await guidedOption.click();
	}

	// Verify search fields appear
	await page.waitForTimeout(500);
	const searchFieldsSection = page.locator('text=/Search/i, text=/Filters/i').first();
	await expect(searchFieldsSection).toBeVisible({ timeout: 3000 });
}

/**
 * Take a screenshot for verification
 */
export async function takeScreenshot(page: Page, filename: string): Promise<void> {
	await page.screenshot({
		path: `tests/e2e/screenshots/${filename}.png`,
		fullPage: true,
	});
}
