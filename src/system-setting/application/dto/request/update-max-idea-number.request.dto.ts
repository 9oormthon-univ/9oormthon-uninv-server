import { IsNotEmpty, IsNumber } from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class UpdateMaxIdeaNumberRequestDto {
  @IsNotEmpty({ message: 'max_idea_number는 필수 값입니다.' })
  @IsNumber({}, { message: 'max_idea_number는 숫자여야 합니다.' })
  @Type(() => Number)
  @Expose({ name: 'max_idea_number' })
  maxIdeaNumber: number;
}