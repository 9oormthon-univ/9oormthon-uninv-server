export class UnivModel {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly instagramUrl: string | null,
    public readonly imgUrl: string | null,
    public readonly createdAt: Date
  ) {}
}