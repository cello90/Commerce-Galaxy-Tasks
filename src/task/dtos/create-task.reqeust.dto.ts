import { IsNotEmpty, IsMongoId, IsPositive } from 'class-validator';

export class CreateTaskRequestDto {
  @IsNotEmpty()
  collection: string;

  @IsMongoId()
  @IsNotEmpty()
  itemId: string;

  @IsNotEmpty()
  action: string;

  @IsPositive()
  delay: number;
}
