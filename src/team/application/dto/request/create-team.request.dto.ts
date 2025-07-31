import { IsNotEmpty, IsNumber, Length, Max, Min } from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class CreateTeamRequestDto {
    @IsNotEmpty({ message: 'generation은 필수 값입니다.' })
    @IsNumber({}, { message: 'generation은 숫자여야 합니다.' })
    @Type(() => Number)
    @Expose({ name: 'generation' })
    @Min(1)
    @Max(Number.MAX_SAFE_INTEGER)
    generation: number;

    @IsNotEmpty({ message: 'name은 필수 값입니다.' })
    @Expose({ name: 'name' })
    @Length(0, 50)
    name: string;

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
}