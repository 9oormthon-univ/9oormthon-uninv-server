import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { LinkEntity } from '../../core/infra/entities/link.entity';
import { LinkModel } from '../domain/link.model';
import { LinkMapper } from '../../core/infra/mapper/link.mapper';

@Injectable()
export class LinkRepository {
  constructor(private readonly dataSource: DataSource) {}

  async findByUserId(userId: number, manager?: EntityManager): Promise<LinkModel[]> {
    const repo = manager ? manager.getRepository(LinkEntity) : this.dataSource.getRepository(LinkEntity);
    const entities = await repo.find({
      where: { user: { id : userId } },
    });
    return entities ? LinkMapper.toDomains(entities) : null;
  }

  async save(link: LinkModel, manager?: EntityManager): Promise<LinkModel> {
    const repo = manager ? manager.getRepository(LinkEntity) : this.dataSource.getRepository(LinkEntity);

    return LinkMapper.toDomain(await repo.save(LinkMapper.toEntity(link)));
  }

  async saveAll(links: LinkModel[], manager?: EntityManager): Promise<LinkModel[]> {
    const repo = manager ? manager.getRepository(LinkEntity) : this.dataSource.getRepository(LinkEntity);

    return LinkMapper.toDomains(await repo.save(links.map((link) => LinkMapper.toEntity(link))));
  }

  async deleteAllByUserId(userId: number, manager?: EntityManager): Promise<void> {
    const repo = manager ? manager.getRepository(LinkEntity) : this.dataSource.getRepository(LinkEntity);
    await repo.delete({ user: { id: userId } });
  }
}