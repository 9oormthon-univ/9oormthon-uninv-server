export class ReadUnivBriefResponseDto {
  constructor(
    public readonly univs: {
      id: number;
      name: string;
    }[],
    public readonly count: number
  ) {}

  static of(univs: { id: number; name: string }[], count: number): ReadUnivBriefResponseDto {
    return new ReadUnivBriefResponseDto(univs, count);
  }
}