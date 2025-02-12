export class IdeaSubjectModel {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly isActive: boolean,
  ) {}

  static createIdeaSubject(
    name: string,
  ): IdeaSubjectModel {
    return new IdeaSubjectModel(
      null,
      name,
      false
    );
  }
}