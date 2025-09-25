#!/usr/bin/env node

/**
 * Build script for V2 React-Shopify integration
 * Run with: node build-v2.js
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

async function buildV2() {
  console.log('🚀 Building V2 React assets for Shopify...\n');

  try {
    // Step 1: Build with V2 config
    console.log('📦 Building React components...');
    const { stdout, stderr } = await execAsync('npx vite build --config vite.config.v2.ts');
    
    if (stderr) {
      console.warn('⚠️  Build warnings:', stderr);
    }
    
    console.log('✅ Build completed successfully!');
    
    // Step 2: Copy assets to Shopify folders
    console.log('\n📁 Copying assets to Shopify folders...');
    
    // Ensure shopify/assets directory exists
    await fs.mkdir('shopify/assets', { recursive: true });
    
    // Copy built assets
    const sourceDir = 'dist/v2/shopify-assets';
    const targetDir = 'shopify/assets';
    
    try {
      const files = await fs.readdir(sourceDir);
      for (const file of files) {
        if (file.endsWith('.js') || file.endsWith('.css')) {
          await fs.copyFile(
            path.join(sourceDir, file),
            path.join(targetDir, file)
          );
          console.log(`   ✓ Copied ${file}`);
        }
      }
    } catch (error) {
      console.log('   ℹ️  Assets directory not found, skipping copy step');
    }
    
    // Step 3: Copy sections
    console.log('\n📑 Copying Shopify sections...');
    await fs.mkdir('shopify/sections', { recursive: true });
    
    try {
      await fs.copyFile(
        'versions/v2-integrated/shopify-integrated/sections/futon-quiz-v2.liquid',
        'shopify/sections/futon-quiz-v2.liquid'
      );
      console.log('   ✓ Copied futon-quiz-v2.liquid');
      
      await fs.copyFile(
        'versions/v2-integrated/shopify-integrated/sections/futon-quiz-universal.liquid', 
        'shopify/sections/futon-quiz-universal.liquid'
      );
      console.log('   ✓ Copied futon-quiz-universal.liquid');
    } catch (error) {
      console.log('   ℹ️  Section files not found, skipping copy step');
    }
    
    console.log('\n🎉 V2 build complete!');
    console.log('\nNext steps:');
    console.log('1. Upload files from shopify/assets/ to your Shopify theme');
    console.log('2. Upload files from shopify/sections/ to your Shopify theme');
    console.log('3. Add the quiz section to your theme in the Shopify editor');
    
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    
    if (error.message.includes('vite.config.v2.ts')) {
      console.log('\n💡 Tip: Make sure vite.config.v2.ts exists in your project root');
    }
    
    if (error.message.includes('src/shopify/index-v2.tsx')) {
      console.log('💡 Tip: Make sure src/shopify/index-v2.tsx exists');
    }
    
    process.exit(1);
  }
}

buildV2();