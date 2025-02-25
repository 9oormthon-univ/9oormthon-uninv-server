import { ESecurityRole } from '../../../../core/enums/security-role.enum';
import { EUserStatus } from '../../../../core/enums/user-status.enum';

export class ReadAuthBriefResponseDto {
  role: ESecurityRole;
  img_url: string;
  status: EUserStatus;

  constructor(role: ESecurityRole, imgUrl: string, status: EUserStatus) {
    this.role = role;
    this.img_url = imgUrl;
    this.status = status;
  }

  static of(role: ESecurityRole, imgUrl: string, status: EUserStatus): ReadAuthBriefResponseDto {
    return new ReadAuthBriefResponseDto(role, imgUrl, status);
  }
}