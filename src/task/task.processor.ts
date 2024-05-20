import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { TaskService } from './task.service';

@Processor('task-queue')
export class TaskProcessor {
  private readonly logger = new Logger(TaskProcessor.name);

  constructor(private readonly taskService: TaskService) {}

  @Process('executeTask')
  async handleExecuteTask(job: Job) {
    const { taskId } = job.data;
    this.logger.log(`Executing task ${taskId}`);
    
    // Perform the action on the MongoDB collection as needed
    // Example: await someMongoService.performAction(task.collection, task.uniqueId, task.action);

    // Complete the task
    await this.taskService.completeTask(taskId);
  }
}
