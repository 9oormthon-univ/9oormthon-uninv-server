import { Expose } from 'class-transformer';

export class UpdateUserDto {
  @Expose({ name: 'introduction' })
  readonly introduction: string;

  @Expose({ name: 'stacks' })
  readonly stacks: string[];

  @Expose({ name: 'links' })
  readonly githubLink: string[];
}
