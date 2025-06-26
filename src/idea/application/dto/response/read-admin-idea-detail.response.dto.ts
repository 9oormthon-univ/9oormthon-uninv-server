import { UserModel } from '../../../../user/domain/user.model';
import { IdeaModel } from '../../../domain/idea.model';
import { ERole } from '../../../../core/enums/role.enum';
import { TeamModel } from '../../../../team/domain/team.model';
import { CommonException } from '../../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../../core/exceptions/error-code';
import { ApplyModel } from '../../../domain/apply.model';
import { MemberModel } from '../../../../team/domain/member.model';
import { ETeamStatus } from '../../../../core/enums/team-status.enum';

export class SubjectInfoDto {
  id: number;
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

  static of(model: IdeaModel): SubjectInfoDto {
    return new SubjectInfoDto(model.ideaSubject.id, model.ideaSubject.name);
  }
}

export class ProviderInfoDto {
  id: number;
  description: string;

  constructor(id: number, description: string) {
    this.id = id;
    this.description = description;
  }

  static of(model: UserModel): ProviderInfoDto {
    return new ProviderInfoDto(model.id, model.name + '/' + model.univ.name + '/' + model.phoneNumber);
  }
}

export class IdeaInfoDto {
  id: number;
  title: string;
  team_building: ETeamStatus;
  summary: string;
  content: string;

  constructor(
    id: number,
    title: string,
    teamBuilding: ETeamStatus,
    summary: string,
    content: string
  ) {
    this.id = id;
    this.title = title;
    this.team_building = teamBuilding;
    this.summary = summary;
    this.content = content;
  }
  static of(idea: IdeaModel): IdeaInfoDto {
    return new IdeaInfoDto(
      idea.id,
      idea.title,
      idea.team.status,
      idea.summary,
      idea.content
    );
  }
}

export class CurrentMemberDto {
  id: number;
  img_url: string;
  name: string;
  univ: string;
  is_leader: boolean;

  constructor(id: number, imgUrl: string, name: string, univ: string, isLeader: boolean) {
    this.id = id;
    this.img_url = imgUrl;
    this.name = name;
    this.univ = univ;
    this.is_leader = isLeader;
  }

  static from(model: MemberModel): CurrentMemberDto {
    return new CurrentMemberDto(model.user.id, model.user.imgUrl, model.user.name, model.user.univ.name, model.isLeader);
  }
}

export class RoleRequirementDto {
  requirement?: string | null;
  current_count: number;
  max_count: number;
  required_tech_stacks?: string[];
  current_members: CurrentMemberDto[];
  ratio: string;

  constructor(requirement: string | null, current_count: number, max_count: number, requiredTechStacks: string[], currentMembers: CurrentMemberDto[], ratio: string) {
    this.requirement = requirement;
    this.current_count = current_count;
    this.max_count = max_count;
    this.required_tech_stacks = requiredTechStacks;
    this.current_members = currentMembers;
    this.ratio = ratio;
  }

  static of(idea: IdeaModel, team: TeamModel, role: ERole, applies: ApplyModel[]) : RoleRequirementDto {
    switch (role) {
      case ERole.PM:
        return new RoleRequirementDto(
          idea.pmRequirement,
          team.members.filter((member) => member.role === ERole.PM).length,
          team.pmCapacity,
          idea.pmRequiredTechStacks, team.members.filter((member) => member.role === ERole.PM).map((member) => CurrentMemberDto.from(member)),
          team.pmCapacity == 0 ? '0:0' : (applies !== null && applies.filter((apply) => apply.role === ERole.PM).length / team.pmCapacity !== 0 ? (applies.filter((apply) => apply.role === ERole.PM).length / team.pmCapacity).toFixed(2).toString() + ':1' : '0:1')
        );
      case ERole.PD:
        return new RoleRequirementDto(
          idea.pdRequirement,
          team.members.filter((member) => member.role === ERole.PD).length,
          team.pdCapacity,
          idea.pdRequiredTechStacks,
          team.members.filter((member) => member.role === ERole.PD).map((member) => CurrentMemberDto.from(member)),
          team.pdCapacity == 0 ? '0:0' : (applies !== null && applies.filter((apply) => apply.role === ERole.PD).length / team.pdCapacity !== 0 ? (applies.filter((apply) => apply.role === ERole.PD).length / team.pdCapacity).toFixed(2).toString() + ':1' : '0:1')
        );
      case ERole.FE:
        return new RoleRequirementDto(
          idea.feRequirement,
          team.members.filter((member) => member.role === ERole.FE).length,
          team.feCapacity,
          idea.feRequiredTechStacks,
          team.members.filter((member) => member.role === ERole.FE).map((member) => CurrentMemberDto.from(member)),
          team.feCapacity == 0 ? '0:0' : (applies !== null && applies.filter((apply) => apply.role === ERole.FE).length / team.feCapacity !== 0 ? (applies.filter((apply) => apply.role === ERole.FE).length / team.feCapacity).toFixed(2).toString() + ':1' : '0:1')
        );
      case ERole.BE:
        return new RoleRequirementDto(
          idea.beRequirement,
          team.members.filter((member) => member.role === ERole.BE).length,
          team.beCapacity,
          idea.beRequiredTechStacks,
          team.members.filter((member) => member.role === ERole.BE).map((member) => CurrentMemberDto.from(member)),
          team.beCapacity == 0 ? '0:0' : (applies !== null && applies.filter((apply) => apply.role === ERole.BE).length / team.beCapacity !== 0 ? (applies.filter((apply) => apply.role === ERole.BE).length / team.beCapacity).toFixed(2).toString() + ':1' : '0:1')
        );
      default:
        throw new CommonException(ErrorCode.NOT_FOUND_ENUM);
    }
  }
}

export class RequirementsDto {
  pm: RoleRequirementDto;
  pd: RoleRequirementDto;
  fe: RoleRequirementDto;
  be: RoleRequirementDto;

  constructor(pm: RoleRequirementDto, pd: RoleRequirementDto, fe: RoleRequirementDto, be: RoleRequirementDto) {
    this.pm = pm;
    this.pd = pd;
    this.fe = fe;
    this.be = be;
  }

  static of(idea: IdeaModel, team: TeamModel, applies: ApplyModel[]): RequirementsDto {
    return new RequirementsDto(
      RoleRequirementDto.of(idea, team, ERole.PM, applies),
      RoleRequirementDto.of(idea, team, ERole.PD, applies),
      RoleRequirementDto.of(idea, team, ERole.FE, applies),
      RoleRequirementDto.of(idea, team, ERole.BE, applies),
    );
  }
}

export class ReadAdminIdeaDetailResponseDto {
  subject_info: SubjectInfoDto;
  provider_info: ProviderInfoDto;
  idea_info: IdeaInfoDto;
  requirements: RequirementsDto;

  constructor(subjectInfo: SubjectInfoDto, providerInfo: ProviderInfoDto, ideaInfo: IdeaInfoDto, requirements: RequirementsDto) {
    this.subject_info = subjectInfo;
    this.provider_info = providerInfo;
    this.idea_info = ideaInfo;
    this.requirements = requirements;
  }

  static of(idea: IdeaModel, team: TeamModel, applies: ApplyModel[]): ReadAdminIdeaDetailResponseDto {
    return new ReadAdminIdeaDetailResponseDto(
      SubjectInfoDto.of(idea),
      ProviderInfoDto.of(idea.provider),
      IdeaInfoDto.of(idea),
      RequirementsDto.of(idea, team, applies)
    );
  }
}