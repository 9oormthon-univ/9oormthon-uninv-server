import { TeamModel } from '../../../domain/team.model';
import { MemberModel } from '../../../domain/member.model';

export class MemberDto {
  id: number;
  name: string;
  img_url: string;
  is_leader: boolean;

  constructor(id: number, name: string, img_url: string, is_leader: boolean) {
    this.id = id;
    this.name = name;
    this.img_url = img_url;
    this.is_leader = is_leader;
  }

  static from(member: MemberModel): MemberDto {
    return new MemberDto(member.user.id, member.user.name, member.user.imgUrl, member.isLeader);
  }
}

export class BEInfoDto {
  max_count: number;
  current_count: number;
  members: MemberDto[];

  constructor(max_count: number, current_count: number, members: MemberDto[]) {
    this.max_count = max_count;
    this.current_count = current_count;
    this.members = members;
  }

  static from(team: TeamModel): BEInfoDto {
    return new BEInfoDto(team.beCapacity, team.members.filter(member => member.role === 'BE').length, team.members.filter(member => member.role === 'BE').length !== 0 ? team.members.filter(member => member.role === 'BE').map(MemberDto.from): null);
  }
}

export class FEInfoDto {
  max_count: number;
  current_count: number;
  members: MemberDto[];

  constructor(max_count: number, current_count: number, members: MemberDto[]) {
    this.max_count = max_count;
    this.current_count = current_count;
    this.members = members;
  }

  static from(team: TeamModel): FEInfoDto {
    return new FEInfoDto(team.feCapacity, team.members.filter(member => member.role === 'FE').length, team.members.filter(member => member.role === 'FE').length !== 0 ? team.members.filter(member => member.role === 'FE').map(MemberDto.from) : null);
  }
}

export class PDInfoDto {
  max_count: number;
  current_count: number;
  members: MemberDto[];

  constructor(max_count: number, current_count: number, members: MemberDto[]) {
    this.max_count = max_count;
    this.current_count = current_count;
    this.members = members;
  }

  static from(team: TeamModel): PDInfoDto {
    return new PDInfoDto(team.pdCapacity, team.members.filter(member => member.role === 'PD').length, team.members.filter(member => member.role === 'PD').length !== 0 ? team.members.filter(member => member.role === 'PD').map(MemberDto.from) : null);
  }
}

export class PMInfoDto {
  max_count: number;
  current_count: number;
  members: MemberDto[];

  constructor(max_count: number, current_count: number, members: MemberDto[]) {
    this.max_count = max_count;
    this.current_count = current_count;
    this.members = members;
  }

  static from(team: TeamModel): PMInfoDto {
    return new PMInfoDto(team.pmCapacity, team.members.filter(member => member.role === 'PM').length, team.members.filter(member => member.role === 'PM').length !== 0 ? team.members.filter(member => member.role === 'PM').map(MemberDto.from) : null);
  }
}

export class RoleDto {
  be: BEInfoDto;
  fe: FEInfoDto;
  pd: PDInfoDto;
  pm: PMInfoDto;

  constructor(be: BEInfoDto, fe: FEInfoDto, pd: PDInfoDto, pm: PMInfoDto) {
    this.be = be;
    this.fe = fe;
    this.pd = pd;
    this.pm = pm;
  }

  static of(be: BEInfoDto, fe: FEInfoDto, pd: PDInfoDto, pm: PMInfoDto): RoleDto {
    return new RoleDto(be, fe, pd, pm);
  }
}

export class ReadTeamDetailResponseDto {
  name: string;
  number: number;
  role: RoleDto;

  constructor(name: string, number: number, role: RoleDto) {
    this.name = name;
    this.number = number;
    this.role = role;
  }

  static from(team: TeamModel): ReadTeamDetailResponseDto {
    return new ReadTeamDetailResponseDto(team.name, team.number, RoleDto.of(BEInfoDto.from(team), FEInfoDto.from(team), PDInfoDto.from(team), PMInfoDto.from(team)));
  }
}