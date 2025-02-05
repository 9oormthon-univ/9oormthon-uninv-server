import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Bookmark } from '../entities/bookmark.entity';

@Injectable()
export class BookmarkRepository extends Repository<Bookmark> {}
