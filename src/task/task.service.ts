import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Task, TaskDocument } from './schemas/task.schema';
import { CreateTaskRequestDto } from './dtos/create-task.reqeust.dto';

// TO DO
// - Implement a collection on Redis to store mongoID's for the task and associated jobIDs
// - On create, create a new entry in the above collection
// - On delete, use the above collection to find the jobID and delete the job

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
    
  }

  async scheduleTask(task: CreateTaskRequestDto) {
    const delay = task.delay;
    const job = await this.taskQueue.add(
      `executeTask`,
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

  async completeTask(jobId: string) {
    //await this.taskModel.findByIdAndDelete(taskId).exec();
    this.logger.log(`Completed and removed task ${jobId}`);
  }

  async deleteTask(taskId: string) {
    this.logger.log(`Deleting task ${taskId}. Task count: ${await this.taskQueue.count()}`);
    const task = await this.taskModel.findById(taskId).exec();
    const job = await this.taskQueue.getJob(task.jobId)
    await job.remove();
    this.logger.log(`Deleted task ${taskId}. Task count: ${await this.taskQueue.count()}`);
    return this.taskModel.findByIdAndDelete(taskId).exec();
  }
}
