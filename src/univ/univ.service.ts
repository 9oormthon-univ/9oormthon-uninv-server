import { Injectable, Logger, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { UnivRepository } from '../database/repositories/univ.repository';
import { Univ } from '../database/entities/univ.entity';
import { CommonException } from '../common/exceptions/common.exception';
import { ErrorCode } from '../common/exceptions/error-code';
import { UnivDto } from './dto/univ.dto';
import { CreateUnivDto } from './dto/create-univ.dto';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { Transaction } from 'typeorm';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class UnivService {
  private s3: AWS.S3;
  private logger = new Logger('HTTP');
  constructor(private readonly univRepository: UnivRepository) {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
  }

  async getAllUnivs(): Promise<UnivDto[]> {
    const univs: Univ[] = await this.univRepository.find();
    if (univs === undefined || univs.length === 0) {
      throw new CommonException(ErrorCode.NOT_FOUND_UNIV);
    }
    return univs.map((univ) => UnivDto.fromEntity(univ));
  }

  async getAllUnivsByName(name: string): Promise<UnivDto[]> {
    const univs: Univ[] = await this.univRepository.findByName(name);
    if (univs === undefined || univs.length === 0) {
      throw new CommonException(ErrorCode.NOT_FOUND_UNIV);
    }
    return univs.map((univ) => UnivDto.fromEntity(univ));
  }

  async createUniv(
    createUnivDto: CreateUnivDto,
    file: Express.Multer.File,
  ): Promise<void> {
    if (!file) {
      throw new CommonException(ErrorCode.INVALID_FILE);
    }

    const uploadResult = await this.uploadUnivImageFileToS3(file);

    const univ = this.univRepository.create({
      name: createUnivDto.name,
      instagramUrl: createUnivDto.instagramUrl,
      imageUrl: uploadResult.Location,
    });

    await this.univRepository.save(univ);
  }
  public async deleteUniv(id: number): Promise<void> {
    const univ = await this.univRepository.findOne({ where: { id } });
    if (!univ) {
      throw new CommonException(ErrorCode.NOT_FOUND_UNIV);
    }
    await this.univRepository.remove(univ);
  }

  private async uploadUnivImageFileToS3(
    file: Express.Multer.File,
  ): Promise<AWS.S3.ManagedUpload.SendData> {
    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `univ/${file.originalname}-${uuidv4()}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    return this.s3.upload(uploadParams).promise();
  }
}
