import { Controller, Post, Body, Ip, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TaskService } from './task.service';

@Controller('tasks')
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  async createTask(
    @Body('collection') collection: string,
    @Body('uniqueId') uniqueId: string,
    @Body('action') action: string,
    @Body('triggerAt') triggerAt: string,
    @Ip() ip: string,
  ) {
    const allowedIps = this.configService.get<string[]>('server.allowedIps');
    if (!allowedIps.includes(ip)) {
      throw new BadRequestException('IP not allowed');
    }

    const triggerDate = new Date(triggerAt);
    if (isNaN(triggerDate.getTime())) {
      throw new BadRequestException('Invalid triggerAt date');
    }

    await this.taskService.createTask(collection, uniqueId, action, triggerDate);
    return { message: 'Task scheduled successfully' };
  }
}
