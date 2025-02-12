export class JwtTokenResponseDto {
  accessToken: string;
  refreshToken: string;

  constructor(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  static of(accessToken: string, refreshToken: string): JwtTokenResponseDto {
    return new JwtTokenResponseDto(accessToken, refreshToken);
  }
}
