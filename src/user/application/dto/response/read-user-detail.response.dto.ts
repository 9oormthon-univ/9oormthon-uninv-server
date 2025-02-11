import { UserModel } from '../../../domain/user.model';

export class ReadUserDetailResponseDto {
  name: string;
  univ: string;
  imgUrl: string;
  introduction: string;
  stacks: string[];
  links: string[];

  constructor(name: string, univ: string, imgUrl: string, introduction: string, stacks: string[], links: string[]) {
    this.name = name;
    this.univ = univ;
    this.imgUrl = imgUrl;
    this.introduction = introduction;
    this.stacks = stacks;
    this.links = links;
  }

  static from(user:UserModel) {
    return new ReadUserDetailResponseDto(
      user.name,
      user.univ.name,
      user.imgUrl,
      user.introduction,
      user.stacks,
      user.links
    );
  }
}