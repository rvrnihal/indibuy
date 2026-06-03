#!/usr/bin/env node
/**
 * Direct dev server launcher
 * Run: node run-dev.js
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const frontendDir = path.join(__dirname);

console.log('\n🚀 Starting IndiBuy Dev Server\n');
console.log('📁 Working directory:', frontendDir);

// Clean build cache
console.log('\n🧹 Cleaning build cache...');
const nextDir = path.join(frontendDir, '.next');
const vercelDir = path.join(frontendDir, '.vercel');

function removeDir(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
    console.log(`   ✓ Removed ${path.basename(dir)}`);
  }
}

removeDir(nextDir);
removeDir(vercelDir);

// Start dev server
console.log('\n📦 Starting Next.js dev server...');
console.log('🔗 Server will be available at: http://localhost:3000');
console.log('Press Ctrl+C to stop\n');

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const devServer = spawn(npm, ['run', 'dev'], {
  cwd: frontendDir,
  stdio: 'inherit',
  shell: true
});

devServer.on('error', (error) => {
  console.error('\n❌ Failed to start dev server:', error.message);
  process.exit(1);
});

devServer.on('close', (code) => {
  if (code !== 0) {
    console.error(`\n❌ Dev server exited with code ${code}`);
  }
  process.exit(code);
});

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log('\n\n🛑 Stopping dev server...');
  devServer.kill();
  process.exit(0);
});
