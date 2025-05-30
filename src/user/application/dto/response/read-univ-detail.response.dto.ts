export class ReadUnivDetailResponseDto {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly instagram_url: string | null,
    public readonly generation: number,
    public readonly leader: {
      id: number;
      description: string;
    }
  ) {}

  static of(
    id: number,
    name: string,
    instagram_url: string | null,
    generation: number,
    leader: { id: number; description: string }
  ): ReadUnivDetailResponseDto {
    return new ReadUnivDetailResponseDto(
      id,
      name,
      instagram_url,
      generation,
      leader
    );
  }
}