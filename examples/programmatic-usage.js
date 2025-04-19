import { TaskManager } from '../dist/tasks_manager.js';
import { printTasksTable } from '../dist/tasks_table.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create a task manager with the sample tasks file
const tasksPath = path.join(__dirname, '..', 'sample-tasks.json');
const taskManager = new TaskManager(tasksPath);

// Example 1: Get all tasks
console.log('Example 1: Get all tasks');
const tasks = taskManager.getAllTasks();
console.log(`Found ${tasks.length} tasks`);
console.log();

// Example 2: Find the next pending task
console.log('Example 2: Find the next pending task');
const nextTask = taskManager.findNextPendingTask();
if (nextTask) {
  console.log(`Next task: ${nextTask.subtaskId ? `${nextTask.taskId}.${nextTask.subtaskId}` : nextTask.taskId}`);
  
  // Get task details
  const details = taskManager.getTaskDetails(nextTask.taskId, nextTask.subtaskId);
  console.log(`Title: ${details.title}`);
  console.log(`Status: ${details.status}`);
} else {
  console.log('No pending tasks found');
}
console.log();

// Example 3: Start a task
console.log('Example 3: Start a task');
const startResult = taskManager.startTask(1, 1);
console.log(`Started task 1.1: ${startResult ? 'Success' : 'Failed'}`);
console.log();

// Example 4: Print tasks table
console.log('Example 4: Print tasks table');
printTasksTable(taskManager);
console.log();

// Example 5: Complete a task
console.log('Example 5: Complete a task');
const completeResult = taskManager.completeTask(1, 1);
console.log(`Completed task 1.1: ${completeResult ? 'Success' : 'Failed'}`);
console.log();

// Example 6: Print tasks table again to see the changes
console.log('Example 6: Print tasks table again');
printTasksTable(taskManager);
console.log();

// Example 7: Reset all tasks
console.log('Example 7: Reset all tasks');
const resetResult = taskManager.resetAllTasks();
console.log(`Reset all tasks: ${resetResult ? 'Success' : 'Failed'}`);
console.log();

// Example 8: Print tasks table after reset
console.log('Example 8: Print tasks table after reset');
printTasksTable(taskManager);
