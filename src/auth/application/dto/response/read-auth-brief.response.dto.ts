import { ESecurityRole } from '../../../../core/enums/security-role.enum';

export class ReadAuthBriefResponseDto {
  role: ESecurityRole;
  img_url: string;
  is_provider: boolean;

  constructor(role: ESecurityRole, imgUrl: string, isProvider: boolean) {
    this.role = role;
    this.img_url = imgUrl;
    this.is_provider = isProvider;
  }

  static of (role: ESecurityRole, imgUrl: string, isProvider: boolean): ReadAuthBriefResponseDto {
    return new ReadAuthBriefResponseDto(role, imgUrl, isProvider);
  }
}