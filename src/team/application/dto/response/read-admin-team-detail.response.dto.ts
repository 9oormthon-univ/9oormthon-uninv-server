import { TeamModel } from '../../../domain/team.model';

export class ReadAdminTeamDetailResponseDto {
  id: number;
  number: number;
  team_name: string;
  pm_capacity: number;
  pd_capacity: number;
  fe_capacity: number;
  be_capacity: number;
  service_name: string;
  leader: {
    id: number;
    description: string;
  }

  constructor(
    id: number,
    number: number,
    team_name: string,
    pm_capacity: number,
    pd_capacity: number,
    fe_capacity: number,
    be_capacity: number,
    service_name: string,
    leader: { id: number; description: string }
  ) {
    this.id = id;
    this.number = number;
    this.team_name = team_name;
    this.pm_capacity = pm_capacity;
    this.pd_capacity = pd_capacity;
    this.fe_capacity = fe_capacity;
    this.be_capacity = be_capacity;
    this.service_name = service_name;
    this.leader = leader;
  }

  static from(team: TeamModel): ReadAdminTeamDetailResponseDto {
    return new ReadAdminTeamDetailResponseDto(
      team.id,
      team.number ? team.number : 0,
      team.name ? team.name : '',
      team.pmCapacity,
      team.pdCapacity,
      team.feCapacity,
      team.beCapacity,
      team.project ? team.project.name : '',
      { id: 0, description: '' } // TODO: 팀장 정보로 바꿔야함
    )
  }
}