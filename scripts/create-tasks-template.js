#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Path to the sample tasks file
const sampleTasksPath = path.join(__dirname, '..', 'sample-tasks.json');

// Path to the output file
const outputPath = path.join(process.cwd(), 'tasks.json');

// Check if the output file already exists
if (fs.existsSync(outputPath)) {
  console.error(`Error: ${outputPath} already exists.`);
  console.error('To overwrite it, delete the file first.');
  process.exit(1);
}

// Read the sample tasks file
try {
  const sampleTasks = fs.readFileSync(sampleTasksPath, 'utf8');
  
  // Write the sample tasks to the output file
  fs.writeFileSync(outputPath, sampleTasks, 'utf8');
  
  console.log(`Created ${outputPath} with sample tasks.`);
  console.log('You can now run:');
  console.log('  tasks show');
  console.log('to see your tasks.');
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}
