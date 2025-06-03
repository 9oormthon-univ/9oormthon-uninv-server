export class UpdateAdminUserRequestDto {
  constructor(
    public readonly name: string,
    public readonly univ_id: number,
    public readonly email: string,
    public readonly phone_number: string,
    public readonly generation: number[]
  ) {}
}