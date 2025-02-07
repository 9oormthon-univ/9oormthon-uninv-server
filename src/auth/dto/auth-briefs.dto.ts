import { ESecurityRole } from '../../database/enums/security-role.enum';

export class AuthBriefsDto {
  role: ESecurityRole;
  name: string;

  constructor(role: ESecurityRole, name: string) {
    this.role = role;
    this.name
  }

  static of (role: ESecurityRole, name: string): AuthBriefsDto {
    return new AuthBriefsDto(role, name);
  }
}