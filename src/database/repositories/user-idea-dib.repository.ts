import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserIdeaDib } from '../entities/user-idea-dib.entity';

@Injectable()
export class UserIdeaDibRepository extends Repository<UserIdeaDib> {}
