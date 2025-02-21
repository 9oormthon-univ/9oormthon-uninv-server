export class UpdateUserRequestDto {
  constructor(
    public readonly img_url: string,
    public readonly introduction: string,
    public readonly stacks: string[],
    public readonly links: string[]
  ) {}
}