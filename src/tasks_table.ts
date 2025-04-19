import { Table } from 'console-table-printer';
import { Task, TaskManager } from './tasks_manager';

/**
 * Get the terminal width
 */
function getTerminalWidth(): number {
  // Get terminal width or default to 80 if not available
  return process.stdout.columns || 80;
}

/**
 * Format dependencies as a string
 */
function formatDependencies(deps: number[]): string {
  return deps.length ? deps.join(', ') : 'None';
}

/**
 * Truncate a string to a maximum length
 */
function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - 3) + '...';
}

/**
 * Print the tasks table with optional filters
 */
export function printTasksTable(taskManager: TaskManager, statusFilter?: string, priorityFilter?: string, forceCompact?: boolean): void {
  const tasks = taskManager.getAllTasks();
  
  // Check terminal width to determine if we should show the description column
  const terminalWidth = getTerminalWidth();
  const showDescription = !forceCompact && terminalWidth > 120; // Only show description if terminal is wide enough and compact mode is not forced

  // Define columns based on terminal width
  const columns = [
    { name: 'id', title: 'ID', alignment: 'left', color: 'cyan' },
    { name: 'status', title: 'Status', alignment: 'left' },
    { name: 'priority', title: 'Priority', alignment: 'left' },
    { name: 'title', title: 'Title', alignment: 'left' },
  ];

  if (showDescription) {
    columns.push({ name: 'description', title: 'Description', alignment: 'left' });
  }

  columns.push({ name: 'dependencies', title: 'Dependencies', alignment: 'left' });

  // Create table
  const table = new Table({
    columns,
    colorMap: {
      'pending': 'yellow',
      'in-progress': 'blue',
      'done': 'green',
      'high': 'red',
      'medium': 'yellow',
      'low': 'green',
    },
  });

  // Filter tasks
  let filteredTasks = tasks;
  if (statusFilter) {
    filteredTasks = filteredTasks.filter(task => task.status === statusFilter);
  }
  if (priorityFilter) {
    filteredTasks = filteredTasks.filter(task => task.priority === priorityFilter);
  }

  // Add tasks to table
  for (const task of filteredTasks) {
    // Add main task
    const taskRow = {
      id: task.id.toString(),
      status: task.status,
      priority: task.priority,
      title: `${task.id}. ${task.title}`,
      description: showDescription ? truncate(task.description, 50) : undefined,
      dependencies: formatDependencies(task.dependencies),
    };
    table.addRow(taskRow);

    // Add subtasks if any
    if (task.subtasks && task.subtasks.length > 0) {
      for (const subtask of task.subtasks) {
        const subtaskRow = {
          id: `${task.id}.${subtask.id}`,
          status: subtask.status,
          priority: '-',
          title: `  └─ ${subtask.id}. ${subtask.title}`,
          description: showDescription ? truncate(subtask.description, 50) : undefined,
          dependencies: formatDependencies(subtask.dependencies),
        };
        table.addRow(subtaskRow);
      }
    }

    // Add empty row for spacing
    table.addRow({
      id: '',
      status: '',
      priority: '',
      title: '',
      description: showDescription ? '' : undefined,
      dependencies: '',
    });
  }

  // Print table
  table.printTable();
}
