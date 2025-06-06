import { IsNotEmpty, IsNumber } from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class UpdateAdminTeamRequestDto {
  @IsNotEmpty({ message: 'number는 필수 값입니다.' })
  @IsNumber({}, { message: 'number는 숫자여야 합니다.' })
  @Type(() => Number)
  @Expose({ name: 'number' })
  number: number;

  @IsNotEmpty({ message: 'team_name은 필수 값입니다.' })
  @Expose({ name: 'team_name' })
  teamName: string;

  @IsNotEmpty({ message: 'pm_capacity는 필수 값입니다.' })
  @IsNumber({}, { message: 'pm_capacity는 숫자여야 합니다.' })
  @Type(() => Number)
  @Expose({ name: 'pm_capacity' })
  pmCapacity: number;

  @IsNotEmpty({ message: 'pd_capacity는 필수 값입니다.' })
  @IsNumber({}, { message: 'pd_capacity는 숫자여야 합니다.' })
  @Type(() => Number)
  @Expose({ name: 'pd_capacity' })
  pdCapacity: number;

  @IsNotEmpty({ message: 'fe_capacity는 필수 값입니다.' })
  @IsNumber({}, { message: 'fe_capacity는 숫자여야 합니다.' })
  @Type(() => Number)
  @Expose({ name: 'fe_capacity' })
  feCapacity: number;

  @IsNotEmpty({ message: 'be_capacity는 필수 값입니다.' })
  @IsNumber({}, { message: 'be_capacity는 숫자여야 합니다.' })
  @Type(() => Number)
  @Expose({ name: 'be_capacity' })
  beCapacity: number;

  @IsNotEmpty({ message: 'service_name은 필수 값입니다.' })
  @Expose({ name: 'service_name' })
  serviceName: string;

  @IsNotEmpty({ message: 'leader_id는 필수 값입니다.' })
  @IsNumber({}, { message: 'leader_id는 숫자여야 합니다.' })
  @Type(() => Number)
  @Expose({ name: 'leader_id' })
  leaderId: number;
}
