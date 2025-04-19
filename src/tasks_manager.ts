import fs from 'node:fs';
import path from 'node:path';

export interface Subtask {
  id: number;
  title: string;
  description: string;
  status: string;
  dependencies: number[];
  details: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  dependencies: number[];
  details: string;
  testStrategy: string;
  subtasks?: Subtask[];
}

export interface TasksData {
  tasks: Task[];
  metadata: {
    projectName: string;
    totalTasks: number;
    sourceFile: string;
    generatedAt: string;
  };
}

// Task status constants
export const STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  DONE: 'done'
};

export class TaskManager {
  private tasksPath: string;
  private tasksData: TasksData = { tasks: [], metadata: { projectName: '', totalTasks: 0, sourceFile: '', generatedAt: '' } };

  constructor(tasksPath?: string) {
    this.tasksPath = tasksPath || path.join(process.cwd(), 'tasks.json');
    this.loadTasks();
  }

  /**
   * Load tasks from the JSON file
   */
  private loadTasks(): void {
    try {
      const data = fs.readFileSync(this.tasksPath, 'utf8');
      this.tasksData = JSON.parse(data);
    } catch (error) {
      console.error('Error loading tasks:', error);
      process.exit(1);
    }
  }

  /**
   * Save tasks to the JSON file
   */
  private saveTasks(): void {
    try {
      fs.writeFileSync(this.tasksPath, JSON.stringify(this.tasksData, null, 2), 'utf8');
    } catch (error) {
      console.error('Error saving tasks:', error);
      process.exit(1);
    }
  }

  /**
   * Get all tasks
   */
  getAllTasks(): Task[] {
    return this.tasksData.tasks;
  }

  /**
   * Find a task by ID
   */
  findTaskById(id: number): Task | null {
    return this.tasksData.tasks.find(task => task.id === id) || null;
  }

  /**
   * Find a subtask by parent task ID and subtask ID
   */
  findSubtaskById(taskId: number, subtaskId: number): Subtask | null {
    const task = this.findTaskById(taskId);
    if (!task || !task.subtasks) return null;
    return task.subtasks.find(subtask => subtask.id === subtaskId) || null;
  }

  /**
   * Parse a task ID string (e.g., "1.2" -> { taskId: 1, subtaskId: 2 })
   */
  parseTaskId(idStr: string): { taskId: number; subtaskId?: number } {
    const parts = idStr.split('.');
    if (parts.length === 1) {
      return { taskId: parseInt(parts[0], 10) };
    } else if (parts.length === 2) {
      return {
        taskId: parseInt(parts[0], 10),
        subtaskId: parseInt(parts[1], 10)
      };
    }
    throw new Error(`Invalid task ID format: ${idStr}`);
  }

  /**
   * Check if all dependencies of a task are completed
   */
  areDependenciesSatisfied(taskId: number): boolean {
    const task = this.findTaskById(taskId);
    if (!task) return false;

    // Check if all dependency tasks are done
    for (const depId of task.dependencies) {
      const depTask = this.findTaskById(depId);
      if (!depTask || depTask.status !== STATUS.DONE) {
        return false;
      }
    }
    return true;
  }

  /**
   * Check if all dependencies of a subtask are completed
   */
  areSubtaskDependenciesSatisfied(taskId: number, subtaskId: number): boolean {
    const subtask = this.findSubtaskById(taskId, subtaskId);
    if (!subtask) return false;

    // Check if all dependency subtasks are done
    for (const depId of subtask.dependencies) {
      const depSubtask = this.findSubtaskById(taskId, depId);
      if (!depSubtask || depSubtask.status !== STATUS.DONE) {
        return false;
      }
    }
    return true;
  }

