import { IdeaModel } from '../../idea/domain/idea.model';
import { MemberModel } from './member.model';
import { CommonException } from '../../core/exceptions/common.exception';
import { ErrorCode } from '../../core/exceptions/error-code';

export class TeamModel {
  constructor(
    public readonly id: number,
    public readonly name: string | null,
    public readonly number: number | null,
    public readonly generation: number,
    public readonly pmCapacity: number,
    public readonly pdCapacity: number,
    public readonly feCapacity: number,
    public readonly beCapacity: number,
    public readonly idea: IdeaModel,
    public readonly members: MemberModel[],
    public readonly createdAt: Date
  ) {}

  static createTeam(
    name: string | null,
    number: number | null,
    generation: number,
    pmCapacity: number,
    pdCapacity: number,
    feCapacity: number,
    beCapacity: number,
    idea: IdeaModel
  ): TeamModel {
    return new TeamModel(
      null,
      name,
      number,
      generation,
      pmCapacity,
      pdCapacity,
      feCapacity,
      beCapacity,
      idea,
      [],
      new Date()
    );
  }

  public validateCapacity(): void {
    const totalCapacity = this.pmCapacity + this.pdCapacity + this.feCapacity + this.beCapacity;
    if (totalCapacity !== this.members.length) {
      throw new CommonException(ErrorCode.TOTAL_CAPACITY_ERROR);
    }

    if (this.pmCapacity > 1) {
      throw new CommonException(ErrorCode.PM_CAPACITY_ERROR);
    }

    if (this.pdCapacity > 1) {
      throw new CommonException(ErrorCode.PD_CAPACITY_ERROR);
    }

    if (this.feCapacity > 3) {
      throw new CommonException(ErrorCode.FE_CAPACITY_ERROR);
    }

    if (this.beCapacity > 3) {
      throw new CommonException(ErrorCode.BE_CAPACITY_ERROR);
    }
  }
}