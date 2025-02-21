import { UserModel } from '../../../domain/user.model';

export class ReadUserDetailResponseDto {
  name: string;
  univ: string;
  email: string;
  imgUrl: string;
  introduction: string;
  stacks: string[];
  links: string[];
  is_me: boolean;

  constructor(name: string, univ: string, email: string, imgUrl: string, introduction: string, stacks: string[], links: string[], is_me: boolean) {
    this.name = name;
    this.univ = univ;
    this.email = email;
    this.imgUrl = imgUrl;
    this.introduction = introduction;
    this.stacks = stacks;
    this.links = links;
    this.is_me = is_me;
  }

  static of(user:UserModel, is_me: boolean): ReadUserDetailResponseDto {
    return new ReadUserDetailResponseDto(
      user.name,
      user.univ.name,
      user.serialId,
      user.imgUrl,
      user.introduction,
      user.stacks,
      user.links,
      is_me
    );
  }
}