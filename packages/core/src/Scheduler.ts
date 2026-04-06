type Task = () => unknown | Promise<unknown>;

/**
 * Scheduler provides a simple way to queue and execute tasks in a strict sequence.
 * - Regular tasks are run one after another; if a new task is scheduled before the current one starts, it replaces the pending next task.
 * - Priority tasks are added to a separate queue and will be executed before any remaining regular tasks.
 */
export default class Scheduler {
  private currentTask: Task;

  private nextTask: Task;

  private nextPriorityTasks: Array<Task> = [];

  private async tick(): Promise<void> {
    await this.currentTask?.();
    if (this.nextPriorityTasks.length > 0) {
      this.currentTask = () =>
        Promise.all(this.nextPriorityTasks.map((task) => task()));
      this.nextPriorityTasks = [];
      await this.tick();
    } else if (this.nextTask) {
      this.currentTask = this.nextTask;
      this.nextTask = undefined;
      await this.tick();
    } else {
      this.currentTask = undefined;
    }
  }

  bind<A extends unknown[], R>(
    fn: (...args: A) => R | Promise<R>,
    context: any
  ) {
    return async (...args: A) =>
      this.schedulePriority(async () => fn.bind(context)(...args));
  }

  schedule(task: Task) {
    if (this.currentTask) {
      this.nextTask = task;
    } else {
      this.currentTask = task;
      this.tick();
    }
  }

  schedulePriority(task: Task) {
    if (this.currentTask) {
      this.nextPriorityTasks.push(task);
      this.tick();
    } else {
      task();
    }
  }
}
