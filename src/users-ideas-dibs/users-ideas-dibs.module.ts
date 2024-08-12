import { Module } from '@nestjs/common';
import { UsersIdeasDibsController } from './users-ideas-dibs.controller';
import { UsersIdeasDibsService } from './users-ideas-dibs.service';
import { UsersIdeasDib } from '../database/entities/users-ideas-dib.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../database/database.module';
import { UsersIdeasDibRepository } from '../database/repositories/users-ideas-dib.repository';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([UsersIdeasDib, UsersIdeasDibRepository]),
  ],
  controllers: [UsersIdeasDibsController],
  providers: [UsersIdeasDibsService],
})
export class UsersIdeasDibsModule {}
