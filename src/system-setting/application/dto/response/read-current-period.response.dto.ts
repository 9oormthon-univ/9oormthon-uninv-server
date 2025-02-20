import { EPeriod } from '../../../../core/enums/period.enum';

export class ReadCurrentPeriodResponseDto {
  period: EPeriod;

  constructor(period: EPeriod) {
    this.period = period;
  }

  static of(period: EPeriod): ReadCurrentPeriodResponseDto {
    return new ReadCurrentPeriodResponseDto(period);
  }
}