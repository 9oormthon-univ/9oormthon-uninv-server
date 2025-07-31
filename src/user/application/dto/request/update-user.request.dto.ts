import { ELinkType } from '../../../../core/enums/link-type.enum';
import { IsNotEmpty, IsOptional, Length } from 'class-validator';
import { Expose } from 'class-transformer';

export class LinkDto {
  @IsNotEmpty({ message: 'type은 필수 값입니다.' })
  @Expose({ name: 'type' })
  type: ELinkType;

  @IsNotEmpty({ message: 'url은 필수 값입니다.' })
  @Expose({ name: 'url' })
  @Length(0, 500)
  url: string;
}


export class UpdateUserRequestDto {
  @IsNotEmpty({ message: 'img_url은 필수 값입니다.' })
  @Expose({ name: 'img_url' })
  @Length(0, 500)
  imgUrl: string;

  @IsNotEmpty({ message: 'introduction은 필수 값입니다.' })
  @Expose({ name: 'introduction' })
  introduction: string;

  @IsOptional()
  @Expose({ name: 'stacks' })
  stacks: string[];

  @IsOptional()
  @Expose({ name: 'links' })
  links: LinkDto[];
}