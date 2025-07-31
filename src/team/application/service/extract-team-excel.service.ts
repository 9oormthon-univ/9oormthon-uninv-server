import { Borders, Row, Workbook, Worksheet } from 'exceljs';
import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { UserRepository } from '../../../user/repository/user.repository';
import { TeamRepository } from '../../repository/team.repository';
import { DataSource } from 'typeorm';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';
import { TeamModel } from '../../domain/team.model';
import { UserModel } from '../../../user/domain/user.model';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class ExtractTeamExcelService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly teamRepository: TeamRepository,
    private readonly dataSource: DataSource
  ) {}

  async execute(adminId: number, generation: number) {
    return this.dataSource.transaction(async (manager) => {
      const admin = await this.userRepository.findById(adminId, manager);
      if (!admin) throw new CommonException(ErrorCode.NOT_FOUND_USER);
      admin.validateAdminRole();

      const teams = await this.teamRepository.findAllWithMembersAndIdeaByGeneration(generation, manager);
      const users = await this.userRepository.findAllWithUnivAndMembersByGeneration(generation, manager);

      return await this.createExcelFile(teams, users);
    });
  }

  private async createExcelFile(teams: TeamModel[], users: UserModel[]) {
    const workbook = new Workbook();

    const teamSheet = workbook.addWorksheet('팀 기준 팀정보');
    const teamHeader = [
      '팀 번호',
      '팀 명',
      '팀원 명단 (이름/학교/파트(팀장 여부)/전화번호)',
      '아이디어 게시글 링크',
      '아이디어 주제',
    ];
    teamSheet.addRow(teamHeader);
    this.styleHeader(teamSheet.getRow(1));

    for (const team of teams) {
      const teamMembersText = team.members
        .map((member) => {
          const user = member.user;
          const role = member.role;
          const leaderMark = member.isLeader ? ' (팀장)' : '';
          return `${user.name} / ${user.univ.name} / ${role}${leaderMark} / ${user.phoneNumber}`;
        })
        .join('\n');

      const ideaUrl = team.idea?.provider
        ? `https://9oormthon.university/hackathon/detail/${team.idea.id}`
        : null;

      const row = teamSheet.addRow([
        team.number ?? '',
        team.name ?? '',
        teamMembersText,
        '랜덤 팀빌딩',
        team.idea?.ideaSubject?.name ?? '',
      ]);

      if (team.idea?.provider) {
        row.getCell(4).value = {
          text: '[Click!]',
          hyperlink: ideaUrl,
        };
        row.getCell(4).font = { color: { argb: 'FF0000FF' }, underline: true };
      }
    }

    this.autoFitColumns(teamSheet);
    this.applyWrapTextToAllCells(teamSheet);
    this.applyBorders(teamSheet);

    const userSheet = workbook.addWorksheet('미르미 기준 팀정보');
    const userHeader = [
      '참가자명',
      '학교',
      '파트',
      '전화번호',
      '팀 번호',
      '팀 명',
      '팀장 여부',
    ];
    userSheet.addRow(userHeader);
    this.styleHeader(userSheet.getRow(1));

    for (const user of users) {
      const team = teams.find(t => t.members.some(m => m.user.id === user.id));
      const member = team?.members.find(m => m.user.id === user.id);

      userSheet.addRow([
        user.name,
        user.univ.name,
        member?.role ?? ' - ',
        `${user.phoneNumber}`,
        team?.number ?? ' - ',
        team?.name ?? ' - ',
        member ? (member.isLeader ? 'O' : '') : ' - ',
      ]);
    }

    this.autoFitColumns(userSheet);
    this.applyWrapTextToAllCells(userSheet);
    this.applyBorders(userSheet);

    return await workbook.xlsx.writeBuffer();
  }

  private autoFitColumns(worksheet: Worksheet) {
    worksheet.columns.forEach((column) => {
      let maxLength = 10;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const text = cell.value ? cell.value.toString() : '';
        maxLength = Math.max(maxLength, text.length);
      });
      column.width = maxLength + 2;
    });
  }

  private applyWrapTextToAllCells(worksheet: Worksheet) {
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.alignment = {
          ...cell.alignment,
          wrapText: true,
          vertical: 'top',
        };
      });
    });
  }

  private applyBorders(worksheet: Worksheet) {
    const border: Partial<Borders> = {
      top: { style: 'thin' },
      bottom: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
    };

    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.border = border;
      });
    });
  }

  private styleHeader(row: Row) {
    row.eachCell((cell) => {
      cell.font = { bold: true, size: 12 };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFDCE6F1' },
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    });
    row.height = 25;
  }
}
