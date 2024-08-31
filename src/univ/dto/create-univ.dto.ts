import { Expose } from 'class-transformer';

export class CreateUnivDto {
  @Expose({ name: 'univ_name' })
  readonly name: string;

  @Expose({ name: 'instagram_url' })
  readonly instagramUrl: string;
}
