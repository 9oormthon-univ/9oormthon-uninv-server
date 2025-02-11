import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { BookmarkEntity } from '../../core/database/entities/bookmark.entity';

@Injectable()
export class BookmarkRepository extends Repository<BookmarkEntity> {}
