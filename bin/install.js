#!/usr/bin/env node
const { execSync } = require('child_process');
const path = require('path');

const script = path.join(__dirname, '..', 'install.sh');
console.log('🤖 Installing Claude Commit...');
try {
  execSync(`bash "${script}"`, { stdio: 'inherit' });
} catch (e) {
  process.exit(1);
}
