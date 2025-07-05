export class UpdateAdminUserResponseDto{
  new_password: string;

  constructor(new_password: string) {
    this.new_password = new_password;
  }

  static of(newPassword: string): UpdateAdminUserResponseDto {
    return new UpdateAdminUserResponseDto(newPassword);
  }
}