---
"@cloudflare/kumo": minor
---

Add Storybook preview deployments and MR reporter system

- Storybook previews deploy to Cloudflare Workers on MR commits
- Staging deployment to `storybook.staging.kumo-ui.com` on merge to main
- Consolidated MR comments with beta npm version and preview URL
