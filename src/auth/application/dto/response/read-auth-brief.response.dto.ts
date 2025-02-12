import { ESecurityRole } from '../../../../core/enums/security-role.enum';

export class ReadAuthBriefResponseDto {
  role: ESecurityRole;
  name: string;

  constructor(role: ESecurityRole, name: string) {
    this.role = role;
    this.name
  }

  static of (role: ESecurityRole, name: string): ReadAuthBriefResponseDto {
    return new ReadAuthBriefResponseDto(role, name);
  }
}