# Azure DevOps Setup for NPM Publishing

This document provides step-by-step instructions for configuring Azure Pipelines to automatically publish this n8n community node package to the npm registry.

**Prerequisites:**

- Azure DevOps project with this repository
- npm account with publish permissions
- Admin access to Azure DevOps project settings

---

## Step 1: Create/Obtain npm Token

### Option A: Create New Token (Recommended)

1. Go to [npmjs.com](https://www.npmjs.com/)
2. Sign in to your npm account
3. Click your profile icon → **Access Tokens**
4. Click **Generate New Token**
5. Select token type: **Automation** (allows publishing without 2FA)
6. Copy the generated token (save it somewhere secure)
7. **Do NOT share or commit this token to the repository**

### Option B: Use Existing Token

If you already have an automation token:

- Locate it in your npm account settings
- Ensure it has publish permissions

---

## Step 2: Configure Azure DevOps npm Service Connection

### Create Service Connection

1. In **Azure DevOps**, go to **Project Settings** → **Service Connections**
2. Click **New Service Connection**
3. Select **npm Registry**
4. Choose **Token based authentication**
5. In the popup configuration:
   - **NPM registry URL:** `https://registry.npmjs.org/`
   - **Personal Access Token (PAT):** Paste your npm token from Step 1
   - **Service connection name:** `npm-publish` (or your preferred name)
   - Check **"Grant access permission to all pipelines"**
6. Click **Save**

### Verify Service Connection

1. After creation, click the service connection
2. Click **Edit** and test the connection
3. You should see: "Connection successful"

---

## Step 3: Configure Azure Pipelines

The `azure-pipelines.yml` file is already configured to use the service connection. Verify these settings:

### Check pipeline configuration:

```yaml
trigger:
  - main
  - master

pool:
  vmImage: ubuntu-latest

variables:
  nodeVersion: '22.x'

steps:
  # ... build and lint steps ...

  - task: npmAuthenticate@0
    inputs:
      workingFile: '.npmrc'
    displayName: 'Authenticate to npm registry'
    condition: and(succeeded(), or(eq(variables['Build.SourceBranch'], 'refs/heads/main'), eq(variables['Build.SourceBranch'], 'refs/heads/master')))

  - script: |
      npm publish
    displayName: 'Publish to npm registry'
    condition: and(succeeded(), or(eq(variables['Build.SourceBranch'], 'refs/heads/main'), eq(variables['Build.SourceBranch'], 'refs/heads/master')))
    env:
      NODE_AUTH_TOKEN: $(npm.token)
```

### Configure Service Connection Name (if different)

If your service connection is named differently than `npm-publish`, update the variables section in `azure-pipelines.yml`:

```yaml
variables:
  nodeVersion: '22.x'
  npmServiceConnection: 'your-service-connection-name' # Add this line
```

---

## Step 4: Verify npm Package Configuration

Ensure `package.json` has correct publishing settings:

```json
{
	"name": "n8n-nodes-team-dynamix",
	"publishConfig": {
		"access": "public",
		"registry": "https://registry.npmjs.org/"
	}
}
```

**Important:** `"access": "public"` is required for n8n community nodes (not scoped).

---

## Step 5: Test the Pipeline

### Trigger a test publish:

1. Make a small change to the code (e.g., update a comment)
2. Update the version in `package.json`:
   ```json
   "version": "0.1.2"
   ```
3. Commit and push to `main` or `master` branch
4. Watch the Azure Pipeline run:
   - Go to **Pipelines** → **Runs**
   - Click the latest run
   - Verify all steps pass (lint → build → **publish**)

### Verify publication:

```bash
npm view n8n-nodes-team-dynamix
```

Should show your latest version published.

---

## Step 6: Secure Your npm Token

### Best Practices:

- ✅ Use **Automation tokens** (no 2FA required)
- ✅ Store token **only** in Azure DevOps service connection
- ✅ **Never commit** the token to the repository
- ✅ **Never paste** the token in pipeline logs
- ✅ Rotate token periodically (every 6-12 months)
- ❌ DO NOT store in variables, secrets files, or environment variables visible in logs

### Rotating Tokens:

When rotating your npm token:

1. Create a new token in npm
2. Update the service connection in Azure DevOps with new token
3. Delete the old token from npm account
4. Test with a new pipeline run

---

## Step 7: Set Up Branch Protection (Recommended)

Prevent accidental publishes to npm:

1. Go to **Repos** → **Branches**
2. Select `main` or `master` branch
3. Click **⋯** → **Branch policies**
4. Enable:
   - ✅ **Require a minimum number of reviewers** (recommended: 1-2)
   - ✅ **Check for linked work items**
   - ✅ **Require successful status checks** (ensures build passes)
5. Save

This ensures every push to main requires code review before publishing to npm.

---

## Troubleshooting

### Pipeline fails with "401 Unauthorized"

**Cause:** npm token not configured correctly

**Solution:**

1. Verify service connection exists: **Project Settings** → **Service Connections**
2. Re-create service connection with correct token
3. Ensure token has publish permissions in npm

### Pipeline fails with "Package already published"

**Cause:** Version in `package.json` already exists on npm

**Solution:**

1. Increment version in `package.json`
2. Follow semver: `0.1.2` → `0.2.0` (new feature) or `0.1.3` (patch)
3. Commit and push

### Pipeline doesn't publish (succeeds but no publish step)

**Cause:** Push wasn't to `main` or `master` branch

**Solution:**

1. Verify you pushed to correct branch
2. Check pipeline condition: only `main`/`master` publish
3. For testing, temporarily modify branch name in `azure-pipelines.yml`:
   ```yaml
   condition: and(succeeded(), eq(variables['Build.SourceBranch'], 'refs/heads/develop'))
   ```

### npm publish succeeds but package missing from npm

**Cause:** Network delay or npm registry delay

**Solution:**

1. Wait 5-10 minutes (npm cache)
2. Run: `npm cache clean --force`
3. Run: `npm view n8n-nodes-team-dynamix@<version>`

---

## Continuous Integration Workflow

Once configured, the workflow is automatic:

```
Developer pushes to main
        ↓
Azure Pipeline triggers
        ↓
Install dependencies (npm ci)
        ↓
Run linter (npm run lint)
        ↓
Build project (npm run build)
        ↓
Authenticate to npm
        ↓
Publish to npm registry
        ↓
Available on npm immediately
```

**No manual steps required!** Every push to `main`/`master` with passing tests automatically publishes.

---

## Environment Preparation Checklist

Before your first publish:

- [ ] npm account created
- [ ] npm automation token generated
- [ ] Azure DevOps npm service connection created
- [ ] Service connection tested and working
- [ ] `package.json` has correct `publishConfig`
- [ ] Version in `package.json` is unique (not already on npm)
- [ ] `azure-pipelines.yml` configured (already done)
- [ ] Team members notified of publishing workflow
- [ ] Branch protection enabled on `main`/`master`
- [ ] Documentation reviewed by team

---

## Resources

- **npm Tokens:** https://docs.npmjs.com/creating-and-viewing-authentication-tokens
- **Azure DevOps npm Task:** https://docs.microsoft.com/en-us/azure/devops/pipelines/tasks/package/npm
- **Azure DevOps Service Connections:** https://docs.microsoft.com/en-us/azure/devops/pipelines/library/service-endpoints
- **Semantic Versioning:** https://semver.org/
- **N8N Publishing Requirements:** [N8N_COMMUNITY_NODE_REQUIREMENTS.md](./N8N_COMMUNITY_NODE_REQUIREMENTS.md)

---

## Support & Questions

For issues with:

- **npm tokens:** See npm docs or npm support
- **Azure DevOps:** Check Azure DevOps documentation or project admin
- **This package specifically:** See [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## Checklist: Ready to Publish?

Before merging to `main`:

- [ ] All code changes complete and tested
- [ ] `npm run lint` passes
- [ ] `npm run build` produces valid output
- [ ] `npm run dev` works locally with n8n
- [ ] Version bumped in `package.json`
- [ ] README.md updated with new features
- [ ] Code review completed
- [ ] Branch protection satisfied (if enabled)
- [ ] Ready for automatic npm publish!
