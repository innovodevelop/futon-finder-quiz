#!/bin/bash

# Build script for V2 React-Shopify integration
# Run with: ./build-v2.sh or bash build-v2.sh

echo "🚀 Building V2 React assets for Shopify..."
echo ""

# Step 1: Build with V2 config
echo "📦 Building React components..."
npx vite build --config vite.config.v2.ts

if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
else
    echo "❌ Build failed!"
    exit 1
fi

# Step 2: Copy assets to Shopify folders
echo ""
echo "📁 Copying assets to Shopify folders..."

# Ensure shopify/assets directory exists
mkdir -p shopify/assets

# Copy built assets if they exist
if [ -d "dist/v2/shopify-assets" ]; then
    cp dist/v2/shopify-assets/*.js shopify/assets/ 2>/dev/null && echo "   ✓ Copied JS files"
    cp dist/v2/shopify-assets/*.css shopify/assets/ 2>/dev/null && echo "   ✓ Copied CSS files"
else
    echo "   ℹ️  Assets directory not found, skipping copy step"
fi

# Step 3: Copy sections
echo ""
echo "📑 Copying Shopify sections..."
mkdir -p shopify/sections

if [ -f "versions/v2-integrated/shopify-integrated/sections/futon-quiz-v2.liquid" ]; then
    cp versions/v2-integrated/shopify-integrated/sections/futon-quiz-v2.liquid shopify/sections/
    echo "   ✓ Copied futon-quiz-v2.liquid"
fi

if [ -f "versions/v2-integrated/shopify-integrated/sections/futon-quiz-universal.liquid" ]; then
    cp versions/v2-integrated/shopify-integrated/sections/futon-quiz-universal.liquid shopify/sections/
    echo "   ✓ Copied futon-quiz-universal.liquid"
fi

echo ""
echo "🎉 V2 build complete!"
echo ""
echo "Next steps:"
echo "1. Upload files from shopify/assets/ to your Shopify theme"
echo "2. Upload files from shopify/sections/ to your Shopify theme"
echo "3. Add the quiz section to your theme in the Shopify editor"