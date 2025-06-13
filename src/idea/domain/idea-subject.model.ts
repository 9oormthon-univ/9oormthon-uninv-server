export class IdeaSubjectModel {
  constructor(
    public readonly id: number,
    public readonly generation: number,
    public readonly name: string,
    public readonly isActive: boolean,
  ) {}

  static createIdeaSubject(
    generation: number,
    name: string,
  ): IdeaSubjectModel {
    return new IdeaSubjectModel(
      null,
      generation,
      name,
      true
    );
  }

  public isActiveToggle(): IdeaSubjectModel {
    return new IdeaSubjectModel(
      this.id,
      this.generation,
      this.name,
      !this.isActive
    );
  }
}