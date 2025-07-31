import { IsNotEmpty, IsNumber, Length, Max, Min } from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class CreateIdeaSubjectRequestDto {
  @IsNotEmpty({ message: 'generation은 필수 값입니다.' })
  @Type(() => Number)
  @IsNumber({}, { message: 'generation은 숫자여야 합니다.' })
  @Min (1, { message: 'generation은 1 이상이어야 합니다.' })
  @Max (100, { message: 'generation은 100 이하여야 합니다.' })
  generation: number;

  @IsNotEmpty({ message: '아이디어 주제를 입력해주세요.' })
  @Expose({ name: 'name'})
  @Length(1, 255, { message: '아이디어 주제는 1~255자 이하여야 합니다.' })
  name: string;
}