# Task Manager CLI

A command-line tool for managing project tasks with dependencies and subtasks.

## Acknowledgements

This project is heavily influenced by [claude-task-master](https://github.com/eyaltoledano/claude-task-master) by Eyal Toledano.

## Features

- Display tasks in a hierarchical table
- Track task status (pending, in-progress, done)
- Respect dependencies between tasks
- Handle parent-child relationships between main tasks and subtasks
- Automatically adapt to terminal width
- Provide detailed information about tasks
- Suggest relevant files and commands for each task

## Installation

### Local Installation

```bash
# Clone the repository
git clone https://github.com/yourdesigncoza/prd_to_vibecoding.git
cd prd_to_vibecoding

# Install dependencies
npm install

# Fix TypeScript errors (if any)
# You may need to update import paths in src/tasks_table.ts to include .js extensions
# and add explicit type annotations to filter callbacks

# Build the project
npm run build

# Make scripts executable
npm run make-executable

# Link the package globally
npm link
```

### As a Dependency

**Note**: This package is not yet published to npm. Use the local installation method above.

## Usage

### Initial Setup

After installation, you need to create a tasks.json file before you can use the task manager:

```bash
# Create a sample tasks.json file
tasks-init
```

This will create a `tasks.json` file in your project root with sample tasks.

### Configuration

If you're using the task manager in a different project, first initialize a Node.js project if you haven't already:

```bash
npm init -y
```

Then create a tasks.json file using the tasks-init command as shown above.

You can also add the task management scripts to your package.json:

```bash
tasks-add-scripts
```

This will add task management scripts to your package.json. Note that the actual scripts in the repository use `node bin/tasks.js` instead of just `tasks`:

```json
"scripts": {
  "tasks-show": "node bin/tasks.js show",
  "tasks-start": "node bin/tasks.js start",
  "tasks-complete": "node bin/tasks.js complete",
  "tasks-next": "node bin/tasks.js next",
  "tasks-reset": "node bin/tasks.js reset"
}
```

If you have an existing tasks file in a different format, you can migrate it to the new format:

```bash
tasks-migrate
```

This will prompt you for the path to your existing tasks file and the path for the new tasks file.

Alternatively, you can manually create a `tasks.json` file in your project root with the following structure:

```json
{
  "tasks": [
    {
      "id": 1,
      "title": "Task 1",
      "description": "Description of Task 1",
      "status": "pending",
      "dependencies": [],
      "priority": "high",
      "details": "Implementation details for Task 1",
      "testStrategy": "Test strategy for Task 1",
      "subtasks": [
        {
          "id": 1,
          "title": "Subtask 1.1",
          "description": "Description of Subtask 1.1",
          "status": "pending",
          "dependencies": [],
          "details": "Implementation details for Subtask 1.1"
        },
        {
          "id": 2,
          "title": "Subtask 1.2",
          "description": "Description of Subtask 1.2",
          "status": "pending",
          "dependencies": [1],
          "details": "Implementation details for Subtask 1.2"
        }
      ]
    }
  ],
  "metadata": {
    "projectName": "Your Project Name",
    "totalTasks": 1,
    "sourceFile": "",
    "generatedAt": "2023-10-05"
  }
}
```

### Commands

#### Show Tasks

```bash
# Show all tasks
tasks show

# Show tasks with compact view (hide description column)
tasks show --compact

# Filter tasks by status
tasks show --status pending
tasks show --status in-progress
tasks show --status done

# Filter tasks by priority
tasks show --priority high
tasks show --priority medium
tasks show --priority low

# Combine filters
tasks show --status pending --priority high --compact
```

#### Start a Task

```bash
# Start the next pending task
tasks start

# Start a specific task
tasks start 1.2
```

#### Complete a Task

```bash
# Complete a task
tasks complete 1.2
```

#### Show Next Task

```bash
# Show the next pending task
tasks next
```

#### Reset Tasks

```bash
# Reset all tasks to pending status (with confirmation)
tasks reset

# Reset all tasks without confirmation
tasks reset --yes
```

### NPM Scripts

If you've added the task management scripts to your package.json, you can run them with:

```bash
npm run tasks-show
npm run tasks-start
npm run tasks-complete 1.2
npm run tasks-next
npm run tasks-reset -- --yes
```

## Troubleshooting

### TypeScript Errors

If you encounter TypeScript errors during the build process, you may need to:

1. Add `.js` extensions to import statements in TypeScript files:

   ```typescript
   // Change this:
   import { Task, TaskManager } from './tasks_manager';

   // To this:
   import { Task, TaskManager } from './tasks_manager.js';
   ```

2. Add explicit type annotations to filter callbacks:

   ```typescript
   // Change this:
   filteredTasks = filteredTasks.filter(task => task.status === statusFilter);

   // To this:
   filteredTasks = filteredTasks.filter((task: Task) => task.status === statusFilter);
   ```

### Command Not Found

If you get a "command not found" error when trying to run the `tasks` command, make sure you've:

1. Built the project with `npm run build`
2. Made the scripts executable with `npm run make-executable`
3. Linked the package globally with `npm link`

## Programmatic Usage

You can also use the Task Manager programmatically in your own code:

```typescript
import { TaskManager, printTasksTable, createCLI } from 'task-manager-cli';

// Create a task manager
const taskManager = new TaskManager('path/to/tasks.json');

// Get all tasks
const tasks = taskManager.getAllTasks();

// Find the next pending task
const nextTask = taskManager.findNextPendingTask();

// Start a task
taskManager.startTask(1, 2); // Start task 1.2

// Complete a task
taskManager.completeTask(1, 2); // Complete task 1.2

// Reset all tasks
taskManager.resetAllTasks();

// Print tasks table
printTasksTable(taskManager);

// Create a CLI
const program = createCLI('path/to/tasks.json');
program.parse(process.argv);
```

## License

MIT
