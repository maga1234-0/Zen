#!/bin/bash

echo "Building Hotel PMS for Vercel..."

# Build client
echo "Building client..."
cd client
npm run build
cd ..

# Build server
echo "Building server..."
cd server
npm run build
cd ..

# Build API for Vercel
echo "Building API for Vercel..."
cd api
npx tsc
cd ..

echo "Build complete!"
