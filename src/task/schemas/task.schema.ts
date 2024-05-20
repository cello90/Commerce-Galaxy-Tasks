import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema()
export class Task {
  @Prop({ required: true })
  collection: string;

  @Prop({ required: true })
  uniqueId: string;

  @Prop({ required: true })
  action: string;

  @Prop({ required: true })
  triggerAt: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