  /**
   * Find the next pending task that has all dependencies satisfied
   */
  findNextPendingTask(): { taskId: number; subtaskId?: number } | null {
    // Sort tasks by ID to ensure we process them in order
    const sortedTasks = [...this.tasksData.tasks].sort((a, b) => a.id - b.id);

    for (const task of sortedTasks) {
      // Skip completed tasks
      if (task.status === STATUS.DONE) continue;

      // Check if task dependencies are satisfied
      if (!this.areDependenciesSatisfied(task.id)) continue;

      // If the task has subtasks, find the first pending or in-progress subtask
      if (task.subtasks && task.subtasks.length > 0) {
        const sortedSubtasks = [...task.subtasks].sort((a, b) => a.id - b.id);

        // First, look for in-progress subtasks
        for (const subtask of sortedSubtasks) {
          if (subtask.status === STATUS.IN_PROGRESS) {
            return { taskId: task.id, subtaskId: subtask.id };
          }
        }

        // Then, look for pending subtasks with satisfied dependencies
        for (const subtask of sortedSubtasks) {
          if (subtask.status === STATUS.PENDING && this.areSubtaskDependenciesSatisfied(task.id, subtask.id)) {
            return { taskId: task.id, subtaskId: subtask.id };
          }
        }

        // If we have subtasks but none are ready, continue to the next main task
        continue;
      }

      // If no subtasks or all subtasks are done, return the task itself
      if (task.status === STATUS.PENDING || task.status === STATUS.IN_PROGRESS) {
        return { taskId: task.id };
      }
    }

    return null;
  }

  /**
   * Start a task (update status to in-progress)
   */
  startTask(taskId: number, subtaskId?: number): boolean {
    // Get the main task
    const task = this.findTaskById(taskId);
    if (!task) return false;

    if (subtaskId) {
      // Start a subtask
      const subtask = this.findSubtaskById(taskId, subtaskId);
      if (!subtask) return false;

      // Check if dependencies are satisfied
      if (!this.areSubtaskDependenciesSatisfied(taskId, subtaskId)) {
        console.error(`Cannot start subtask ${taskId}.${subtaskId} - dependencies not satisfied`);
        return false;
      }

      // Mark both the subtask and main task as in-progress
      subtask.status = STATUS.IN_PROGRESS;
      task.status = STATUS.IN_PROGRESS;
    } else {
      // Start a main task
      // Check if dependencies are satisfied
      if (!this.areDependenciesSatisfied(taskId)) {
        console.error(`Cannot start task ${taskId} - dependencies not satisfied`);
        return false;
      }

      task.status = STATUS.IN_PROGRESS;
    }

    this.saveTasks();
    return true;
  }

  /**
   * Complete a task (update status to done)
   */
  completeTask(taskId: number, subtaskId?: number): boolean {
    // Get the main task
    const task = this.findTaskById(taskId);
    if (!task) return false;

    if (subtaskId) {
      // Complete a subtask
      const subtask = this.findSubtaskById(taskId, subtaskId);
      if (!subtask) return false;
      subtask.status = STATUS.DONE;

      // Check if all subtasks are done, and if so, mark the parent task as done
      if (task.subtasks && task.subtasks.every(st => st.status === STATUS.DONE)) {
        task.status = STATUS.DONE;
      }
    } else {
      // Complete a main task directly
      // If the task has subtasks, mark them all as done
      if (task.subtasks && task.subtasks.length > 0) {
        task.subtasks.forEach(subtask => {
          subtask.status = STATUS.DONE;
        });
      }

      task.status = STATUS.DONE;
    }

    this.saveTasks();
    return true;
  }

  /**
   * Get detailed information about a task
   */
  getTaskDetails(taskId: number, subtaskId?: number): any {
    if (subtaskId) {
      const subtask = this.findSubtaskById(taskId, subtaskId);
      if (!subtask) return null;

      const task = this.findTaskById(taskId);
      return {
        id: `${taskId}.${subtaskId}`,
        title: subtask.title,
        description: subtask.description,
        status: subtask.status,
        dependencies: subtask.dependencies,
        details: subtask.details,
        parentTask: {
          id: task?.id,
          title: task?.title
        }
      };
    } else {
      const task = this.findTaskById(taskId);
      if (!task) return null;

      return {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dependencies: task.dependencies,
        details: task.details,
        testStrategy: task.testStrategy,
        subtasks: task.subtasks
      };
    }
  }

  /**
   * Reset all tasks to pending status
   */
  resetAllTasks(): boolean {
    // Reset all main tasks to pending
    for (const task of this.tasksData.tasks) {
      task.status = STATUS.PENDING;

      // Reset all subtasks to pending
      if (task.subtasks) {
        for (const subtask of task.subtasks) {
          subtask.status = STATUS.PENDING;
        }
      }
    }

    this.saveTasks();
    return true;
  }
}
