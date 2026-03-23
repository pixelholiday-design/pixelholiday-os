#!/bin/bash
set -e

echo "Setting up PixelHoliday OS development environment..."

# Install dependencies
npm install

# Initialize database
npx prisma generate
npx prisma migrate deploy
npx prisma db seed

echo "Setup complete!"
