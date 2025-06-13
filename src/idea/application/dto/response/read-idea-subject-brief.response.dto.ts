import { IdeaSubjectModel } from '../../../domain/idea-subject.model';

export class ideaSubjectDto {
  id : number;
  name : string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

  static from(idea_subject: IdeaSubjectModel): ideaSubjectDto {
    return new ideaSubjectDto(idea_subject.id, idea_subject.name);
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