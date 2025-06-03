import { IsNotEmpty, IsNumber } from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class CreateTeamRequestDto {
    @IsNotEmpty({ message: 'generation은 필수 값입니다.' })
    @IsNumber({}, { message: 'generation은 숫자여야 합니다.' })
    @Type(() => Number)
    @Expose({ name: 'generation' })
    generation: number;

    @IsNotEmpty({ message: 'name은 필수 값입니다.' })
    @Expose({ name: 'name' })
    name: string;

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
}