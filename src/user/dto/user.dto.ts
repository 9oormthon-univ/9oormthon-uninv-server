import { User } from '../../database/entities/user.entity';

export class UserDto {
  readonly id: number;
  readonly email: string;
  readonly img_url: string;
  readonly name: string;
  readonly generations: string[];
  readonly stacks: string[];
  readonly links: string[];
  readonly univName: string;

  static of(user: User): UserDto {
    return {
      id: user.id,
      name: user.name,
      email: user.serialId,
      img_url: user.imgUrl,
      generations: user.generations,
      stacks: user.stacks,
      links: user.links,
      univName: user.univ.name,
    };
  }
}
