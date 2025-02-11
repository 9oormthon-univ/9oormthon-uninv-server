export class ReissueJwtTokenResponseDto {
  accessToken: string;
  refreshToken: string;

  constructor(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  static of(accessToken: string, refreshToken: string): ReissueJwtTokenResponseDto {
    return new ReissueJwtTokenResponseDto(accessToken, refreshToken);
  }
}
