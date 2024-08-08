import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UsersIdeasDib } from '../entities/users-ideas-dib.entity';

@Injectable()
export class UsersIdeasDibRepository extends Repository<UsersIdeasDib> {}
