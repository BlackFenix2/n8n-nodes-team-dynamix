# Publish Readiness Checklist

**Last Verified:** February 27, 2026 | **Status:** ✅ READY TO PUBLISH (after Azure setup)

---

## Pre-Publishing Verification (Automated)

### Build & Compile ✅

- [x] TypeScript compilation successful
- [x] All source files compile to `dist/` directory
- [x] No TypeScript errors
- [x] Static assets (icons, files) copied correctly
- [x] Build command: `npm run build` → ✅ **PASS** (0 errors, 0 warnings)

### Code Quality ✅

- [x] Linting passes all checks
- [x] ESLint rules enforced
- [x] Code standards followed
- [x] Lint command: `npm run lint` → ✅ **PASS** (exit code 0)

### Dependencies ✅

- [x] No runtime dependencies (only devDependencies)
- [x] Peer dependency correctly specified: `n8n-workflow`
- [x] All dependencies have been installed: `npm ci` ✅

### Built Artifacts ✅

```
dist/
├── credentials/
│   └── TeamDynamixApi.credentials.js ✅
├── nodes/
│   └── TeamDynamix/
│       ├── TeamDynamix.node.js ✅
│       ├── KbArticleOperations.js ✅
│       └── TicketOperations.js ✅
└── icons/
    └── TeamDynamix.svg ✅
```

All required compiled files present and ready.

---

## Package Configuration ✅

### package.json Verification ✅

- [x] **Name:** `n8n-nodes-team-dynamix` ✅ (correct format: `n8n-nodes-*`)
- [x] **Version:** `0.1.1` ✅ (follows semantic versioning)
- [x] **License:** MIT ✅
- [x] **Keywords:** Includes `n8n-community-node-package` ✅
- [x] **Repository:** Configured with Azure DevOps URL ✅ (placeholder: update before publish)
- [x] **Homepage:** Configured with Azure DevOps URL ✅ (placeholder: update before publish)

### N8N Configuration ✅

```json
"n8n": {
  "n8nNodesApiVersion": 1,
  "strict": true,
  "credentials": ["dist/credentials/TeamDynamixApi.credentials.js"],
  "nodes": ["dist/nodes/TeamDynamix/TeamDynamix.node.js"]
}
```

- [x] Correct API version (1) ✅
- [x] Strict mode enabled ✅
- [x] Credential paths compile correctly ✅
- [x] Node paths compile correctly ✅

### Publish Configuration ✅

```json
"publishConfig": {
  "access": "public",
  "registry": "https://registry.npmjs.org/"
}
```

- [x] Set to public access ✅ (required for n8n community nodes)
- [x] Points to npm public registry ✅

---

## Documentation ✅

### Essential Files Present ✅

- [x] [README.md](./README.md) - Package overview & installation
- [x] [CONTRIBUTING.md](./CONTRIBUTING.md) - Development guidelines
- [x] [N8N_COMMUNITY_NODE_REQUIREMENTS.md](./N8N_COMMUNITY_NODE_REQUIREMENTS.md) - Standards & requirements
- [x] [LICENSE.md](./LICENSE.md) - MIT license
- [x] [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) - Community guidelines

### Documentation Quality ✅

- [x] README covers installation
- [x] Credentials documented
- [x] Operations documented
- [x] Usage examples provided
- [x] Compatibility noted (Node.js 22+)

---

## Azure DevOps & Publishing Pipeline ⚠️

### Pipeline Configuration ✅

- [x] [azure-pipelines.yml](./azure-pipelines.yml) configured ✅
- [x] Triggers on `main` and `master` branches ✅
- [x] Runs linting and build ✅
- [x] Includes npm authentication task ✅
- [x] Includes npm publish step ✅

### Azure DevOps Setup ⚠️ **ACTION REQUIRED**

- [ ] npm automation token created (in your npm account)
- [ ] Azure DevOps service connection configured (`npm-publish`)
- [ ] Service connection tested and working
- [ ] Token has publish permissions

**See:** [AZURE_DEVOPS_SETUP.md](./AZURE_DEVOPS_SETUP.md) for step-by-step instructions

---

## Pre-Publish Checklist

Before pushing to main for first publish:

### Final Verification Steps

1. [ ] Update `package.json` repository URL:
   - Change `YOUR_ORG` and `YOUR_PROJECT` to actual values
2. [ ] Update `package.json` homepage URL:
   - Ensure it matches your actual repository URL

3. [ ] Create npm automation token:
   - Go to https://www.npmjs.com/settings/tokens
   - Generate "Automation" token
   - Save it securely

4. [ ] Configure Azure DevOps service connection:
   - Follow [AZURE_DEVOPS_SETUP.md](./AZURE_DEVOPS_SETUP.md)
   - Create npm registry service connection
   - Paste your npm token

5. [ ] Test pipeline:
   - Make a small test commit to `main` or `master`
   - Watch Azure Pipeline run
   - Verify all steps pass (lint → build → publish)

