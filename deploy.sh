#!/bin/bash
set -e

# ──────────────────────────────────────────────────
# CLOUDFLARE PAGES DEPLOY SCRIPT
# ──────────────────────────────────────────────────
# Prerequisites:
#   1. wrangler CLI: npm install -g @cloudflare/wrangler
#   2. Cloudflare account & Pages project setup
#   3. CLOUDFLARE_ACCOUNT_ID & CLOUDFLARE_API_TOKEN env vars set

echo "🚀 Deploying PixelHoliday OS to Cloudflare Pages..."

# Build Next.js app
echo "📦 Building Next.js app..."
npm run build

# Deploy with wrangler
echo "📡 Uploading to Cloudflare Pages..."
wrangler pages deploy out/ --project-name=$CLOUDFLARE_PROJECT_NAME

echo "✅ Deployment complete!"
echo "📍 Visit: https://${CLOUDFLARE_PROJECT_NAME}.pages.dev"
