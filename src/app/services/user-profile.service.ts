import { Injectable } from '@angular/core';
import { DEFAULT_PROFILE, UserProfile } from '../models/user-profile.model';
import { StorageService } from './storage.service';

const KEY = 'calismap_user_profile';

@Injectable({ providedIn: 'root' })
export class UserProfileService {
  constructor(private storage: StorageService) {}

  get(): UserProfile {
    return this.storage.get<UserProfile>(KEY) ?? { ...DEFAULT_PROFILE };
  }

  save(profile: Partial<UserProfile>): void {
    this.storage.set(KEY, { ...this.get(), ...profile });
  }

  getBodyWeight(): number {
    return this.get().bodyWeight;
  }
}
