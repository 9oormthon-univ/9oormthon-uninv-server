export class UpdateUserRequestDto {
  constructor(
    public readonly introduction: string,
    public readonly stacks: string[],
    public readonly links: string[]
  ) {}
}