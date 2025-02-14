import { IdeaModel } from '../../idea/domain/idea.model';
import { MemberModel } from './member.model';

export class TeamModel {
  constructor(
    public readonly id: number,
    public readonly name: string | null,
    public readonly number: number | null,
    public readonly generation: number,
    public readonly pmCapacity: number,
    public readonly pdCapacity: number,
    public readonly feCapacity: number,
    public readonly beCapacity: number,
    public readonly idea: IdeaModel,
    public readonly members: MemberModel[],
    public readonly createdAt: Date
  ) {}

  static createTeam(
    name: string | null,
    number: number | null,
    generation: number,
    pmCapacity: number,
    pdCapacity: number,
    feCapacity: number,
    beCapacity: number,
    idea: IdeaModel
  ): TeamModel {
    return new TeamModel(
      null,
      name,
      number,
      generation,
      pmCapacity,
      pdCapacity,
      feCapacity,
      beCapacity,
      idea,
      [],
      new Date()
    );
  }
}