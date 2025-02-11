import { ESecurityRole } from '../../../core/enums/security-role.enum';

export class ReadAuthBriefsResponseDto {
  role: ESecurityRole;
  name: string;

  constructor(role: ESecurityRole, name: string) {
    this.role = role;
    this.name
  }

  static of (role: ESecurityRole, name: string): ReadAuthBriefsResponseDto {
    return new ReadAuthBriefsResponseDto(role, name);
  }
}