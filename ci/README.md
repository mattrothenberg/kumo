# CI/CD Documentation

This document describes the CI/CD workflows for the Kumo monorepo.

## Pipeline Overview

The GitLab CI pipeline consists of the following stages:

| Stage | Purpose |
|-------|---------|
| `build` | Build packages |
| `checks` | Linting, typechecking, validation |
| `test` | Run tests |
| `review` | AI-powered code review |
| `beta-release` | Publish beta npm packages |
| `beta-preview` | Deploy Storybook previews |
| `mr-report` | Post consolidated MR comment |
| `production-release` | Deploy staging, manual production releases |

## Staging Deployments

On merge to main, both the documentation site and Storybook are automatically deployed to staging:

| Package | Worker | URL |
|---------|--------|-----|
| `packages/kumo-docs` | `kumo-docs-staging` | `staging.kumo-ui.com` |
| `packages/kumo` (Storybook) | `kumo-storybook-staging` | `storybook.staging.kumo-ui.com` |

### Kumo Docs Staging

```bash
# What happens on main merge:
wrangler deploy --env staging
```

- Deploys to `kumo-docs-staging` worker
- Serves `staging.kumo-ui.com`

## Storybook Deployments

Storybook is deployed to Cloudflare Workers with three environments:

| Environment | Worker | URL | Trigger |
|-------------|--------|-----|---------|
| **Preview** | `kumo-storybook` (version) | `<version-id>-kumo-storybook.design-engineering.workers.dev` | MR commits |
| **Staging** | `kumo-storybook-staging` | `storybook.staging.kumo-ui.com` | Merge to main |
| **Production** | `kumo-storybook` | `storybook.kumo-ui.com` | Manual |

### Preview Deployments

Preview deployments use Cloudflare Workers versions to avoid creating separate workers for each commit.

```bash
# What happens on MR commits:
wrangler versions upload --message "Preview for <sha>"
```

- Creates a version under the `kumo-storybook` worker
- Does NOT affect production traffic
- Preview URL uses first 8 chars of version ID: `<version-id>-kumo-storybook.design-engineering.workers.dev`

### Staging Deployments

Staging deploys automatically when MRs merge to main.

```bash
# What happens on main merge:
wrangler deploy --env staging
```

- Deploys to `kumo-storybook-staging` worker
- Serves `storybook.staging.kumo-ui.com`

### Production Deployments

Production deployments are manual.

```bash
# Local deployment:
cd packages/kumo
pnpm run build:storybook
wrangler deploy
```

- Deploys to `kumo-storybook` worker
- Serves `storybook.kumo-ui.com`

## NPM Package Releases

### Beta Releases

Beta releases publish on every MR with changes to `packages/kumo/`.

```bash
# What happens:
pnpm run publish:beta
```

- Versions package with commit SHA suffix (e.g., `1.0.0-beta.abc1234`)
- Publishes to npm with `beta` tag
- Writes report artifact for MR comment

### Production Releases

Production releases are manual and use changesets.

```bash
# Bump versions based on changesets:
pnpm version

# Publish to npm:
pnpm release:production
```

## MR Reporter System

The MR reporter system collects artifacts from multiple CI jobs and posts a consolidated comment.

### Architecture

```
┌─────────────────────┐     ┌─────────────────────────┐
│  publish-beta-run   │────▶│  ci/reports/npm-*.json  │
└─────────────────────┘     └───────────┬─────────────┘
                                        │
┌─────────────────────┐     ┌───────────▼─────────────┐     ┌─────────────────┐
│ deploy-storybook-   │────▶│ ci/reports/storybook-   │────▶│ post-mr-report  │────▶ MR Comment
│    preview-run      │     │       *.json            │     │      -run       │
└─────────────────────┘     └─────────────────────────┘     └─────────────────┘
```

### Report Artifacts

Each job writes a JSON artifact to `ci/reports/`:

```typescript
interface ReportItem {
  id: string;          // e.g., "npm-release", "storybook-preview"
  title: string;       // Section title in comment
  priority: number;    // Sort order (lower = first)
  content: string;     // Markdown content
  success: boolean;
}
```

Priority ranges:
- `10-19`: Release info (npm)
- `20-29`: Previews (storybook)

### Adding a New Reporter

