/* eslint-disable @n8n/community-nodes/no-restricted-imports, @typescript-eslint/no-unused-vars */
import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
	await page.goto('chrome-error://chromewebdata/');
});
