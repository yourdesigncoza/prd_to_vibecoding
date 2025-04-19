#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';

// Create a readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Ask for the input file path
rl.question('Enter the path to your existing tasks file: ', (inputPath) => {
  // Ask for the output file path
  rl.question('Enter the path for the new tasks file (default: tasks.json): ', (outputPath) => {
    // Use default output path if none provided
    outputPath = outputPath || 'tasks.json';
    
    // Check if the input file exists
    if (!fs.existsSync(inputPath)) {
      console.error(`Error: ${inputPath} not found.`);
      rl.close();
      return;
    }
    
    // Check if the output file already exists
    if (fs.existsSync(outputPath)) {
      rl.question(`${outputPath} already exists. Overwrite? (y/n): `, (answer) => {
        if (answer.toLowerCase() !== 'y') {
          console.log('Migration cancelled.');
          rl.close();
          return;
        }
        
        // Proceed with migration
        migrateTasksFile(inputPath, outputPath);
        rl.close();
      });
    } else {
      // Proceed with migration
      migrateTasksFile(inputPath, outputPath);
      rl.close();
    }
  });
});

/**
 * Migrate a tasks file to the new format
 */
function migrateTasksFile(inputPath, outputPath) {
  try {
    // Read the input file
    const inputData = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
    
    // Create the output data structure
    const outputData = {
      tasks: [],
      metadata: {
        projectName: inputData.projectName || 'Migrated Project',
        totalTasks: 0,
        sourceFile: inputPath,
        generatedAt: new Date().toISOString()
      }
    };
    
    // Check if the input data has a tasks array
    if (Array.isArray(inputData.tasks)) {
      // Migrate each task
      for (const task of inputData.tasks) {
        const migratedTask = {
          id: task.id || 0,
          title: task.title || 'Untitled Task',
          description: task.description || '',
          status: task.status || 'pending',
          priority: task.priority || 'medium',
          dependencies: Array.isArray(task.dependencies) ? task.dependencies : [],
          details: task.details || '',
          testStrategy: task.testStrategy || ''
        };
        
        // Migrate subtasks if any
        if (Array.isArray(task.subtasks)) {
          migratedTask.subtasks = task.subtasks.map(subtask => ({
            id: subtask.id || 0,
            title: subtask.title || 'Untitled Subtask',
            description: subtask.description || '',
            status: subtask.status || 'pending',
            dependencies: Array.isArray(subtask.dependencies) ? subtask.dependencies : [],
            details: subtask.details || ''
          }));
        }
        
        outputData.tasks.push(migratedTask);
      }
    } else if (typeof inputData === 'object') {
      // Try to convert a flat object to the new format
      const migratedTask = {
        id: 1,
        title: inputData.title || 'Migrated Task',
        description: inputData.description || '',
        status: inputData.status || 'pending',
        priority: inputData.priority || 'medium',
        dependencies: [],
        details: inputData.details || '',
        testStrategy: ''
      };
      
      outputData.tasks.push(migratedTask);
    }
    
    // Update the total tasks count
    outputData.metadata.totalTasks = outputData.tasks.length;
    
    // Write the output file
    fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2), 'utf8');
    
    console.log(`Successfully migrated tasks from ${inputPath} to ${outputPath}.`);
    console.log(`Total tasks: ${outputData.metadata.totalTasks}`);
  } catch (error) {
    console.error(`Error migrating tasks: ${error.message}`);
  }
}
