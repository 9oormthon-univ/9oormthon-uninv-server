import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { UpdateUserRequestDto } from '../dto/request/update-user.request.dto';
import { UserModel } from '../../domain/user.model';
import { DataSource } from 'typeorm';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';
import { UserRepository } from '../../repository/user.repository';
import { LinkRepository } from '../../repository/link.repository';
import { LinkModel } from '../../domain/link.model';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class UpdateUserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly linkRepository: LinkRepository,
    private readonly dataSource: DataSource
  ) {}

  async execute(userId: number, requestDto:UpdateUserRequestDto) {
    return this.dataSource.transaction(async (manager) => {

      // 유저 조회
      const user : UserModel = await this.userRepository.findByIdWithLinks(userId, manager);
      if(user === null) {
        throw new CommonException(ErrorCode.NOT_FOUND_USER);
      }

      // 기존에 존재하던 링크 조회 및 삭제
      const existedLinks = await this.linkRepository.findByUserId(userId, manager); // nullable
      if (existedLinks && existedLinks.length > 0) {
        await this.linkRepository.deleteAllByUserId(userId, manager);
      }

      // 새로운 링크 생성
      let links = [];
      if (requestDto.links) {
        links = requestDto.links.map((link) => {
          return LinkModel.createLink(
            link.type,
            link.url,
            user
          );
        });
      }

      // 링크 저장
      if (links && links.length > 0) {
        links = await this.linkRepository.saveAll(links, manager);
      } else {
        links = [];
      }

      const updatedUser = user.updateUser(
        requestDto.img_url,
        requestDto.introduction,
        requestDto.stacks,
        links
      );
      await this.userRepository.save(updatedUser, manager);
    });
  }
}
