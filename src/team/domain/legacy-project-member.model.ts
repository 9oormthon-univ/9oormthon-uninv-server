import { ProjectModel } from './project.model';

export class LegacyProjectMemberModel {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly role: string,
    public readonly project: ProjectModel,
    public readonly createdAt: Date
  ) {
  }
}