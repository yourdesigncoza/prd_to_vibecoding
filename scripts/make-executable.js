#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'child_process';

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

// Files to make executable
const files = [
  path.join(rootDir, 'bin', 'tasks.js'),
  path.join(rootDir, 'scripts', 'create-tasks-template.js'),
  path.join(rootDir, 'scripts', 'add-scripts-to-package.js'),
  path.join(rootDir, 'scripts', 'migrate-tasks.js'),
  path.join(rootDir, 'scripts', 'make-executable.js'),
  path.join(rootDir, 'scripts', 'create-zip.js')
];

// Make files executable
for (const file of files) {
  try {
    execSync(`chmod +x ${file}`);
    console.log(`Made ${file} executable`);
  } catch (error) {
    console.error(`Error making ${file} executable: ${error.message}`);
  }
}
