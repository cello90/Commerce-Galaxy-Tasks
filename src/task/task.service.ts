import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Task, TaskDocument } from './schemas/task.schema';

@Injectable()
export class TaskService implements OnModuleInit {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    @InjectQueue('task-queue') private taskQueue: Queue,
  ) {}

  async onModuleInit() {
    await this.loadPendingTasks();
  }

  async loadPendingTasks() {
    const now = new Date();
    const pendingTasks = await this.taskModel.find({ triggerAt: { $gte: now } }).exec();
    for (const task of pendingTasks) {
      await this.scheduleTask(task);
    }
  }

  async scheduleTask(task: TaskDocument) {
    const delay = task.triggerAt.getTime() - Date.now();
    await this.taskQueue.add(
      'executeTask',
      { taskId: task._id },
      { delay, attempts: 3 },
    );
    this.logger.log(`Scheduled task ${task._id} to be executed in ${delay}ms`);
  }

  async createTask(collection: string, uniqueId: string, action: string, triggerAt: Date) {
    const task = new this.taskModel({ collection, uniqueId, action, triggerAt });
    await task.save();
    await this.scheduleTask(task);
  }

  async completeTask(taskId: string) {
    await this.taskModel.findByIdAndDelete(taskId).exec();
    this.logger.log(`Completed and removed task ${taskId}`);
  }
}
