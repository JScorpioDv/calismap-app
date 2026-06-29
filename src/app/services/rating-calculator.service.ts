import { Injectable } from '@angular/core';
import { Exercise, RATING_ORDER, Rating, RatingThresholds } from '../models/exercise.model';

const REFERENCE_BODYWEIGHT = 75; // kg

@Injectable({ providedIn: 'root' })
export class RatingCalculatorService {
  /**
   * Calculates a rating given actual reps, user body weight, and the exercise thresholds.
   * effectiveReps = reps × (bodyWeight / 75kg) — heavier users get credit for the extra load.
   */
  calculate(reps: number, bodyWeight: number, thresholds: RatingThresholds): Rating {
    if (reps <= 0) return 'BRONZE';

    const effective = reps * (bodyWeight / REFERENCE_BODYWEIGHT);

    if (effective >= thresholds.DIAMOND) return 'DIAMOND';
    if (effective >= thresholds.PLATINUM) return 'PLATINUM';
    if (effective >= thresholds.GOLD) return 'GOLD';
    if (effective >= thresholds.SILVER) return 'SILVER';
    return 'BRONZE';
  }

  /** Returns the minimum reps needed (at the given bodyWeight) to reach the target rating. */
  repsNeededFor(targetRating: Rating, bodyWeight: number, thresholds: RatingThresholds): number {
    const threshold = thresholds[targetRating as keyof RatingThresholds] ?? 1;
    const actual = Math.ceil(threshold * (REFERENCE_BODYWEIGHT / bodyWeight));
    return actual;
  }

  /** True if ratingA >= ratingB in the progression order. */
  meetsOrExceeds(ratingA: Rating, ratingB: Rating): boolean {
    return RATING_ORDER.indexOf(ratingA) >= RATING_ORDER.indexOf(ratingB);
  }

  /** Returns the exercise threshold for a given rating (null for BRONZE = 1 rep). */
  getThresholdFor(rating: Rating, thresholds: RatingThresholds): number {
    if (rating === 'BRONZE') return 1;
    return thresholds[rating as keyof RatingThresholds];
  }

  /** Live preview: given the reps typed so far, return what rating they would achieve. */
  preview(reps: number, bodyWeight: number, exercise: Exercise): { rating: Rating; nextRating: Rating | null; repsToNext: number | null } {
    const rating = this.calculate(reps, bodyWeight, exercise.ratingThresholds);
    const nextIndex = RATING_ORDER.indexOf(rating) + 1;
    const nextRating = nextIndex < RATING_ORDER.length ? RATING_ORDER[nextIndex] : null;
    const repsToNext = nextRating ? this.repsNeededFor(nextRating, bodyWeight, exercise.ratingThresholds) - reps : null;
    return { rating, nextRating, repsToNext: repsToNext && repsToNext > 0 ? repsToNext : null };
  }
}
