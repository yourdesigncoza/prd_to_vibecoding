#!/usr/bin/env node
import { program } from 'commander';
import { printTasksTable } from './tasks_table.js';
import { TaskManager } from './tasks_manager.js';
import { execSync } from 'child_process';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Helper function to format task details for display
 */
function displayTaskDetails(details: any): void {
  if (!details) {
    console.log('Task not found');
    return;
  }

  console.log('\n=== TASK DETAILS ===');
  console.log(`ID: ${details.id}`);
  console.log(`Title: ${details.title}`);
  console.log(`Description: ${details.description}`);
  console.log(`Status: ${details.status}`);

  if ('priority' in details) {
    console.log(`Priority: ${details.priority}`);
  }

  console.log(`Dependencies: ${details.dependencies.length ? details.dependencies.join(', ') : 'None'}`);

  if (details.parentTask) {
    console.log(`Parent Task: ${details.parentTask.id}. ${details.parentTask.title}`);
  }

  console.log('\n=== IMPLEMENTATION DETAILS ===');
  console.log(details.details);

  if ('testStrategy' in details) {
    console.log('\n=== TEST STRATEGY ===');
    console.log(details.testStrategy);
  }
}

/**
 * Helper function to analyze task details and set up environment
 */
async function setupTaskEnvironment(details: any): Promise<void> {
  console.log('\n=== SETTING UP ENVIRONMENT ===');

  // Extract file paths mentioned in the details
  const filePathRegex = /['"`]\/?(\w+\/)+\w+\.(\w+)['"`]/g;
  const matches = details.details.match(filePathRegex) || [];

  const filesToOpen: string[] = [];

  for (const match of matches) {
    // Clean up the path (remove quotes)
    const filePath = match.replace(/['"`]/g, '');

    // Check if the file exists
    const fullPath = path.join(process.cwd(), filePath);
    if (fs.existsSync(fullPath)) {
      filesToOpen.push(filePath);
      console.log(`Found file: ${filePath}`);
    }
  }

  // Open files if any were found
  if (filesToOpen.length > 0) {
    console.log('\nOpening relevant files...');
    try {
      // Use VS Code to open files if available
      execSync(`code ${filesToOpen.join(' ')}`);
    } catch (error) {
      console.log('Could not open files automatically. Please open them manually.');
    }
  } else {
    console.log('No specific files identified in the task details.');
  }

  // Check if there are any setup commands to run
  const setupCommandRegex = /```bash\s*\n([\s\S]*?)\n```/g;
  const commandMatches = [...details.details.matchAll(setupCommandRegex)];

  if (commandMatches.length > 0) {
    console.log('\n=== SUGGESTED COMMANDS ===');
    for (const match of commandMatches) {
      const commands = match[1].split('\n').filter((cmd: string) => cmd.trim() !== '');
      for (const cmd of commands) {
        console.log(`$ ${cmd}`);
      }
    }
    console.log('\nWould you like to run these commands? (y/n)');
    // Note: In a real implementation, you would prompt the user here
    // For now, we'll just display the commands
  }
}

export function createCLI(tasksPath?: string) {
  // Initialize task manager
  const taskManager = new TaskManager(tasksPath);

  // Show command
  program
    .command('show')
    .description('Display the current tasks table')
    .option('-s, --status <status>', 'Filter tasks by status (pending, in-progress, done)')
    .option('-p, --priority <priority>', 'Filter tasks by priority (high, medium, low)')
    .option('-c, --compact', 'Use compact view (hide description column)')
    .action((options) => {
      printTasksTable(taskManager, options.status, options.priority, options.compact);
    });

  // Start command
  program
    .command('start [id]')
    .description('Start working on the next pending task or a specific task')
    .action(async (id) => {
      let taskId, subtaskId;

      if (id) {
        // Start a specific task
        try {
          const parsed = taskManager.parseTaskId(id);
          taskId = parsed.taskId;
          subtaskId = parsed.subtaskId;
        } catch (error) {
          console.error(`Invalid task ID format: ${id}`);
          return;
        }
      } else {
        // Find the next pending task
        const nextTask = taskManager.findNextPendingTask();
        if (!nextTask) {
          console.log('No pending tasks found!');
          return;
        }
        taskId = nextTask.taskId;
        subtaskId = nextTask.subtaskId;
      }

      // Start the task
      const success = taskManager.startTask(taskId, subtaskId);
      if (!success) {
        console.error(`Failed to start task ${subtaskId ? `${taskId}.${subtaskId}` : taskId}`);
        return;
      }

      console.log(`Started task ${subtaskId ? `${taskId}.${subtaskId}` : taskId}`);

      // Display task details
      const details = taskManager.getTaskDetails(taskId, subtaskId);
      displayTaskDetails(details);

      // Set up environment
      await setupTaskEnvironment(details);
    });

  // Complete command
  program
    .command('complete <id>')
    .description('Mark a task as complete')
    .action((id) => {
      let taskId, subtaskId;

      try {
        const parsed = taskManager.parseTaskId(id);
        taskId = parsed.taskId;
        subtaskId = parsed.subtaskId;
      } catch (error) {
        console.error(`Invalid task ID format: ${id}`);
        return;
      }

      // Complete the task
      const success = taskManager.completeTask(taskId, subtaskId);
      if (!success) {
        console.error(`Failed to complete task ${subtaskId ? `${taskId}.${subtaskId}` : taskId}`);
        return;
      }

      console.log(`Completed task ${subtaskId ? `${taskId}.${subtaskId}` : taskId}`);

      // Show the next task
      const nextTask = taskManager.findNextPendingTask();
      if (nextTask) {
        console.log(`\nNext task: ${nextTask.subtaskId ? `${nextTask.taskId}.${nextTask.subtaskId}` : nextTask.taskId}`);
        console.log('Run `npm run tasks-start` to start working on it');
      } else {
        console.log('\nAll tasks completed! 🎉');
      }
    });

  // Next command
  program
    .command('next')
    .description('Show the next pending task')
    .action(() => {
      const nextTask = taskManager.findNextPendingTask();
      if (!nextTask) {
        console.log('No pending tasks found!');
        return;
      }

      console.log(`Next task: ${nextTask.subtaskId ? `${nextTask.taskId}.${nextTask.subtaskId}` : nextTask.taskId}`);

      // Display task details
      const details = taskManager.getTaskDetails(nextTask.taskId, nextTask.subtaskId);
      displayTaskDetails(details);
    });

  // Reset command
  program
    .command('reset')
    .description('Reset all tasks to pending status')
    .option('-y, --yes', 'Skip confirmation')
    .action((options) => {
      if (!options.yes) {
        console.log('WARNING: This will reset ALL tasks to pending status.');
        console.log('This action cannot be undone.');
        console.log('To proceed, run with the --yes flag: npm run tasks-reset -- --yes');
        return;
      }

      const success = taskManager.resetAllTasks();
      if (success) {
        console.log('All tasks have been reset to pending status.');
      } else {
        console.error('Failed to reset tasks.');
      }
    });

  return program;
}
