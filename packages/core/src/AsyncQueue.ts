export default class AsyncQueue {
  private queue: Array<() => Promise<void>> = [];

  private running = false;

  enqueue<T>(task: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(() => task().then(resolve, reject));

      if (!this.running) this.drain();
    });
  }

  private async drain(): Promise<void> {
    this.running = true;
    while (this.queue.length > 0) {
      const task = this.queue.shift()!;
      // This is ok, we want to await the task in the queue
      // eslint-disable-next-line no-await-in-loop
      await task();
    }
    this.running = false;
  }
}
