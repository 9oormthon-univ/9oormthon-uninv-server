import { TeamModel } from '../../../domain/team.model';
import { ETeamStatus } from '../../../../core/enums/team-status.enum';

export class ReadAdminTeamDetailResponseDto {
  id: number;
  number: number;
  team_name: string;
  pm_capacity: number;
  pd_capacity: number;
  fe_capacity: number;
  be_capacity: number;
  service_name: string;
  idea_id: number | null;
  leader: {
    id: number;
    description: string;
  };
  team_building: ETeamStatus;

  constructor(
    id: number,
    number: number,
    team_name: string,
    pm_capacity: number,
    pd_capacity: number,
    fe_capacity: number,
    be_capacity: number,
    service_name: string,
    idea_id: number | null,
    leader: { id: number; description: string },
    team_building: ETeamStatus
  ) {
    this.id = id;
    this.number = number;
    this.team_name = team_name;
    this.pm_capacity = pm_capacity;
    this.pd_capacity = pd_capacity;
    this.fe_capacity = fe_capacity;
    this.be_capacity = be_capacity;
    this.service_name = service_name;
    this.idea_id = idea_id;
    this.leader = leader;
    this.team_building = team_building;
  }

  static from(team: TeamModel): ReadAdminTeamDetailResponseDto {
    const leader = team.members.filter((member) => member.isLeader)[0];

    return new ReadAdminTeamDetailResponseDto(
      team.id,
      team.number ? team.number : 0,
      team.name ? team.name : '',
      team.pmCapacity,
      team.pdCapacity,
      team.feCapacity,
      team.beCapacity,
      team.project ? team.project.name : '',
      team.idea ? team.idea.id : null,
      leader ? { id: leader.user.id, description: leader.user.name + ' / ' + leader.user.univ.name + ' / ' + leader.user.phoneNumber } : { id: 0, description: '' },
      team.status
    );
  }
}