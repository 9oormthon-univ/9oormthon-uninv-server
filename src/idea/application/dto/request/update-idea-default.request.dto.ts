import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ERole } from '../../../../core/enums/role.enum';

export class UpdateIdeaDefaultRequestDto {
  @ApiProperty({
    description: '아이디어 주제 ID',
    example: 123,
  })
  @IsNotEmpty({ message: '아이디어 주제 ID를 입력해주세요.' })
  @IsNumber({}, { message: '아이디어 주제 ID는 숫자여야 합니다.' })
  @Type(() => Number)
  @Expose({ name: 'idea_subject_id' })
  ideaSubjectId: number;

  @ApiProperty({
    description: '제목',
    example: '아이디어 제목',
  })
  @IsNotEmpty({ message: '제목을 입력해주세요.' })
  @IsString()
  @Expose({ name: 'title' })
  title: string;

  @ApiProperty({
    description: '요약',
    example: '아이디어 요약',
  })
  @IsNotEmpty({ message: '요약을 입력해주세요.' })
  @IsString()
  @Expose({ name: 'summary' })
  summary: string;

  @ApiProperty({
    description: '내용',
    example: '아이디어 내용',
  })
  @IsNotEmpty({ message: '내용을 입력해주세요.' })
  @IsString()
  @Expose({ name: 'content' })
  content: string;

  @ApiProperty({
    description: '제공자 역할',
    enum: ERole,
    example: ERole.PM,
  })
  @IsNotEmpty({ message: '제공자 역할을 입력해주세요.' })
  @IsEnum(ERole, { message: '제공자 역할은 PM, PD, FE, BE 중 하나여야 합니다.' })
  @Expose({ name: 'provider_role' })
  providerRole: ERole;
}