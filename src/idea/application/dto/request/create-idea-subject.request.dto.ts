import { IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateIdeaSubjectRequestDto {
  @IsNotEmpty({ message: '아이디어 주제를 입력해주세요.' })
  @Expose({ name: 'name'})
  name: string;
}