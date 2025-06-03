export class ReadUserBriefResponseDto {
  constructor(
    public readonly users: {
      id: number;
      description: string;
    }[]
  ) {}
  static of(users: { id: number; description: string }[]): ReadUserBriefResponseDto {
    return new ReadUserBriefResponseDto(users);
  }
}