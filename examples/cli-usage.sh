#!/bin/bash

# This script demonstrates how to use the Task Manager CLI
# Make sure to build the project first: npm run build

# Show all tasks
echo "=== Show all tasks ==="
node ../bin/tasks.js show

# Show tasks with compact view
echo -e "\n=== Show tasks with compact view ==="
node ../bin/tasks.js show --compact

# Filter tasks by status
echo -e "\n=== Filter tasks by status ==="
node ../bin/tasks.js show --status pending

# Filter tasks by priority
echo -e "\n=== Filter tasks by priority ==="
node ../bin/tasks.js show --priority high

# Show the next pending task
echo -e "\n=== Show the next pending task ==="
node ../bin/tasks.js next

# Start the next pending task
echo -e "\n=== Start the next pending task ==="
node ../bin/tasks.js start

# Complete a task
echo -e "\n=== Complete a task ==="
node ../bin/tasks.js complete 1.1

# Show tasks after completing a task
echo -e "\n=== Show tasks after completing a task ==="
node ../bin/tasks.js show

# Reset all tasks
echo -e "\n=== Reset all tasks ==="
node ../bin/tasks.js reset --yes

# Show tasks after reset
echo -e "\n=== Show tasks after reset ==="
node ../bin/tasks.js show
