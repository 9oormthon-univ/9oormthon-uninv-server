export class CreateProjectDto {
  readonly award: string;
  readonly title: string;
  readonly content: string;
  readonly backendLink: string;
  readonly frontendLink: string;
  readonly releaseLink: string;
  readonly image: string;
  readonly pm: string;
  readonly design: string;
  readonly frontend: string[];
  readonly backend: string[];
}

// 예시 데이터

// const BeotkkotProject2024Data = [
//     {
//       award: '대상',
//       title: '소동',
//       content: '소상공인을 위한 마케팅 AI 파트너',
//       backendLink: 'https://github.com/goormthon-Univ/2024_BEOTKKOTTHON_TEAM_27_BE_1',
//       frontendLink: 'https://github.com/goormthon-Univ/2024_BEOTKKOTTHON_TEAM_27_FE',
//       releaseLink: 'https://sodong.pages.dev/',
//       image: Team27,
//       pm: '최시현',
//       design: '최아리',
//       frontend: ['이가영, 김유신'],
//       backend: ['정찬호, 양채린'],
//     },
