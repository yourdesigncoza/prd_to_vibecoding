#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// Path to the user's package.json
const packageJsonPath = path.join(process.cwd(), 'package.json');

// Check if the package.json file exists
if (!fs.existsSync(packageJsonPath)) {
  console.error(`Error: ${packageJsonPath} not found.`);
  console.error('Make sure you run this script from the root of your project.');
  process.exit(1);
}

// Read the package.json file
try {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Add the task management scripts
  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts['tasks-show'] = 'tasks show';
  packageJson.scripts['tasks-start'] = 'tasks start';
  packageJson.scripts['tasks-complete'] = 'tasks complete';
  packageJson.scripts['tasks-next'] = 'tasks next';
  packageJson.scripts['tasks-reset'] = 'tasks reset';
  
  // Write the updated package.json file
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
  
  console.log('Added task management scripts to package.json:');
  console.log('  "tasks-show": "tasks show"');
  console.log('  "tasks-start": "tasks start"');
  console.log('  "tasks-complete": "tasks complete"');
  console.log('  "tasks-next": "tasks next"');
  console.log('  "tasks-reset": "tasks reset"');
  console.log('\nYou can now run:');
  console.log('  npm run tasks-show');
  console.log('to see your tasks.');
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}
