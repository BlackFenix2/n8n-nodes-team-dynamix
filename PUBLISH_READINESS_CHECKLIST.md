# Publish Readiness Checklist

**Last Verified:** March 1, 2026 | **Status:** ✅ READY FOR GITHUB ACTIONS PUBLISH

---

## Pre-Publishing Verification

### Build & Compile

- [x] TypeScript compilation successful
- [x] Source files compile to `dist/`
- [x] No TypeScript errors
- [x] Static assets copied correctly
- [x] `npm run build` passes

### Code Quality

- [x] `npm run lint` passes
- [x] ESLint rules enforced
- [x] Code standards followed

### Dependencies

- [x] No runtime dependencies (only devDependencies)
- [x] Peer dependency set: `n8n-workflow`

### Required Compiled Artifacts

- [x] `dist/credentials/TeamDynamixApi.credentials.js`
- [x] `dist/nodes/TeamDynamix/TeamDynamix.node.js`
- [x] `dist/nodes/TeamDynamix/KbArticleOperations.js`
- [x] `dist/nodes/TeamDynamix/TicketOperations.js`

---

## Package Metadata Verification

### package.json

- [x] Name uses `n8n-nodes-*` convention
- [x] Version follows semver
- [x] Includes keyword `n8n-community-node-package`
- [x] Includes `homepage`
- [x] Includes public GitHub `repository` URL
- [x] Includes `bugs.url`
- [x] Includes valid `n8n` object with compiled credential/node paths

### Publish Config

- [x] `publishConfig.access` is `public`
- [x] `publishConfig.registry` points to `https://registry.npmjs.org/`

---

## GitHub Actions Publishing

### Workflow Files

- [x] `.github/workflows/ci.yml` exists
- [x] `.github/workflows/publish.yml` exists
- [x] Publish workflow uses npm provenance
- [x] Publish workflow checks out the CI-validated commit

### Repository Configuration

- [ ] Repository secret `NPM_TOKEN` is configured (or npm trusted publishing is configured)
- [ ] Environment `npm` exists (if required by workflow)
- [ ] Branch protections match your release policy

---

## Release Steps (GitHub Actions)

1. [ ] Bump version in `package.json`
2. [ ] Commit and push to `main`
3. [ ] Confirm `CI` workflow passes
4. [ ] Confirm `Publish` workflow passes
5. [ ] Verify npm release:

```bash
npm view n8n-nodes-team-dynamix version
```

6. [ ] Submit/re-run n8n community review against the new npm version

---

## Dry Run (Local)

Use this before release if you want to verify package contents:

```bash
npm run build
npm pack --dry-run
```

---

## Troubleshooting

### Publish workflow failed

- [ ] Check `CI` succeeded first
- [ ] Check `NPM_TOKEN` permissions
- [ ] Ensure version is not already published
- [ ] Ensure publish job has required environment access

### n8n automatic review failed

- [ ] Verify `repository` points to a public GitHub repo in `package.json`
- [ ] Verify credential source exists: `credentials/TeamDynamixApi.credentials.ts`
- [ ] Verify compiled credential is published: `dist/credentials/TeamDynamixApi.credentials.js`

---

## References

- [README.md](./README.md)
- [CONTRIBUTING.md](./CONTRIBUTING.md)
- [N8N_COMMUNITY_NODE_REQUIREMENTS.md](./N8N_COMMUNITY_NODE_REQUIREMENTS.md)
- [GITHUB_ACTIONS_SETUP.md](./GITHUB_ACTIONS_SETUP.md)
- n8n Creator Portal: https://creators.n8n.io/nodes
