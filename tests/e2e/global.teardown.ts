import { execSync } from 'node:child_process';
import type { FullConfig } from '@playwright/test';

export default async function globalTeardown(_config: FullConfig): Promise<void> {
	// Stop container but preserve the volume to maintain user accounts and auth state
	execSync('docker compose down n8n-e2e -v', { stdio: 'inherit' });
}
