import { ESecurityRole } from '../../../../core/enums/security-role.enum';

export class ReadAuthBriefResponseDto {
  role: ESecurityRole;
  profile_img_url: string;
  is_provider: boolean;

  constructor(role: ESecurityRole, profileImgUrl: string, isProvider: boolean) {
    this.role = role;
    this.profile_img_url = profileImgUrl;
    this.is_provider = isProvider;
  }

  static of (role: ESecurityRole, profileImgUrl: string, isProvider: boolean): ReadAuthBriefResponseDto {
    return new ReadAuthBriefResponseDto(role, profileImgUrl, isProvider);
  }
}