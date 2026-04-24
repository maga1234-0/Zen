#!/bin/bash

echo "Building Hotel PMS for Vercel..."

# Install root dependencies
echo "Installing root dependencies..."
npm install

# Build client
echo "Building client..."
cd client
npm install
npm run build
cd ..

# Build server
echo "Building server..."
cd server
npm install
npm run build
cd ..

echo "Build complete!"
