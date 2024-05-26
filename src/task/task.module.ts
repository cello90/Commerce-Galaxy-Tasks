import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TaskProcessor } from './task.processor';
import { Task, TaskSchema } from './schemas/task.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
    BullModule.registerQueue({
      name: 'task-queue',
    }),
  ],
  controllers: [TaskController],
  providers: [TaskService, TaskProcessor],
})
export class TaskModule {}
