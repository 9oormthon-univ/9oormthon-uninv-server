import { ReadIdeaOverviewUsecase } from '../usecase/read-idea-overview.usecase';
import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { DataSource } from 'typeorm';
import { ReadIdeaOverviewResponseDto } from '../dto/response/read-idea-overview.response.dto';
import { IdeaEntity } from '../../../core/infra/entities/idea.entity';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class ReadIdeaOverviewService implements ReadIdeaOverviewUsecase {
  constructor(
    private readonly dataSource: DataSource
  ) {}

  async execute(
    page: number,
    size: number,
    generation: number,
    subjectId: number | undefined,
    isActive: boolean | undefined,
    isBookmarked: boolean | undefined,
    userId: number,
  ): Promise<ReadIdeaOverviewResponseDto> {
    return this.dataSource.transaction(async (manager) => {

      // 기본 QueryBuilder – 아이디어 엔티티와 아이디어 주제(ideaSubject)를 조인
      const qb = manager.getRepository(IdeaEntity)
        .createQueryBuilder('idea')
        .leftJoinAndSelect('idea.ideaSubject', 'ideaSubject')
        .where('idea.generation = :generation', { generation });

      // subject-id 필터 (제공된 경우)
      if (subjectId) {
        qb.andWhere('ideaSubject.id = :subjectId', { subjectId });
      }

      // 찜(isBookmarked) 필터 처리
      // - 만약 isBookmarked가 true면 inner join을 통해 **내가 찜한** 아이디어만 조회
      // - 그렇지 않으면 left join으로 내 찜 여부를 확인하여 이후 응답에 담음
      if (isBookmarked === true) {
        qb.innerJoin('idea.bookmarks', 'bookmark')
          .innerJoin('bookmark.user', 'bookmarkUser')
          .andWhere('bookmarkUser.id = :userId', { userId });
      } else {
        qb.leftJoin('idea.bookmarks', 'bookmark', 'bookmark.user_id = :userId', { userId });
      }

      // 모집 여부(is_active) 계산 – 서브쿼리로 각 아이디어의 모집 상태를 산출
      qb.addSelect(`
        CASE 
          WHEN NOT EXISTS (
            SELECT 1 FROM teams t WHERE t.idea_id = idea.id
          )
          OR EXISTS (
            SELECT 1 FROM teams t 
            WHERE t.idea_id = idea.id 
              AND (
                t.pm_capacity > (
                  SELECT COUNT(*) FROM members m WHERE m.team_id = t.id AND m.role = 'PM'
                )
             OR t.pd_capacity > (
                  SELECT COUNT(*) FROM members m WHERE m.team_id = t.id AND m.role = 'PD'
                )
             OR t.fe_capacity > (
                  SELECT COUNT(*) FROM members m WHERE m.team_id = t.id AND m.role = 'FE'
                )
             OR t.be_capacity > (
                  SELECT COUNT(*) FROM members m WHERE m.team_id = t.id AND m.role = 'BE'
                )
              )
          )
        THEN true ELSE false END
      `, 'is_active');

      // isActive 필터 조건 적용
      if (typeof isActive === 'boolean') {
        if (isActive === true) {
          // 모집중: 아이디어에 연결된 팀이 없거나, 적어도 한 팀에서 한 직군의 인원수가 capacity보다 작은 경우
          qb.andWhere(`(
            NOT EXISTS (SELECT 1 FROM teams t WHERE t.idea_id = idea.id)
            OR EXISTS (
              SELECT 1 FROM teams t 
              WHERE t.idea_id = idea.id 
                AND (
                  t.pm_capacity > (SELECT COUNT(*) FROM members m WHERE m.team_id = t.id AND m.role = 'PM')
               OR t.pd_capacity > (SELECT COUNT(*) FROM members m WHERE m.team_id = t.id AND m.role = 'PD')
               OR t.fe_capacity > (SELECT COUNT(*) FROM members m WHERE m.team_id = t.id AND m.role = 'FE')
               OR t.be_capacity > (SELECT COUNT(*) FROM members m WHERE m.team_id = t.id AND m.role = 'BE')
                )
            )
          )`);
        } else {
          // 모집완료: 적어도 하나의 팀이 존재하며, 모든 팀에서 각 직군별 capacity가 모두 채워진 경우
          qb.andWhere(`(
            EXISTS (SELECT 1 FROM teams t WHERE t.idea_id = idea.id)
            AND NOT EXISTS (
              SELECT 1 FROM teams t 
              WHERE t.idea_id = idea.id 
                AND (
                  t.pm_capacity > (SELECT COUNT(*) FROM members m WHERE m.team_id = t.id AND m.role = 'PM')
               OR t.pd_capacity > (SELECT COUNT(*) FROM members m WHERE m.team_id = t.id AND m.role = 'PD')
               OR t.fe_capacity > (SELECT COUNT(*) FROM members m WHERE m.team_id = t.id AND m.role = 'FE')
               OR t.be_capacity > (SELECT COUNT(*) FROM members m WHERE m.team_id = t.id AND m.role = 'BE')
                )
            )
          )`);
        }
      }

      // 정렬 및 페이지네이션 적용
      qb.orderBy('idea.createdAt', 'DESC')
        .skip((page - 1) * size)
        .take(size);

      // 전체 아이템 수 (페이징을 위한)
      const totalItems = await qb.getCount();
      // 실제 데이터 조회 (is_active 값 등 raw 데이터도 함께)
      const { entities, raw } = await qb.getRawAndEntities();

      // 각 아이디어별 응답 DTO 구성
      const ideasData = entities.map((idea, index) => {
        const rawRow = raw[index];
        return {
          id: idea.id,
          subject: idea.ideaSubject ? idea.ideaSubject.name : null,
          title: idea.title,
          summary: idea.summary,
          is_active: rawRow.is_active === true || rawRow.is_active === 'true',
          // isBookmarked가 true이면 이미 innerJoin으로 걸러낸 상태이므로 무조건 true,
          // 그렇지 않으면 leftJoin 결과의 bookmark_id 유무로 판단
          is_bookmarked: isBookmarked === true ? true : !!rawRow.bookmark_id,
        };
      });

      const totalPages = Math.ceil(totalItems / size);

      const response: ReadIdeaOverviewResponseDto = {
        success: true,
        data: {
          ideas: ideasData,
          page_info: {
            current_page: page,
            page_size: size,
            total_pages: totalPages,
            total_items: totalItems,
          },
        },
        error: null,
      };

      return response;
    });
  }
}