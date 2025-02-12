export interface SignUpUseCase {
  execute(userId: number, file: Express.Multer.File): Promise<void>;
}