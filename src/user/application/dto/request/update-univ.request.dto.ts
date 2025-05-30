export class UpdateUnivRequestDto{
  constructor(
    public readonly name: string,
    public readonly instagram_url: string | null,
    public readonly leader_id: number
  ) {}
}