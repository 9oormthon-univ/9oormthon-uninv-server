import { Univ } from '../../database/entities/univ.entity';

export class UnivDto {
  readonly name: string;
  readonly instagramUrl: string;
  readonly imageUrl: string;
  readonly createdAt: Date;

  static fromEntity(univ: Univ): UnivDto {
    return {
      name: univ.name,
      instagramUrl: univ.instagramUrl,
      imageUrl: univ.imageUrl,
      createdAt: univ.createdAt,
    };
  }
}
