import { Expose } from 'class-transformer';
export class CreateRecruitDto {
  @Expose({ name: 'type' })
  readonly type: number;
  @Expose({ name: 'title' })
  readonly title: string;
  @Expose({ name: 'start_at' })
  readonly startAt: Date;
  @Expose({ name: 'end_at' })
  readonly endAt: Date;
}
