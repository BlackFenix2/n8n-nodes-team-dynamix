import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

export const e2eEnv = {
	n8nTestEmail: process.env.N8N_TEST_EMAIL ?? 'test@example.com',
	n8nTestPassword: process.env.N8N_TEST_PASSWORD ?? 'Test123!',
	n8nTestFirstName: process.env.N8N_TEST_FIRST_NAME ?? 'test',
	n8nTestLastName: process.env.N8N_TEST_LAST_NAME ?? 'user',
	tdxBaseUrl: process.env.TDX_BASE_URL ?? 'https://example.teamdynamix.com/TDWebApi/api',
	tdxUsername: process.env.TDX_USERNAME ?? 'test-user@example.com',
	tdxPassword: process.env.TDX_PASSWORD ?? 'test-password',
};
