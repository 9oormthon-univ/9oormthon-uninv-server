import { IdeaSubjectModel } from '../../../domain/idea-subject.model';

export class ideaSubjectDto {
  id : number;
  name : string;
  is_active : boolean;

  constructor(id: number, name: string, is_active: boolean) {
    this.id = id;
    this.name = name;
    this.is_active = is_active;
  }

  static from(idea_subject: IdeaSubjectModel): ideaSubjectDto {
    return new ideaSubjectDto(idea_subject.id, idea_subject.name, idea_subject.isActive);
  }
}


export class ReadIdeaSubjectBriefResponseDto {
  idea_subjects: ideaSubjectDto[];

  constructor(idea_subjects: ideaSubjectDto[]) {
    this.idea_subjects = idea_subjects;
  }

  static from(idea_subjects: IdeaSubjectModel[]): ReadIdeaSubjectBriefResponseDto {
    return new ReadIdeaSubjectBriefResponseDto(idea_subjects.map(idea_subject => ideaSubjectDto.from(idea_subject)));
  }
}