import { UserModel } from '../../../../user/domain/user.model';
import { IdeaModel } from '../../../domain/idea.model';
import { ERole } from '../../../../core/enums/role.enum';
import { TeamModel } from '../../../../team/domain/team.model';
import { CommonException } from '../../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../../core/exceptions/error-code';
import { ApplyModel } from '../../../domain/apply.model';

export class ProviderInfoDto {
  id: number;
  name: string;
  univ: string;
  is_provider: boolean;

  constructor(id: number, name: string, univ: string, isProvider: boolean) {
    this.id = id;
    this.name = name;
    this.univ = univ;
    this.is_provider = isProvider;
  }

  static of(model: UserModel, isProvider: boolean): ProviderInfoDto {
    return new ProviderInfoDto(model.id, model.name, model.univ.name, isProvider);
  }
}

export class IdeaInfoDto {
  id: number;
  subject: string;
  title: string;
  is_active: boolean;
  summary: string;
  content: string;
  is_bookmarked: boolean;

  constructor(id: number, subject: string, title: string, isActive: boolean, summary: string, content: string, isBookmarked: boolean) {
    this.id = id;
    this.subject = subject;
    this.title = title;
    this.is_active = isActive;
    this.summary = summary;
    this.content = content;
    this.is_bookmarked = isBookmarked;
  }

  static of(idea: IdeaModel, isBookmarked: boolean, isActive: boolean): IdeaInfoDto {
    return new IdeaInfoDto(idea.id, idea.ideaSubject.name, idea.title, isActive, idea.summary, idea.content, isBookmarked);
  }
}

export class CurrentMemberDto {
  id: number;
  img_url: string;
  name: string;
  univ: string;

  constructor(id: number, imgUrl: string, name: string, univ: string) {
    this.id = id;
    this.img_url = imgUrl;
    this.name = name;
    this.univ = univ;
  }

  static from(model: UserModel): CurrentMemberDto {
    return new CurrentMemberDto(model.id, model.imgUrl, model.name, model.univ.name);
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
          idea.pmRequiredTechStacks, team.members.filter((member) => member.role === ERole.PM).map((member) => CurrentMemberDto.from(member.user)),
          team.pmCapacity !== 0 && applies !== null && applies.filter((apply) => apply.role === ERole.PM).length / team.pmCapacity !== 0 ? (applies.filter((apply) => apply.role === ERole.PM).length / team.pmCapacity).toFixed(2).toString() + ':1' : '-'
        );
      case ERole.PD:
        return new RoleRequirementDto(
          idea.pdRequirement,
          team.members.filter((member) => member.role === ERole.PD).length,
          team.pdCapacity,
          idea.pdRequiredTechStacks,
          team.members.filter((member) => member.role === ERole.PD).map((member) => CurrentMemberDto.from(member.user)),
          team.pdCapacity !== 0 && applies !== null && applies.filter((apply) => apply.role === ERole.PD).length / team.pdCapacity !== 0 ? (applies.filter((apply) => apply.role === ERole.PD).length / team.pdCapacity).toFixed(2).toString() + ':1' : '-'
        );
      case ERole.FE:
        return new RoleRequirementDto(
          idea.feRequirement,
          team.members.filter((member) => member.role === ERole.FE).length,
          team.feCapacity,
          idea.feRequiredTechStacks,
          team.members.filter((member) => member.role === ERole.FE).map((member) => CurrentMemberDto.from(member.user)),
          team.feCapacity !== 0 && applies !== null && applies.filter((apply) => apply.role === ERole.FE).length / team.feCapacity !== 0 ? (applies.filter((apply) => apply.role === ERole.FE).length / team.feCapacity).toFixed(2).toString() + ':1' : '-'
        );
      case ERole.BE:
        return new RoleRequirementDto(
          idea.beRequirement,
          team.members.filter((member) => member.role === ERole.BE).length,
          team.beCapacity,
          idea.beRequiredTechStacks,
          team.members.filter((member) => member.role === ERole.BE).map((member) => CurrentMemberDto.from(member.user)),
          team.beCapacity !== 0 && applies !== null && applies.filter((apply) => apply.role === ERole.BE).length / team.beCapacity !== 0 ? (applies.filter((apply) => apply.role === ERole.BE).length / team.beCapacity).toFixed(2).toString() + ':1' : '-'
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

export class ReadMyIdeaDetailResponseDto {
  provider_info: ProviderInfoDto;
  idea_info: IdeaInfoDto;
  requirements: RequirementsDto;

  constructor(providerInfo: ProviderInfoDto, ideaInfo: IdeaInfoDto, requirements: RequirementsDto) {
    this.provider_info = providerInfo;
    this.idea_info = ideaInfo;
    this.requirements = requirements;
  }

  static of(user: UserModel, idea: IdeaModel, team: TeamModel, isActive: boolean, isBookmarked: boolean, applies: ApplyModel[]): ReadMyIdeaDetailResponseDto {
    return new ReadMyIdeaDetailResponseDto(
      ProviderInfoDto.of(idea.provider, user.id === idea.provider.id),
      IdeaInfoDto.of(idea, isBookmarked, isActive),
      RequirementsDto.of(idea, team, applies)
    );
  }
}