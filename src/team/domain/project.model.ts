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

  static createProject(
    name: string,
    content: string,
    generation: number,
    award: string,
    backendLink: string,
    frontendLink: string,
    releaseLink: string,
    imgUrl: string,
    team: TeamModel
  ): ProjectModel {
    return new ProjectModel(
      null,
      name,
      content,
      generation,
      award,
      backendLink,
      frontendLink,
      releaseLink,
      imgUrl,
      team,
      new Date()
    );
  }

  public updateName(
    name: string
  ): ProjectModel {
    return new ProjectModel(
      this.id,
      name,
      this.content,
      this.generation,
      this.award,
      this.backendLink,
      this.frontendLink,
      this.releaseLink,
      this.imgUrl,
      this.team,
      this.createdAt
    )
  }
}