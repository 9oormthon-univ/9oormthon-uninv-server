import { UserModel } from '../../user/domain/user.model';
import { IdeaSubjectModel } from './idea-subject.model';

export class IdeaModel {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly summary: string,
    public readonly content: string,
    public readonly generation: number,
    public readonly pmRequirements?: string,
    public readonly pmRequiredTechStacks?: string[],
    public readonly pdRequirements?: string,
    public readonly pdRequiredTechStacks?: string[],
    public readonly feRequirements?: string,
    public readonly feRequiredTechStacks?: string[],
    public readonly beRequirements?: string,
    public readonly beRequiredTechStacks?: string[],
    public readonly provider?: UserModel,
    public readonly ideaSubject?: IdeaSubjectModel,
    public readonly createdAt?: Date
  ) {}
}
