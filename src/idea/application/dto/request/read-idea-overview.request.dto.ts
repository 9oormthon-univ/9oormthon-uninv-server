// src/idea/dto/query/read-idea-overview-query.dto.ts
import { IsNotEmpty, IsNumber, IsOptional, IsBoolean } from 'class-validator';
import { Expose, Type, Transform } from 'class-transformer';

export class ReadIdeaOverviewQueryDto {
  @IsNotEmpty({ message: 'page는 필수 값입니다.' })
  @Type(() => Number)
  @IsNumber({}, { message: 'page는 숫자여야 합니다.' })
  page: number;

  @IsNotEmpty({ message: 'size는 필수 값입니다.' })
  @Type(() => Number)
  @IsNumber({}, { message: 'size는 숫자여야 합니다.' })
  size: number;

  @IsNotEmpty({ message: 'generation은 필수 값입니다.' })
  @Type(() => Number)
  @IsNumber({}, { message: 'generation은 숫자여야 합니다.' })
  generation: number;

  // subjectId는 선택사항 (필요 시 해당 주제 필터 적용)
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'subject-id는 숫자여야 합니다.' })
  @Expose({ name: 'subject-id' })
  subjectId?: number;

  // isActive는 선택사항 (모집중/완료 필터)
  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null) return value;
    if (typeof value === 'boolean') return value;
    return value === 'true';
  })
  @IsBoolean({ message: 'is-active는 boolean 값이어야 합니다.' })
  @Expose({ name: 'is-active' })
  isActive?: boolean;

  // isBookmarked는 선택사항 (내 찜 필터)
  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null) return value;
    if (typeof value === 'boolean') return value;
    return value === 'true';
  })
  @IsBoolean({ message: 'is-bookmarked는 boolean 값이어야 합니다.' })
  @Expose({ name: 'is-bookmarked' })
  isBookmarked?: boolean;
}
