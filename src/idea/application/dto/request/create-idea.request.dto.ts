import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsInt,
  IsEnum,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ERole } from '../../../../core/enums/role.enum';

/**
 * 아이디어 정보 DTO
 */
export class IdeaInfoDto {
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
    description: '현 기수',
    example: 3,
  })
  @IsNotEmpty({ message: '현 기수를 입력해주세요.' })
  @IsInt({ message: '현 기수는 정수여야 합니다.' })
  @Type(() => Number)
  @Expose({ name: 'generation' })
  generation: number;

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

/**
 * 각 역할별 요구 사항 DTO
 */
export class RoleRequirementDto {
  @ApiProperty({
    description: '요구 사항 내용',
    example: '해당 역할에 필요한 요구 사항',
  })
  @IsString()
  @Expose({ name: 'requirement' })
  requirement: string;

  @ApiProperty({
    description: '수용 인원',
    example: 3,
  })
  @IsNotEmpty({ message: '수용 인원을 입력해주세요.' })
  @IsInt({ message: '수용 인원은 정수여야 합니다.' })
  @Type(() => Number)
  @Expose({ name: 'capacity' })
  capacity: number;

  @ApiProperty({
    description: '필수 기술 스택 리스트',
    type: [String],
    required: false,
    example: ['React', 'NestJS'],
  })
  @IsOptional()
  @IsArray({ message: '필수 기술 스택은 배열 형식이어야 합니다.' })
  @IsString({ each: true, message: '각 기술 스택은 문자열이어야 합니다.' })
  @Expose({ name: 'required_tech_stacks' })
  requiredTechStacks?: string[];
}

/**
 * 요구 사항 DTO (PM, PD, FE, BE 각각의 요구사항을 포함)
 */
export class RequirementsDto {
  @ApiProperty({
    description: 'PM 요구 사항',
    type: RoleRequirementDto,
    required: false,
  })
  @ValidateNested()
  @IsNotEmpty({ message: 'PM 요구 사항을 입력해주세요.' })
  @Type(() => RoleRequirementDto)
  @Expose({ name: 'pm' })
  pm?: RoleRequirementDto;

  @ApiProperty({
    description: 'PD 요구 사항',
    type: RoleRequirementDto,
    required: false,
  })
  @ValidateNested()
  @IsNotEmpty({ message: 'PD 요구 사항을 입력해주세요.' })
  @Type(() => RoleRequirementDto)
  @Expose({ name: 'pd' })
  pd?: RoleRequirementDto;

  @ApiProperty({
    description: 'FE 요구 사항',
    type: RoleRequirementDto,
    required: false,
  })
  @ValidateNested()
  @IsNotEmpty({ message: 'FE 요구 사항을 입력해주세요.' })
  @Type(() => RoleRequirementDto)
  @Expose({ name: 'fe' })
  fe?: RoleRequirementDto;

  @ApiProperty({
    description: 'BE 요구 사항',
    type: RoleRequirementDto,
    required: false,
  })
  @ValidateNested()
  @IsNotEmpty({ message: 'BE 요구 사항을 입력해주세요.' })
  @Type(() => RoleRequirementDto)
  @Expose({ name: 'be' })
  be?: RoleRequirementDto;
}

/**
 * 전체 아이디어 생성 요청 DTO
 */
export class CreateIdeaRequestDto {
  @ApiProperty({
    description: '아이디어 정보',
    type: IdeaInfoDto,
  })
  @IsNotEmpty({ message: '아이디어 정보를 입력해주세요.' })
  @ValidateNested()
  @Type(() => IdeaInfoDto)
  @Expose({ name: 'idea_info' })
  ideaInfo: IdeaInfoDto;

  @ApiProperty({
    description: '요구 사항',
    type: RequirementsDto,
  })
  @IsNotEmpty({ message: '요구 사항을 입력해주세요.' })
  @ValidateNested()
  @Type(() => RequirementsDto)
  @Expose({ name: 'requirements' })
  requirements: RequirementsDto;
}
