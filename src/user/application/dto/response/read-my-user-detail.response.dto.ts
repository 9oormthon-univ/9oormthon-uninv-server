import { UserModel } from '../../../domain/user.model';

export class ReadMyUserDetailResponseDto {
  name: string;
  univ: string;
  email: string;
  imgUrl: string;
  introduction: string;
  stacks: string[];
  links: string[];

  constructor(name: string, univ: string, email: string, imgUrl: string, introduction: string, stacks: string[], links: string[]) {
    this.name = name;
    this.univ = univ;
    this.email
    this.imgUrl = imgUrl;
    this.introduction = introduction;
    this.stacks = stacks;
    this.links = links;
  }

  static from(user:UserModel) {
    return new ReadMyUserDetailResponseDto(
      user.name,
      user.univ.name,
      user.serialId,
      user.imgUrl,
      user.introduction,
      user.stacks,
      user.links
    );
  }
}