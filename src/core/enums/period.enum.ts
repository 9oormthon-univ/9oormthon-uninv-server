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
  HACKATHON = 'HACKATHON',
  NONE = 'NONE'
}

export namespace EPeriod {
  export function teamBuildingFromPhase(phase: number): EPeriod {
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

export namespace EPeriod {
  export function confirmationFromPhase(phase: number): EPeriod {
    switch (phase) {
      case 1:
        return EPeriod.PHASE1_CONFIRMATION;
      case 2:
        return EPeriod.PHASE2_CONFIRMATION;
      case 3:
        return EPeriod.PHASE3_CONFIRMATION;
      default:
        throw new CommonException(ErrorCode.NOT_APPLY_ACCEPT_OR_REJECT_PERIOD_ERROR);
    }
  }
}

export namespace EPeriod {
  export function fromPeriod(period: EPeriod): number {
    switch (period) {
      case EPeriod.PHASE1_TEAM_BUILDING:
        return 1;
      case EPeriod.PHASE1_CONFIRMATION:
        return 1;
      case EPeriod.PHASE2_TEAM_BUILDING:
        return 2;
      case EPeriod.PHASE2_CONFIRMATION:
        return 2;
      case EPeriod.PHASE3_TEAM_BUILDING:
        return 3;
      case EPeriod.PHASE3_CONFIRMATION:
        return 3;
      default:
        throw new CommonException(ErrorCode.NOT_IDEA_APPLY_PERIOD_ERROR);
    }
  }
}
