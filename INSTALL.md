# Installation and Usage Guide

This guide will help you install and use the Task Manager CLI in your project.

## Installation

### Option 1: Install from GitHub

```bash
# Clone the repository
git clone https://github.com/yourdesigncoza/prd_to_vibecoding.git
cd prd_to_vibecoding

# Install dependencies
npm install

# Build the project
npm run build

# Link the package globally (optional)
npm link
```

### Option 2: Install from npm (once published)

```bash
npm install -g task-manager-cli
```

## Setup in Your Project

1. Initialize a Node.js project if you haven't already:

```bash
npm init -y
```

2. Create a `tasks.json` file in your project root:

```json
{
  "tasks": [
    {
      "id": 1,
      "title": "Task 1",
      "description": "Description of Task 1",
      "status": "pending",
      "priority": "high",
      "dependencies": [],
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

3. Add scripts to your `package.json`:

```json
"scripts": {
  "tasks-show": "tasks show",
  "tasks-start": "tasks start",
  "tasks-complete": "tasks complete",
  "tasks-next": "tasks next",
  "tasks-reset": "tasks reset"
}
```

## Basic Usage

### Display Tasks

```bash
# Using the global command
tasks show

# Using npm script
npm run tasks-show
```

### Start Working on a Task

```bash
# Start the next pending task
tasks start

# Using npm script
npm run tasks-start

# Start a specific task
tasks start 1.2

# Using npm script
npm run tasks-start 1.2
```

### Complete a Task

```bash
# Complete a task
tasks complete 1.2

# Using npm script
npm run tasks-complete 1.2
```

### Show the Next Task

```bash
# Show the next pending task
tasks next

# Using npm script
npm run tasks-next
```

### Reset All Tasks

```bash
# Reset all tasks (with confirmation)
tasks reset

# Reset all tasks (without confirmation)
tasks reset --yes

# Using npm script
npm run tasks-reset -- --yes
```

## Advanced Usage

### Filtering Tasks

```bash
# Filter by status
tasks show --status pending
tasks show --status in-progress
tasks show --status done

# Filter by priority
tasks show --priority high
tasks show --priority medium
tasks show --priority low

# Combine filters
tasks show --status pending --priority high
```

### Compact View

```bash
# Show tasks in compact view (hide description column)
tasks show --compact
```

## Programmatic Usage

You can also use the Task Manager programmatically in your own code:

```javascript
import { TaskManager, printTasksTable } from 'task-manager-cli';

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

// Print tasks table
printTasksTable(taskManager);
```

See the `examples` directory for more detailed examples.
