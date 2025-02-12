export interface UpdateIdeaSubjectIsActiveUseCase {
  execute(userId: number, ideaSubjectId: number): Promise<void>;
}