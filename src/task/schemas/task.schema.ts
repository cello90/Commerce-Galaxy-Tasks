import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema()
export class Task {
  /**
   * collection name in Mongo
   */
  @Prop({ required: true })
  collection: string;

  /*
    * unique id of the document in the mongo collection to be acted upon
    */
  @Prop({ required: true })
  itemId: string;

  /**
   * action to be performed, this is the mongo query that will run in the $set function
   */
  @Prop({ required: true })
  action: string;

  /**
   * trigger time
   */
  @Prop({ required: true })
  delay: number;

  /**
   * Redis Id info
   */
  @Prop({ required: true })
  jobId: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
