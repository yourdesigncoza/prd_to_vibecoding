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

# Build the project
npm run build

# Link the package globally
npm link
```

### As a Dependency

```bash
npm install task-manager-cli
```

## Usage

### Configuration

You can use the built-in initialization script to create a sample tasks file:

```bash
tasks-init
```

This will create a `tasks.json` file in your project root with sample tasks.

You can also add the task management scripts to your package.json:

```bash
tasks-add-scripts
```

This will add the following scripts to your package.json:

```json
"scripts": {
  "tasks-show": "tasks show",
  "tasks-start": "tasks start",
  "tasks-complete": "tasks complete",
  "tasks-next": "tasks next",
  "tasks-reset": "tasks reset"
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

You can also add these commands to your `package.json` scripts:

```json
"scripts": {
  "tasks-show": "tasks show",
  "tasks-start": "tasks start",
  "tasks-complete": "tasks complete",
  "tasks-next": "tasks next",
  "tasks-reset": "tasks reset"
}
```

Then you can run them with:

```bash
npm run tasks-show
npm run tasks-start
npm run tasks-complete 1.2
npm run tasks-next
npm run tasks-reset -- --yes
```

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
