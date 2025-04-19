#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'child_process';

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

// Build the project first
console.log('Building the project...');
try {
  execSync('npm run build', { cwd: rootDir, stdio: 'inherit' });
} catch (error) {
  console.error('Error building the project:', error.message);
  process.exit(1);
}

// Create a dist directory if it doesn't exist
const distDir = path.join(rootDir, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Create a zip file
console.log('Creating ZIP archive...');
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
  const version = packageJson.version;
  const zipFileName = `task-manager-cli-${version}.zip`;
  const zipFilePath = path.join(distDir, zipFileName);
  
  // Create the ZIP file
  execSync(`cd ${rootDir} && zip -r ${zipFilePath} . -x "node_modules/*" -x ".git/*" -x "dist/*" -x "*.zip"`, { stdio: 'inherit' });
  
  console.log(`Created ${zipFilePath}`);
} catch (error) {
  console.error('Error creating ZIP archive:', error.message);
  process.exit(1);
}
