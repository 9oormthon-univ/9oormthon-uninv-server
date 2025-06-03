import { ERole } from '../../../../core/enums/role.enum';

export class ReadAdminUserDetailResponseDto {
  name: string;
  img_url: string;
  team: string;
  role: ERole;
  univ: {
    id: number;
    name: string;
  }
  email: string;
  phone_number: string;
  generations: number[];

  constructor(
    name: string,
    imgUrl: string,
    team: string,
    role: ERole,
    univ: {
      id: number,
      name: string
    },
    email: string,
    phoneNumber: string,
    generations: number[]
  ) {
    this.name = name;
    this.img_url = imgUrl;
    this.team = team;
    this.role = role;
    this.univ = univ;
    this.email = email;
    this.phone_number = phoneNumber;
    this.generations = generations;
  }

  static of(
    name: string,
    imgUrl: string,
    team: string,
    role: ERole,
    univ: {
      id: number,
      name: string
    },
    email: string,
    phoneNumber: string,
    generations: number[]
  ): ReadAdminUserDetailResponseDto {
    return new ReadAdminUserDetailResponseDto(
      name,
      imgUrl,
      team,
      role,
      univ,
      email,
      phoneNumber,
      generations
    );
  }
}
