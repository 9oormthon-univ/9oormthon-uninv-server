import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from 'src/projects/entities/project.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'test',
      password: 'test',
      database: 'test',
      entities: [Project],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Project]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
