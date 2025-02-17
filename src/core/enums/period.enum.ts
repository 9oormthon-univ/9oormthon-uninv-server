import { CommonException } from '../exceptions/common.exception';
import { ErrorCode } from '../exceptions/error-code';

export enum EPeriod {
  IDEA_SUBMISSION = 'IDEA_SUBMISSION',
  PHASE1_TEAM_BUILDING = 'PHASE1_TEAM_BUILDING',
  PHASE1_CONFIRMATION = 'PHASE1_CONFIRMATION',
  PHASE2_TEAM_BUILDING = 'PHASE2_TEAM_BUILDING',
  PHASE2_CONFIRMATION = 'PHASE2_CONFIRMATION',
  PHASE3_TEAM_BUILDING = 'PHASE3_TEAM_BUILDING',
  PHASE3_CONFIRMATION = 'PHASE3_CONFIRMATION',
  NONE = 'NONE'
}

export namespace EPeriod {
  export function fromPhase(phase: number): EPeriod {
    switch (phase) {
      case 1:
        return EPeriod.PHASE1_TEAM_BUILDING;
      case 2:
        return EPeriod.PHASE2_TEAM_BUILDING;
      case 3:
        return EPeriod.PHASE3_TEAM_BUILDING;
      default:
        throw new CommonException(ErrorCode.NOT_IDEA_APPLY_PERIOD_ERROR);
    }
  }
}
