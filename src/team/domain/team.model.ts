import { IdeaModel } from '../../idea/domain/idea.model';

export class TeamModel {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly number: number,
    public readonly generation: number,
    public readonly pmCapacity: number,
    public readonly pdCapacity: number,
    public readonly feCapacity: number,
    public readonly beCapacity: number,
    public readonly idea: IdeaModel,
    public readonly createdAt: Date
  ) {}
}