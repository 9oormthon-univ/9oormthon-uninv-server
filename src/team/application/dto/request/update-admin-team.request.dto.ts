import { IsNotEmpty, IsNumber, Length, Max, Min } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { ETeamStatus } from '../../../../core/enums/team-status.enum';

export class UpdateAdminTeamRequestDto {
  @IsNotEmpty({ message: 'number는 필수 값입니다.' })
  @IsNumber({}, { message: 'number는 숫자여야 합니다.' })
  @Type(() => Number)
  @Expose({ name: 'number' })
  @Min(0)
  @Max(Number.MAX_SAFE_INTEGER)
  number: number;

  @IsNotEmpty({ message: 'team_name은 필수 값입니다.' })
  @Expose({ name: 'team_name' })
  @Length(0,255)
  teamName: string;

  @IsNotEmpty({ message: 'pm_capacity는 필수 값입니다.' })
  @IsNumber({}, { message: 'pm_capacity는 숫자여야 합니다.' })
  @Type(() => Number)
  @Expose({ name: 'pm_capacity' })
  @Min(0)
  @Max(Number.MAX_SAFE_INTEGER)
  pmCapacity: number;

  @IsNotEmpty({ message: 'pd_capacity는 필수 값입니다.' })
  @IsNumber({}, { message: 'pd_capacity는 숫자여야 합니다.' })
  @Type(() => Number)
  @Expose({ name: 'pd_capacity' })
  @Min(0)
  @Max(Number.MAX_SAFE_INTEGER)
  pdCapacity: number;

  @IsNotEmpty({ message: 'fe_capacity는 필수 값입니다.' })
  @IsNumber({}, { message: 'fe_capacity는 숫자여야 합니다.' })
  @Type(() => Number)
  @Expose({ name: 'fe_capacity' })
  @Min(0)
  @Max(Number.MAX_SAFE_INTEGER)
  feCapacity: number;

  @IsNotEmpty({ message: 'be_capacity는 필수 값입니다.' })
  @IsNumber({}, { message: 'be_capacity는 숫자여야 합니다.' })
  @Type(() => Number)
  @Expose({ name: 'be_capacity' })
  @Min(0)
  @Max(Number.MAX_SAFE_INTEGER)
  beCapacity: number;

  @IsNotEmpty({ message: 'service_name은 필수 값입니다.' })
  @Expose({ name: 'service_name' })
  @Length(0, 255)
  serviceName: string;

  @IsNotEmpty({ message: 'leader_id는 필수 값입니다.' })
  @IsNumber({}, { message: 'leader_id는 숫자여야 합니다.' })
  @Type(() => Number)
  @Expose({ name: 'leader_id' })
  @Min(0)
  @Max(Number.MAX_SAFE_INTEGER)
  leaderId: number;

  @IsNotEmpty({ message: 'status는 필수 값입니다.' })
  @Expose({ name: 'status' })
  status: ETeamStatus;

}
