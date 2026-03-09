import { config } from '@n8n/node-cli/eslint';

export default [
	{
		ignores: [
			'**/tests/**',
			'playwright.config.ts',
			'playwright.config.js',
		],
	},
	...config,
];
