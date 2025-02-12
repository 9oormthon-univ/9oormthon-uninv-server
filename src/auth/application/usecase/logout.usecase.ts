export interface LogoutUseCase {
  execute(refreshToken: string): Promise<void>;
}