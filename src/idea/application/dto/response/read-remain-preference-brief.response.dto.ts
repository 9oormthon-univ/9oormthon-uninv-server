import { ApplyModel } from '../../../domain/apply.model';

export class PreferenceDto {
  number: number;
  is_active: boolean;

  constructor(number: number, is_active: boolean) {
    this.number = number;
    this.is_active = is_active;
  }

  static of (models: ApplyModel[], maxPreferencesPerUser: number): PreferenceDto[] {
    const preferences = Array.from({ length: maxPreferencesPerUser }, (_, i) => i + 1);
    return preferences.map(preference => {
      const isActive = models.some(model => !(model.preference === preference));
      return new PreferenceDto(preference, isActive);
    });
  }
}

export class ReadRemainPreferenceBriefResponseDto {
  preferences: PreferenceDto[];

  constructor(preferences: PreferenceDto[]) {
    this.preferences = preferences;
  }

  static of(models: ApplyModel[], maxPreferencesPerUser: number): ReadRemainPreferenceBriefResponseDto {
    return new ReadRemainPreferenceBriefResponseDto(PreferenceDto.of(models, maxPreferencesPerUser));
  }

}