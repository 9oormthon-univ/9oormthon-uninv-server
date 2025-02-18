import { DataSource, EntityManager } from 'typeorm';
import { IdeaSubjectModel } from '../domain/idea-subject.model';
import { IdeaSubjectEntity } from '../../core/infra/entities/idea-subject.entity';
import { IdeaSubjectMapper } from '../../core/infra/mapper/idea-subject.mapper';

export class IdeaSubjectRepository {
  constructor(private readonly dataSource: DataSource) {}

  async findAll(manager?: EntityManager): Promise<IdeaSubjectModel[]> {
    const repo = manager ? manager.getRepository(IdeaSubjectEntity) : this.dataSource.getRepository(IdeaSubjectEntity);

    const entities = await repo.find();

    return IdeaSubjectMapper.toDomains(entities);
  }

  async findById(id: number, manager?: EntityManager): Promise<IdeaSubjectModel | null> {
    const repo = manager ? manager.getRepository(IdeaSubjectEntity) : this.dataSource.getRepository(IdeaSubjectEntity);

    const entity = await repo.findOne({
      where: { id },
    });

    return entity ? IdeaSubjectMapper.toDomain(entity) : null;
  }

  async save(ideaSubject: IdeaSubjectModel, manager?: EntityManager): Promise<void> {
    const repo = manager ? manager.getRepository(IdeaSubjectEntity) : this.dataSource.getRepository(IdeaSubjectEntity);

    await repo.save(IdeaSubjectMapper.toEntity(ideaSubject));
  }

  async delete(id: number, manager?: EntityManager): Promise<void> {
    const repo = manager ? manager.getRepository(IdeaSubjectEntity) : this.dataSource.getRepository(IdeaSubjectEntity);

    await repo.delete(id);
  }
}