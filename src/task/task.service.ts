import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Task, TaskDocument } from './schemas/task.schema';
import { CreateTaskRequestDto } from './dtos/create-task.reqeust.dto';

@Injectable()
export class TaskService implements OnModuleInit {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    @InjectQueue('task-queue') private taskQueue: Queue,
  ) {}

  async onModuleInit() {
    // await this.loadPendingTasks();
  }

  // async loadPendingTasks() {
  //   const now = new Date();
  //   const pendingTasks = await this.taskModel.find({ triggerAt: { $gte: now } }).exec();
  //   for (const task of pendingTasks) {
  //     await this.scheduleTask(task);
  //   }
  // }

  async scheduleTask(task: CreateTaskRequestDto) {
    const delay = task.delay;
    const job = await this.taskQueue.add(
      `${task.collection}-${task.itemId}`,
      { 
        collection: task.collection,
        itemId: task.itemId,
        action: task.action 
      },
      { delay, attempts: 3 },
    );
    this.logger.log(`Scheduled task ${job.id} to be executed in ${delay}ms. Task count: ${await this.taskQueue.count()}`);
    return job;
  }

  async createTask(createDto: CreateTaskRequestDto) {
    const job = await this.scheduleTask(createDto)
    const task = new this.taskModel({ ...createDto, jobId: job.id });
    return task.save();
  }

  async completeTask(taskId: string) {
    //await this.taskModel.findByIdAndDelete(taskId).exec();
    this.logger.log(`Completed and removed task ${taskId}`);
  }
}
