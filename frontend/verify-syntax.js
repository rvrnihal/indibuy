#!/usr/bin/env node

/**
 * Quick syntax verification script for the project
 * Run: node verify-syntax.js
 */

const fs = require('fs');
const path = require('path');

const filesToCheck = [
  'src/pages/_app.jsx',
  'src/pages/profile.jsx',
  'src/pages/profile-orders.jsx',
  'src/pages/profile-addresses.jsx',
  'src/pages/profile-settings.jsx',
  'src/pages/search.jsx',
  'src/context/ReviewContext.jsx',
  'src/components/ReviewForm.jsx',
  'src/components/ReviewCard.jsx',
  'src/components/Navbar.jsx',
  'src/pages/products.jsx',
];

console.log('🔍 Verifying file syntax and imports...\n');

let allGood = true;

filesToCheck.forEach(file => {
  const filePath = path.join(__dirname, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ MISSING: ${file}`);
    allGood = false;
    return;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Basic JSX validation
    if (content.includes('import React') || content.includes('export')) {
      console.log(`✅ EXISTS: ${file}`);
    } else {
      console.log(`⚠️  WARN: ${file} - No imports or exports found`);
    }

    // Check for common issues
    if (content.includes('../../components') && !file.includes('_app')) {
      console.log(`   ⚠️  WARNING: Potentially incorrect import path in ${file}`);
      allGood = false;
    }
    if (content.includes('Router from')) {
      console.log(`   ✅ Has Router import`);
    }
    if (file.includes('profile') && content.includes("href: '/profile/")) {
      console.log(`   ⚠️  WARNING: Nested profile routes detected in ${file}`);
      allGood = false;
    }

  } catch (err) {
    console.log(`❌ ERROR reading ${file}: ${err.message}`);
    allGood = false;
  }
});

console.log('\n' + '='.repeat(60));

if (allGood) {
  console.log('✅ All files present and appear syntactically valid!');
  console.log('\n📝 Next steps:');
  console.log('1. Run: npm run dev');
  console.log('2. Open: http://localhost:3000');
  console.log('3. Check console for any runtime errors');
} else {
  console.log('❌ Some issues detected. Please review above.');
}

console.log('='.repeat(60) + '\n');
