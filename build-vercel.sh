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

echo "Build complete!"
