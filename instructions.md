# Deploy: Netlify (Site + Functions)

This branch deploys the Vue SPA to Netlify and proxies API requests via a Netlify Function at /.netlify/functions/homeassistant.

- Branch: deploy/netlify
- Static site: Netlify (build output dist/)
- API proxy: netlify/functions/homeassistant.js

## Prerequisites
- Netlify account
- Repo hosted on GitHub (recommended) and connectable to Netlify
- Node 22 (the branch sets NODE_VERSION=22 in netlify.toml)
- Netlify CLI (optional for local dev): npm i -D netlify-cli

## Local development
1) Install deps: npm ci
2) Start Netlify dev (serves SPA and functions together):
   - npm run serve
3) The app will call /api/homeassistant/* which Netlify redirects to the function automatically.

## Deploy with Netlify (Git integration)
1) Push this branch to GitHub
2) In Netlify UI → Add new site → Import an existing project → select this repo and branch deploy/netlify
3) Build settings (from netlify.toml):
   - Build command: npm run build
   - Publish directory: dist
   - Functions directory: netlify/functions
   - Environment: NODE_VERSION=22
4) Deploy and test the site. All /api/homeassistant/* calls should work via the function.

## Alternative: CLI deploy (optional)
- netlify init (link the local repo folder to a Netlify site)
- netlify deploy --build --prod

## Notes
- The function strips the region query param before calling upstream.
- Default region is eu. The app appends ?region=eu automatically unless changed in the UI.
- You can attach a custom domain in Netlify and enable HTTPS.

