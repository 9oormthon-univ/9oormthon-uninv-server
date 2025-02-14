import { UserModel } from '../../../../user/domain/user.model';
import { IdeaModel } from '../../../domain/idea.model';
import { ERole } from '../../../../core/enums/role.enum';
import { TeamModel } from '../../../../team/domain/team.model';
import { CommonException } from '../../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../../core/exceptions/error-code';

export class ProviderInfoDto {
  id: number;
  name: string;
  univ: string;

  constructor(id: number, name: string, univ: string) {
    this.id = id;
    this.name = name;
    this.univ = univ;
  }

  static from(model: UserModel): ProviderInfoDto {
    return new ProviderInfoDto(model.id, model.name, model.univ.name);
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
  img_url: string;
  name: string;
  univ: string;

  constructor(imgUrl: string, name: string, univ: string) {
    this.img_url = imgUrl;
    this.name = name;
    this.univ = univ;
  }

  static from(model: UserModel): CurrentMemberDto {
    return new CurrentMemberDto(model.imgUrl, model.name, model.univ.name);
  }
}

export class RoleRequirementDto {
  requirement?: string | null;
  capacity: string;
  required_tech_stacks?: string[];
  current_members: CurrentMemberDto[];

  constructor(requirement: string | null, capacity: string, requiredTechStacks: string[], currentMembers: CurrentMemberDto[]) {
    this.requirement = requirement;
    this.capacity = capacity;
    this.required_tech_stacks = requiredTechStacks;
    this.current_members = currentMembers;
  }

  static of(idea: IdeaModel, team: TeamModel, role: ERole) : RoleRequirementDto {
    switch (role) {
      case ERole.PM:
        return new RoleRequirementDto(idea.pmRequirement, team.pmCapacity.toString(), idea.pmRequiredTechStacks, team.members.filter((member) => member.role === ERole.PM).map((member) => CurrentMemberDto.from(member.user)));
      case ERole.PD:
        return new RoleRequirementDto(idea.pdRequirement, team.pdCapacity.toString(), idea.pdRequiredTechStacks, team.members.filter((member) => member.role === ERole.PD).map((member) => CurrentMemberDto.from(member.user)));
      case ERole.FE:
        return new RoleRequirementDto(idea.feRequirement, team.feCapacity.toString(), idea.feRequiredTechStacks, team.members.filter((member) => member.role === ERole.FE).map((member) => CurrentMemberDto.from(member.user)));
      case ERole.BE:
        return new RoleRequirementDto(idea.beRequirement, team.beCapacity.toString(), idea.beRequiredTechStacks, team.members.filter((member) => member.role === ERole.BE).map((member) => CurrentMemberDto.from(member.user)));
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

  static of(idea: IdeaModel, team: TeamModel): RequirementsDto {
    return new RequirementsDto(
      RoleRequirementDto.of(idea, team, ERole.PM),
      RoleRequirementDto.of(idea, team, ERole.PD),
      RoleRequirementDto.of(idea, team, ERole.FE),
      RoleRequirementDto.of(idea, team, ERole.BE),
    );
  }
}

export class ReadIdeaDetailResponseDto {
  provider_info: ProviderInfoDto;
  idea_info: IdeaInfoDto;
  requirements: RequirementsDto;
  is_provider: boolean;

  constructor(providerInfo: ProviderInfoDto, ideaInfo: IdeaInfoDto, requirements: RequirementsDto, isProvider: boolean) {
    this.provider_info = providerInfo;
    this.idea_info = ideaInfo;
    this.requirements = requirements;
    this.is_provider = isProvider;
  }

  static of(user: UserModel, idea: IdeaModel, team: TeamModel, isActive: boolean, isBookmarked: boolean): ReadIdeaDetailResponseDto {
    return new ReadIdeaDetailResponseDto(
      ProviderInfoDto.from(idea.provider),
      IdeaInfoDto.of(idea, isBookmarked, isActive),
      RequirementsDto.of(idea, team),
      user.id === idea.provider.id
    );
  }
}