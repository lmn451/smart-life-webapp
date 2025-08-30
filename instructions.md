# Deploy: GitHub Pages + Cloudflare Worker

This branch deploys the Vue SPA to GitHub Pages and proxies API requests via a Cloudflare Worker at the same domain path.

- Branch: deploy/gh-pages-workers
- Static site: GitHub Pages (gh-pages branch)
- API proxy: Cloudflare Worker intercepting /api/homeassistant/*

## Prerequisites
- GitHub repository connected (this branch pushed)
- Cloudflare account with your domain added and nameservers set to Cloudflare
- A subdomain for the app, for example: app.example.com
- Node 22 locally for builds (optional for CI)

## Local development
- SPA only: npm run serve (runs Vue dev server without the API proxy)
- Worker only: npm run dev:worker (runs Cloudflare Worker locally on http://127.0.0.1:8787)
  - Test: http://127.0.0.1:8787/api/homeassistant/auth.do?region=eu (method and body as the app uses)

## Deploy the SPA to GitHub Pages
This branch contains .github/workflows/gh-pages.yml. It builds and publishes dist/ to gh-pages when this branch is updated.

Steps:
1) Push this branch to GitHub
2) In the GitHub repo settings → Pages, set Source: gh-pages branch (root)
3) Optional: set a custom domain (app.example.com). Do not enable Enforce HTTPS until DNS is set.

## Point your domain to GitHub Pages via Cloudflare
1) In Cloudflare DNS, create a CNAME record:
   - Name: app (for app.example.com)
   - Target: <your-github-username>.github.io
   - Proxy status: Proxied (orange cloud)
2) Wait for DNS to propagate; visiting https://app.example.com should serve your SPA (once gh-pages is published).

## Deploy the Cloudflare Worker proxy
The Worker in worker/src/index.ts proxies /api/homeassistant/* to Tuya upstream and strips the region query parameter upstream.

1) Edit worker/wrangler.toml and add a route:
   routes = [
     { pattern = "app.example.com/api/homeassistant/*", zone_name = "example.com" }
   ]
2) Authenticate and deploy:
   - npx wrangler login
   - npm run deploy:worker
3) Verify:
   - Open https://app.example.com
   - Interactions that call /api/homeassistant/* should work end-to-end

## Notes
- If you don’t use the same host for the SPA and Worker, you’ll need CORS headers. This Worker assumes same-origin, so no extra CORS is set for success paths.
- Default region is eu. The app appends ?region=eu (or your choice), which the Worker removes before calling upstream.
- The SPA build output is dist/ (created by vue-cli-service build).

