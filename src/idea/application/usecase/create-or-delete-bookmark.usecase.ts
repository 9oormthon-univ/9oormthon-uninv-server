export interface CreateOrDeleteBookmarkUseCase {
  execute(userId: number, ideaId: number): Promise<void>;
}