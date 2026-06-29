import { Exercise, ExerciseCategory, Rating } from './exercise.model';
import { UserExercise } from './user-exercise.model';

export interface Roadmap {
  id: string;
  name: string;
  description: string;
  targetExerciseId: string;
  category: ExerciseCategory;
}

export interface RoadmapExercise {
  id: string;
  roadmapId: string;
  exerciseId: string;
  stepOrder: number;
  minRatingRequired: Rating | null; // null = step 1, always accessible
}

export interface RoadmapStepViewModel {
  stepOrder: number;
  exercise: Exercise;
  isTarget: boolean;
  isUnlocked: boolean;
  isCompleted: boolean;
  rating: Rating | null;
  userExercise: UserExercise | null;
}

export interface RoadmapDetailViewModel {
  roadmap: Roadmap;
  targetExercise: Exercise;
  steps: RoadmapStepViewModel[];
  completedCount: number;
  totalCount: number;
}
