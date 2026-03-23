#!/bin/bash
set -e

echo "Initializing Cloudflare Pages environment..."

# Check for required env vars
if [ -z "$CLOUDFLARE_ACCOUNT_ID" ]; then
  echo "Error: CLOUDFLARE_ACCOUNT_ID not set"
  exit 1
fi

if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
  echo "Error: CLOUDFLARE_API_TOKEN not set"
  exit 1
fi

echo "Cloudflare environment initialized"
