import { ELinkType } from '../../core/enums/link-type.enum';
import { UserModel } from './user.model';

export class LinkModel {
  constructor(
    public readonly id: number,
    public readonly type: ELinkType,
    public readonly url: string,
    public readonly user: UserModel
  ) {}

  static createLink(
    type: ELinkType,
    url: string,
    user: UserModel
  ) : LinkModel {
    return new LinkModel(
      null,
      type,
      url,
      user
    );
  }
}