import { EApplyStatus } from '../../../../core/enums/apply-status.enum';
import { ERole } from '../../../../core/enums/role.enum';
import { ApplyModel } from '../../../domain/apply.model';
import { IdeaModel } from '../../../domain/idea.model';


export class ApplyInfoDto {
  id: number;
  status: EApplyStatus;
  ratio: string;
  preference: number;
  motivation: string;
  role: ERole;

  constructor(id: number, status: EApplyStatus, ratio: string, preference: number, motivation: string, role: ERole) {
    this.id = id;
    this.status = status;
    this.ratio = ratio;
    this.preference = preference;
    this.motivation = motivation;
    this.role = role
  }
  static of(apply : ApplyModel, ratio : string): ApplyInfoDto {
    return new ApplyInfoDto(apply.id, apply.status, ratio, apply.preference, apply.motivation, apply.role);
  }
}

export class IdeaInfoDto {
  id: number;
  title: string;

  constructor(id: number, title: string) {
    this.id = id;
    this.title = title;
  }

  static from(idea: IdeaModel): IdeaInfoDto {
    return new IdeaInfoDto(idea.id, idea.title);
  }
}

export class ApplyOverviewDto {
  apply_info: ApplyInfoDto;
  idea_info: IdeaInfoDto;

  constructor(apply_info: ApplyInfoDto, idea_info: IdeaInfoDto) {
    this.apply_info = apply_info;
    this.idea_info = idea_info;
  }

  static of(apply: ApplyModel, ratio: string): ApplyOverviewDto {
    return new ApplyOverviewDto(ApplyInfoDto.of(apply, ratio), IdeaInfoDto.from(apply.idea));
  }
}

export class ReadMyApplyOverviewResponseDto {
  applies: ApplyOverviewDto[];

  constructor(applies: ApplyOverviewDto[]) {
    this.applies = applies;
  }

  static of(applies: ApplyOverviewDto[]): ReadMyApplyOverviewResponseDto {
    return new ReadMyApplyOverviewResponseDto(applies);
  }

}