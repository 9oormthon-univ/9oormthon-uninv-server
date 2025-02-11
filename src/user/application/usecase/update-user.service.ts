export interface UpdateUserUseCase {
  execute(userId: number, user: any): Promise<void>;
}