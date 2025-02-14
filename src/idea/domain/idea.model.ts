import { UserModel } from '../../user/domain/user.model';
import { IdeaSubjectModel } from './idea-subject.model';

export class IdeaModel {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly summary: string,
    public readonly content: string,
    public readonly generation: number,
    public readonly pmRequirement?: string,
    public readonly pmRequiredTechStacks?: string[],
    public readonly pdRequirement?: string,
    public readonly pdRequiredTechStacks?: string[],
    public readonly feRequirement?: string,
    public readonly feRequiredTechStacks?: string[],
    public readonly beRequirement?: string,
    public readonly beRequiredTechStacks?: string[],
    public readonly provider?: UserModel,
    public readonly ideaSubject?: IdeaSubjectModel,
    public readonly createdAt?: Date
  ) {}

  static createIdea(
    title: string,
    summary: string,
    content: string,
    generation: number,
    pmRequirements: string,
    pmRequiredTechStacks: string[],
    pdRequirements: string,
    pdRequiredTechStacks: string[],
    feRequirements: string,
    feRequiredTechStacks: string[],
    beRequirements: string,
    beRequiredTechStacks: string[],
    provider: UserModel,
    ideaSubject: IdeaSubjectModel
  ): IdeaModel {
    return new IdeaModel(
      null,
      title,
      summary,
      content,
      generation,
      pmRequirements,
      pmRequiredTechStacks,
      pdRequirements,
      pdRequiredTechStacks,
      feRequirements,
      feRequiredTechStacks,
      beRequirements,
      beRequiredTechStacks,
      provider,
      ideaSubject,
      new Date()
    );
  }
}
