import { DataSource } from 'typeorm';
import { BookmarkRepository } from '../../repository/bookmark.repository';
import { IdeaRepository } from '../../repository/idea.repository';
import { UserRepository } from '../../../user/repository/user.repository';
import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';
import { BookmarkModel } from '../../domain/bookmark.model';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class CreateOrDeleteBookmarkService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly ideaRepository: IdeaRepository,
    private readonly bookmarkRepository: BookmarkRepository,
    private readonly dataSource: DataSource,
  ) {}

  async execute(userId: number, ideaId: number) : Promise<void> {
    return this.dataSource.transaction(async (manager) => {
      const user = await this.userRepository.findById(userId, manager);
      if (!user) {
        throw new CommonException(ErrorCode.NOT_FOUND_USER);
      }

      const idea = await this.ideaRepository.findById(ideaId, manager);
      if (!idea) {
        throw new CommonException(ErrorCode.NOT_FOUND_IDEA);
      }

      if (idea.provider.id === user.id) {
        throw new CommonException(ErrorCode.CANNOT_BOOKMARK_MY_IDEA_ERROR);
      }

      const bookmark = await this.bookmarkRepository.findByUserIdAndIdeaId(userId, ideaId, manager);
      if (bookmark) {
        await this.bookmarkRepository.delete(bookmark, manager);
      } else {
        const newBookmark = BookmarkModel.createBookmark(user, idea);
        await this.bookmarkRepository.save(newBookmark, manager);
      }
    });
  }
}