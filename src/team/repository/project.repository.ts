import { DataSource, EntityManager } from 'typeorm';
import { ProjectModel } from '../domain/project.model';
import { ProjectEntity } from '../../core/infra/entities/project.entity';
import { ProjectMapper } from '../../core/infra/mapper/project.mapper';

export class ProjectRepository {
  constructor(private readonly dataSource: DataSource) {}

  async findById(id: number, manager?: EntityManager): Promise<ProjectModel | undefined> {
    const repo = manager ? manager.getRepository(ProjectEntity) : this.dataSource.getRepository(ProjectEntity);

    const project = await repo.findOne({
      where: { id },
    });
    return project ? ProjectMapper.toDomain(project) : undefined;
  }

  async findByTeamId(teamId: number, manager?: EntityManager): Promise<ProjectModel | undefined> {
    const repo = manager ? manager.getRepository(ProjectEntity) : this.dataSource.getRepository(ProjectEntity);

    const project = await repo.findOne({
      where: { team: { id: teamId } },
    });
    return project ? ProjectMapper.toDomain(project) : undefined;
  }

  async save(project: ProjectModel, manager? : EntityManager) : Promise<void> {
    const repo = manager ? manager.getRepository(ProjectEntity) : this.dataSource.getRepository(ProjectEntity);

    await repo.save(ProjectMapper.toEntity(project));
  }
}