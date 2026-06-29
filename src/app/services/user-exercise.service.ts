import { Injectable } from '@angular/core';
import { UserExercise } from '../models/user-exercise.model';
import { StorageService } from './storage.service';

const KEY = 'calismap_user_exercises';

@Injectable({ providedIn: 'root' })
export class UserExerciseService {
  constructor(private storage: StorageService) {}

  getAll(): UserExercise[] {
    return this.storage.get<UserExercise[]>(KEY) ?? [];
  }

  getByExerciseId(exerciseId: string): UserExercise | null {
    return this.getAll().find(ue => ue.exerciseId === exerciseId) ?? null;
  }

  /** Save or update the max reps for an exercise. Rating is computed externally. */
  saveMaxReps(exerciseId: string, maxRepetitions: number, maxWeight: number): void {
    const all = this.getAll();
    const idx = all.findIndex(ue => ue.exerciseId === exerciseId);
    const now = new Date().toISOString();

    if (idx >= 0) {
      all[idx] = {
        ...all[idx],
        maxRepetitions: Math.max(all[idx].maxRepetitions, maxRepetitions),
        maxWeight: Math.max(all[idx].maxWeight, maxWeight),
        lastDateUsed: now,
      };
    } else {
      all.push({ id: crypto.randomUUID(), exerciseId, maxRepetitions, maxWeight, dateCreated: now, lastDateUsed: now });
    }

    this.storage.set(KEY, all);
  }

  delete(exerciseId: string): void {
    this.storage.set(KEY, this.getAll().filter(ue => ue.exerciseId !== exerciseId));
  }
}
