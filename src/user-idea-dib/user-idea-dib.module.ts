import { Module } from '@nestjs/common';
import { UserIdeaDibController } from './user-idea-dib.controller';
import { UserIdeaDibService } from './user-idea-dib.service';
import { UserIdeaDib } from '../database/entities/user-idea-dib.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../database/database.module';
import { UserIdeaDibRepository } from '../database/repositories/user-idea-dib.repository';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([UserIdeaDib, UserIdeaDibRepository]),
  ],
  controllers: [UserIdeaDibController],
  providers: [UserIdeaDibService],
})
export class UserIdeaDibModule {}