1. Create reporter in `ci/reporters/<name>.ts`:
   ```typescript
   export const myReporter: Reporter = {
     id: 'my-reporter',
     name: 'My Reporter',
     async collect(context: CIContext): Promise<ReportItem | null> {
       // Return report item or null
     }
   };
   ```

2. Create write script in `ci/scripts/write-<name>-report.ts`

3. Export from `ci/reporters/index.ts`

4. Call write script from your CI job

5. Add job to `post-mr-report-run` needs (with `optional: true`)

## Directory Structure

```
ci/
├── README.md                    # This file
├── tsconfig.json                # TypeScript config for CI scripts
├── reporters/
│   ├── index.ts                 # Reporter registry and exports
│   ├── types.ts                 # Interfaces and utilities
│   ├── npm-release.ts           # NPM release reporter
│   └── storybook-preview.ts     # Storybook preview reporter
├── scripts/
│   ├── post-mr-report.ts        # Collects artifacts and posts MR comment
│   ├── write-npm-report.ts      # Writes NPM release artifact
│   ├── write-storybook-report.ts # Writes Storybook artifact
│   └── create-release-mr.ts     # Creates production release MRs
├── utils/
│   ├── gitlab-api.ts            # GitLab API utilities
│   └── mr-reporter.ts           # MR comment building and posting
└── versioning/
    ├── deploy-storybook-preview.sh  # Preview deployment script
    ├── publish-beta.sh              # Beta publish script
    └── release-production.sh        # Production release script
```

## Environment Variables

### CI Variables (from GitLab)

| Variable | Description |
|----------|-------------|
| `CI_COMMIT_SHA` | Full commit SHA |
| `CI_COMMIT_SHORT_SHA` | Short commit SHA (8 chars) |
| `CI_MERGE_REQUEST_IID` | MR number |
| `CI_PROJECT_ID` | GitLab project ID |

### Secrets (from Vault)

| Secret | Path | Used By |
|--------|------|---------|
| `NPM_TOKEN` | `gitlab/_ci_components/_dev/npm/kv_token` | Beta/production releases |
| `CLOUDFLARE_API_TOKEN` | `gitlab/cloudflare/fe/kumo/_dev/cloudflare_api_token/data` | Storybook deployments |
| `CLOUDFLARE_ACCOUNT_ID` | `gitlab/cloudflare/fe/kumo/_dev/cloudflare_account_id/data` | Storybook deployments |
| `GITLAB_API_TOKEN` | `gitlab/cloudflare/fe/kumo/_dev/kumo_preview_bot_v2/data` | MR comments |
| `CI_RELEASE_TOKEN` | `gitlab/cloudflare/fe/kumo/_dev/ci_release_token_v2/data` | Production releases |

## Local Testing

### Test Storybook Preview Deployment

```bash
export CLOUDFLARE_API_TOKEN="your-token"
export CLOUDFLARE_ACCOUNT_ID="61e3887ff0554f81e1e175d106c3926f"
pnpm run deploy:storybook-preview
```

### Test Staging Deployment

```bash
export CLOUDFLARE_API_TOKEN="your-token"
export CLOUDFLARE_ACCOUNT_ID="61e3887ff0554f81e1e175d106c3926f"
pnpm run deploy:storybook-staging
```

### Test MR Reporter (dry run)

```bash
# Create test artifacts
mkdir -p ci/reports
echo '{"id":"test","title":"Test","priority":10,"content":"Test content","success":true}' > ci/reports/test.json

# Run reporter (will skip posting without MR context)
pnpm tsx ci/scripts/post-mr-report.ts
```

## Wrangler Configuration

The Storybook worker configuration is in `packages/kumo/wrangler.jsonc`:

```jsonc
{
  "name": "kumo-storybook",
  "routes": [
    { "pattern": "storybook.kumo-ui.com/*", "zone_name": "kumo-ui.com" }
  ],
  "env": {
    "staging": {
      "routes": [
        { "pattern": "storybook.staging.kumo-ui.com/*", "zone_name": "kumo-ui.com" }
      ]
    }
  }
}
```

- **Default**: Production deployment to `storybook.kumo-ui.com`
- **`--env staging`**: Creates `kumo-storybook-staging` worker for `storybook.staging.kumo-ui.com`
- **`versions upload`**: Creates preview versions without affecting routes
