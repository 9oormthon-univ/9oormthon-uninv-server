import { IdeaModel } from '../../idea/domain/idea.model';
import { MemberModel } from './member.model';
import { CommonException } from '../../core/exceptions/common.exception';
import { ErrorCode } from '../../core/exceptions/error-code';
import { ERole } from '../../core/enums/role.enum';
import { ETeamStatus } from '../../core/enums/team-status.enum';
import { ProjectModel } from './project.model';

export class TeamModel {
  static readonly MAX_PM_CAPACITY = 1;
  static readonly MAX_PD_CAPACITY = 1;
  static readonly MAX_FE_CAPACITY = 3;
  static readonly MAX_BE_CAPACITY = 3;
  static readonly MAX_TOTAL_CAPACITY = 6;
  static readonly MIN_TOTAL_CAPACITY = 3;
  constructor(
    public readonly id: number,
    public readonly name: string | null,
    public readonly number: number | null,
    public readonly generation: number,
    public readonly pmCapacity: number,
    public readonly pdCapacity: number,
    public readonly feCapacity: number,
    public readonly beCapacity: number,
    public readonly status: ETeamStatus,
    public readonly idea: IdeaModel,
    public readonly project: ProjectModel,
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
    teamStatus: ETeamStatus,
    idea: IdeaModel,
    project: ProjectModel
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
      teamStatus,
      idea,
      project,
      [],
      new Date()
    );
  }

  public updateByAdmin(
    name: string,
    number: number,
    pmCapacity: number,
    pdCapacity: number,
    feCapacity: number,
    beCapacity: number,
  ): TeamModel {
    return new TeamModel(
      this.id,
      name,
      number,
      this.generation,
      pmCapacity,
      pdCapacity,
      feCapacity,
      beCapacity,
      this.status,
      this.idea,
      this.project,
      this.members,
      this.createdAt
    );
  }

  public updateName(
    name: string
  ) : TeamModel {
    return new TeamModel(
      this.id,
      name,
      this.number,
      this.generation,
      this.pmCapacity,
      this.pdCapacity,
      this.feCapacity,
      this.beCapacity,
      this.status,
      this.idea,
      this.project,
      this.members,
      this.createdAt
    );
  }

  public validateSystemCapacityLimits(): void {

    const totalCapacity = this.pmCapacity + this.pdCapacity + this.feCapacity + this.beCapacity;
    if (totalCapacity > TeamModel.MAX_TOTAL_CAPACITY) {
      throw new CommonException(ErrorCode.MAX_TOTAL_CAPACITY_ERROR);
    }

    if (totalCapacity < TeamModel.MIN_TOTAL_CAPACITY) {
      throw new CommonException(ErrorCode.MIN_TOTAL_CAPACITY_ERROR);
    }

    if (this.pmCapacity > TeamModel.MAX_PM_CAPACITY) {
      throw new CommonException(ErrorCode.PM_CAPACITY_ERROR);
    }

    if (this.pdCapacity > TeamModel.MAX_PD_CAPACITY) {
      throw new CommonException(ErrorCode.PD_CAPACITY_ERROR);
    }

    if (this.feCapacity > TeamModel.MAX_FE_CAPACITY) {
      throw new CommonException(ErrorCode.FE_CAPACITY_ERROR);
    }

    if (this.beCapacity > TeamModel.MAX_BE_CAPACITY) {
      throw new CommonException(ErrorCode.BE_CAPACITY_ERROR);
    }
  }

  public validateCreateOrUpdateTeamCapacityLimits(role: ERole): void {
    switch (role) {
      case 'PM':
        if (this.pmCapacity < this.members.map(member => member.role).filter(role => role === 'PM').length) {
          throw new CommonException(ErrorCode.CLOSED_APPLY_ERROR);
        }
        break;
      case 'PD':
        if (this.pdCapacity < this.members.map(member => member.role).filter(role => role === 'PD').length) {
          throw new CommonException(ErrorCode.CLOSED_APPLY_ERROR);
        }
        break;
      case 'FE':
        if (this.feCapacity < this.members.map(member => member.role).filter(role => role === 'FE').length) {
          throw new CommonException(ErrorCode.CLOSED_APPLY_ERROR);
        }
        break;
      case 'BE':
        if (this.beCapacity < this.members.map(member => member.role).filter(role => role === 'BE').length) {
          throw new CommonException(ErrorCode.CLOSED_APPLY_ERROR);
        }
        break;
      default:
        throw new CommonException(ErrorCode.INVALID_ROLE);
    }
  }

  public validateApplyTeamCapacityLimits(role: ERole): void {
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

  public updateCapacity(
    pmCapacity: number,
    pdCapacity: number,
    feCapacity: number,
    beCapacity: number
  ): TeamModel {
    return new TeamModel(
      this.id,
      this.name,
      this.number,
      this.generation,
      pmCapacity,
      pdCapacity,
      feCapacity,
      beCapacity,
      this.status,
      this.idea,
      this.project,
      this.members,
      this.createdAt
    );
  }

  public updateStatus(
    status: ETeamStatus
  ): TeamModel {
    return new TeamModel(
      this.id,
      this.name,
      this.number,
      this.generation,
      this.pmCapacity,
      this.pdCapacity,
      this.feCapacity,
      this.beCapacity,
      status,
      this.idea,
      this.project,
      this.members,
      this.createdAt
    )
  }

  public updateNumber(
    number: number
  ): TeamModel {
    return new TeamModel(
      this.id,
      this.name,
      number,
      this.generation,
      this.pmCapacity,
      this.pdCapacity,
      this.feCapacity,
      this.beCapacity,
      this.status,
      this.idea,
      this.project,
      this.members,
      this.createdAt
    );
  }
}