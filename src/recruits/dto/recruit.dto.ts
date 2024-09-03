import { Recruit } from '../../database/entities/recruit.entity';

export class RecruitDto {
  readonly id: number;
  readonly type: number;
  readonly content: string;
  readonly dDay: string;
  readonly contentDay: string;
  readonly startAt: Date;
  readonly endAt: Date;

  static fromEntity(recruit: Recruit): RecruitDto {
    const todayUTC = new Date();
    const today = new Date(todayUTC.getTime() + 9 * 60 * 60 * 1000);
    const startAt = new Date(recruit.startAt);
    const endAt = new Date(recruit.endAt);

    let dDay: number;
    let content: string;
    let contentDay: Date;

    // 만약 오늘 날짜가 모집 시작일보다 이전이라면, 모집 시작일까지의 D-Day를 계산
    if (today < startAt) {
      dDay = Math.floor(
        (startAt.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
      );
      content = recruit.title + ' 시작';
      contentDay = startAt;
    }
    // 오늘 날짜가 모집 시작일을 지났다면, 모집 종료일까지의 D-Day를 계산
    else if (today >= startAt && today <= endAt) {
      dDay = Math.floor(
        (endAt.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
      );
      contentDay = endAt;
      content = recruit.title + ' 마감';
    }

    return {
      id: recruit.id,
      type: recruit.type,
      content: content,
      dDay: dDay === 0 ? 'D-Day' : 'D-' + dDay.toString(),
      contentDay: this.formatDate(contentDay),
      startAt: startAt,
      endAt: endAt,
    };
  }
  private static formatDate(iDate: Date): string {
    const date = new Date(iDate.getTime() - 9 * 60 * 60 * 1000);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // 월은 0부터 시작하므로 +1 필요
    const day = ('0' + date.getDate()).slice(-2);
    const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
    const dayOfWeek = weekDays[date.getDay()];
    const hours = ('0' + date.getHours()).slice(-2);
    console.log(date.getHours());
    const minutes = ('0' + date.getMinutes()).slice(-2);

    return `${year}.${month}.${day}(${dayOfWeek}) ${hours}:${minutes}`;
  }
}
