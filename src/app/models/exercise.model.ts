export type Level = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
export type Rating = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND';
export type ExerciseCategory = 'PUSH' | 'PULL' | 'CORE' | 'LEGS' | 'STATIC' | 'MOBILITY';
export type RepUnit = 'reps' | 'seconds';

export const RATING_ORDER: Rating[] = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND'];

export interface RatingThresholds {
  SILVER: number;
  GOLD: number;
  PLATINUM: number;
  DIAMOND: number;
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  level: Level;
  category: ExerciseCategory;
  muscleGroups: string[];
  steps: string[];
  repUnit: RepUnit;
  ratingThresholds: RatingThresholds;
}
