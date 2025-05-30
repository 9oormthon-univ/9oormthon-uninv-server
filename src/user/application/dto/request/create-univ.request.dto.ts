export class CreateUnivRequestDto {
  constructor(
    public readonly name: string,
    public readonly instagram_url: string | null,
    public readonly generation: number
  ) {}
}