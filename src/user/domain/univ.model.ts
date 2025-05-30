import { UserModel } from './user.model';

export class UnivModel {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly instagramUrl: string | null,
    public readonly generation: number,
    public readonly leader: UserModel,
    public readonly createdAt: Date
  ) {}

  static createUniv(
    name: string,
    instagramUrl: string | null,
    generation: number
  ) : UnivModel {
    return new UnivModel(
      null,
      name,
      instagramUrl,
      generation,
      null,
      new Date()
    );
  }

  static updateUniv(
    univ: UnivModel,
    name: string,
    instagramUrl: string | null,
    leader: UserModel
  ) : UnivModel {
    return new UnivModel(
      univ.id,
      name,
      instagramUrl,
      univ.generation,
      leader,
      univ.createdAt
    );
  }
}