6. [ ] Verify publication:
   ```bash
   npm view n8n-nodes-team-dynamix
   ```
   Should show your published version on npm

---

## Dry-Run / Testing Before Publish

### Option 1: npm publish --dry-run ✅ **RECOMMENDED**

This simulates publishing without actually uploading to npm:

```bash
# Authenticate to npm first
npm adduser  # or use Azure DevOps credentials

# Test publish (no changes to registry)
npm publish --dry-run
```

Output will show exactly what would be published:

- Files included
- Metadata
- Tarball size
- Registry destination

### Option 2: Local Testing in N8N ✅

Test the node locally before publishing:

```bash
npm run dev
```

This starts n8n with your node loaded for manual testing.

### Option 3: GitHub Packages (Optional)

Test publish to GitHub Packages instead of npm:

- Configure `.npmrc` with GitHub token
- Publish to `npm install @owner/package` from GitHub
- Delete package afterward

---

## N8N CLI Information

### Available Commands

**Build:**

```bash
npm run build           # Compiles TypeScript to dist/
```

**Development:**

```bash
npm run dev            # Start with hot reload
npm run dev:verbose    # With debugging
```

**Quality:**

```bash
npm run lint           # Check code quality
npm run lint:fix       # Auto-fix issues
```

**Publishing:**

```bash
npm run release        # Uses release-it to publish
npx n8n-node release   # Equivalent command
npm publish            # Direct npm publish
npm publish --dry-run  # Test publish (RECOMMENDED)
```

### N8N CLI Limitations

**n8n-node release** command:

- ✅ Handles versioning and tagging
- ✅ Publishes to npm
- ❌ No built-in dry-run option

**Recommendation:** Use `npm publish --dry-run` instead for testing

---

## Publish Flow Diagram

```
Developer makes changes
        ↓
npm run lint   (verify code quality)
        ↓
npm run build  (compile to dist/)
        ↓
npm publish --dry-run  (test without publishing)
        ↓
(If satisfied with dry-run results)
        ↓
git commit & push to main/master
        ↓
Azure Pipeline auto-triggers
  - npm ci (install)
  - npm run lint (check)
  - npm run build (compile)
  - npm authenticate (using service connection)
  - npm publish (automatically publishes to npm)
        ↓
Package available on npm immediately
  (npm view n8n-nodes-team-dynamix)
```

---

## Troubleshooting

### Pipeline fails to publish

**Check:**

- [ ] Service connection created in Azure DevOps
- [ ] npm token is valid and has publish permissions
- [ ] Branch is `main` or `master`
- [ ] All lint/build checks pass

See: [AZURE_DEVOPS_SETUP.md](./AZURE_DEVOPS_SETUP.md#troubleshooting)

### Package not appearing on npm after publish

- [ ] Wait 5-10 minutes (npm cache)
- [ ] Clear npm cache: `npm cache clean --force`
- [ ] Verify with: `npm view n8n-nodes-team-dynamix@<version>`

### Version conflict

- [ ] Cannot publish same version twice
- [ ] Always increment version in `package.json`
- [ ] Follow semantic versioning (MAJOR.MINOR.PATCH)

---

## Next Steps

1. **Update metadata:**
   - [ ] Update repository URL in `package.json`
   - [ ] Update homepage in `package.json`

2. **Azure DevOps setup:**
   - [ ] Follow [AZURE_DEVOPS_SETUP.md](./AZURE_DEVOPS_SETUP.md)
   - [ ] Create npm token
   - [ ] Configure service connection

3. **Test dry-run:**

   ```bash
   npm publish --dry-run
   ```

4. **Initial publish:**
   - [ ] Push to `main` or `master` branch
   - [ ] Watch Azure Pipeline run
   - [ ] Verify package on npm

5. **Submit to N8N:**
   - [ ] Visit https://creators.n8n.io/nodes
   - [ ] Submit `n8n-nodes-team-dynamix`
   - [ ] Provide npm link and documentation

---

## Important Dates & Reminders

- **Current Date:** February 27, 2026
- **Critical Deadline:** May 1st, 2026
  - All n8n community nodes must use GitHub Actions OR Azure Pipelines with npm provenance
  - Current setup meets requirements (Azure Pipelines configured)

---

## References

- **Build Details:** [N8N Build Process](https://docs.n8n.io/integrations/creating-nodes/build/)
- **Publishing:** [N8N Publishing Guide](./N8N_COMMUNITY_NODE_REQUIREMENTS.md#publishing-requirements)
- **Azure Setup:** [AZURE_DEVOPS_SETUP.md](./AZURE_DEVOPS_SETUP.md)
- **Contributing:** [CONTRIBUTING.md](./CONTRIBUTING.md)
- **N8N Creator Portal:** https://creators.n8n.io/nodes

---

## Sign-Off

**Repository Status:** ✅ **CODE READY TO PUBLISH**

**Remaining Actions:**

1. Update package.json URLs
2. Configure Azure DevOps service connection
3. Test with `npm publish --dry-run`
4. Push to main branch for automatic publishing
