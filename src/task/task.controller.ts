import { Controller, Post, Body } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TaskService } from './task.service';
import { CreateTaskRequestDto } from './dtos/create-task.reqeust.dto';
// import { Task } from './schemas/task.schema';

@Controller('tasks')
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  async createTask(
    @Body() createDto: CreateTaskRequestDto,
  ): Promise<any> {
    return this.taskService.createTask(createDto);
  }
}
