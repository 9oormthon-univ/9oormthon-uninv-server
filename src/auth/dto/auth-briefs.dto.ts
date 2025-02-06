import { Role } from '../../database/enums/security-role.enum';

export class AuthBriefsDto {
  role: Role;
  name: string;

  constructor(role: Role, name: string) {
    this.role = role;
    this.name
  }

  static of (role: Role, name: string): AuthBriefsDto {
    return new AuthBriefsDto(role, name);
  }
}