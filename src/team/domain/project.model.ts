import { TeamModel } from './team.model';

export class ProjectModel {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly content: string,
    public readonly generation: number,
    public readonly award: string,
    public readonly backendLink: string,
    public readonly frontendLink: string,
    public readonly releaseLink: string,
    public readonly imgUrl: string,
    public readonly team: TeamModel,
    public readonly createdAt: Date
  ) {
  }
}