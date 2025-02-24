import { ELinkType } from '../../../../core/enums/link-type.enum';

export class LinkDto {
  constructor(
    public readonly type: ELinkType,
    public readonly url: string
  ) {}
}


export class UpdateUserRequestDto {
  constructor(
    public readonly img_url: string,
    public readonly introduction: string,
    public readonly stacks: string[],
    public readonly links: LinkDto[],
  ) {}
}