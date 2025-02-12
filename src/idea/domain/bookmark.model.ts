import { UserModel } from '../../user/domain/user.model';
import { IdeaModel } from './idea.model';

export class BookmarkModel {
  constructor(
    public readonly id: number,
    public readonly user: UserModel,
    public readonly idea: IdeaModel,
    public readonly createdAt: Date
  ) {}

  static createBookmark(user: UserModel, idea: IdeaModel): BookmarkModel {
    return new BookmarkModel(
      null,
      user,
      idea,
      new Date()
    );
  }
}