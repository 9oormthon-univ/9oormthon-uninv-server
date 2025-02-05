import { Module } from '@nestjs/common';
import { BookmarkController } from './bookmark.controller';
import { BookmarkService } from './bookmark.service';
import { Bookmark } from '../database/entities/bookmark.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../database/database.module';
import { BookmarkRepository } from '../database/repositories/bookmark.repository';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Bookmark, BookmarkRepository]),
  ],
  controllers: [BookmarkController],
  providers: [BookmarkService],
})
export class BookmarkModule {}
