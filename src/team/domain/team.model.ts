import { IdeaModel } from '../../idea/domain/idea.model';
import { MemberModel } from './member.model';
import { CommonException } from '../../core/exceptions/common.exception';
import { ErrorCode } from '../../core/exceptions/error-code';
import { ERole } from '../../core/enums/role.enum';

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

  public validateSystemCapacityLimits(): void {

    const MAX_PM_CAPACITY = 1;
    const MAX_PD_CAPACITY = 1;
    const MAX_FE_CAPACITY = 3;
    const MAX_BE_CAPACITY = 3;
    const MAX_TOTAL_CAPACITY = 6;

    const totalCapacity = this.pmCapacity + this.pdCapacity + this.feCapacity + this.beCapacity;
    if (totalCapacity > MAX_TOTAL_CAPACITY) {
      throw new CommonException(ErrorCode.TOTAL_CAPACITY_ERROR);
    }

    if (this.pmCapacity > MAX_PM_CAPACITY) {
      throw new CommonException(ErrorCode.PM_CAPACITY_ERROR);
    }

    if (this.pdCapacity > MAX_PD_CAPACITY) {
      throw new CommonException(ErrorCode.PD_CAPACITY_ERROR);
    }

    if (this.feCapacity > MAX_FE_CAPACITY) {
      throw new CommonException(ErrorCode.FE_CAPACITY_ERROR);
    }

    if (this.beCapacity > MAX_BE_CAPACITY) {
      throw new CommonException(ErrorCode.BE_CAPACITY_ERROR);
    }
  }

  public validateTeamCapacityLimits(role: ERole): void {
    switch (role) {
      case 'PM':
        if (this.pmCapacity <= this.members.map(member => member.role).filter(role => role === 'PM').length) {
          throw new CommonException(ErrorCode.CLOSED_APPLY_ERROR);
        }
        break;
      case 'PD':
        if (this.pdCapacity <= this.members.map(member => member.role).filter(role => role === 'PD').length) {
          throw new CommonException(ErrorCode.CLOSED_APPLY_ERROR);
        }
        break;
      case 'FE':
        if (this.feCapacity <= this.members.map(member => member.role).filter(role => role === 'FE').length) {
          throw new CommonException(ErrorCode.CLOSED_APPLY_ERROR);
        }
        break;
      case 'BE':
        if (this.beCapacity <= this.members.map(member => member.role).filter(role => role === 'BE').length) {
          throw new CommonException(ErrorCode.CLOSED_APPLY_ERROR);
        }
        break;
      default:
        throw new CommonException(ErrorCode.INVALID_ROLE);
    }
  }
}