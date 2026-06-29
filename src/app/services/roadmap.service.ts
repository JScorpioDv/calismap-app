import { Injectable } from '@angular/core';
import { Exercise, ExerciseCategory, Rating } from '../models/exercise.model';
import { Roadmap, RoadmapDetailViewModel, RoadmapExercise, RoadmapStepViewModel } from '../models/roadmap.model';
import { RatingCalculatorService } from './rating-calculator.service';
import { UserExerciseService } from './user-exercise.service';
import { UserProfileService } from './user-profile.service';

// ─── Mock exercises ───────────────────────────────────────────────────────────

const EXERCISES: Exercise[] = [
  {
    id: 'ex-1',
    name: 'Australian Pull-up',
    description: 'A horizontal pulling movement performed with a bar at waist height. Keep your body in a straight line and pull your chest to the bar.',
    level: 'BEGINNER',
    category: 'PULL',
    muscleGroups: ['Back', 'Biceps', 'Core'],
    repUnit: 'reps',
    ratingThresholds: { SILVER: 10, GOLD: 20, PLATINUM: 30, DIAMOND: 40 },
    steps: [
      'Set a bar at waist height (smith machine, barbell on rack, or rings).',
      'Hang under the bar with straight arms, body in a straight line from heels to head.',
      'Pull your chest to the bar, squeezing your shoulder blades together at the top.',
      'Lower yourself with control back to the starting position.',
    ],
  },
  {
    id: 'ex-2',
    name: 'Pull-up',
    description: 'A vertical pulling movement. Hang from a bar with an overhand grip and pull yourself up until your chin clears the bar.',
    level: 'INTERMEDIATE',
    category: 'PULL',
    muscleGroups: ['Back', 'Biceps', 'Core'],
    repUnit: 'reps',
    ratingThresholds: { SILVER: 5, GOLD: 10, PLATINUM: 15, DIAMOND: 20 },
    steps: [
      'Hang from a bar with an overhand grip, slightly wider than shoulder-width.',
      'Retract your shoulder blades and engage your core.',
      'Pull yourself up until your chin is above the bar.',
      'Lower with control — do not drop suddenly.',
    ],
  },
  {
    id: 'ex-3',
    name: 'Chest-to-Bar Pull-up',
    description: 'A pull-up variation where you pull higher until your chest touches the bar, building the lat and upper-back strength needed for Muscle Ups.',
    level: 'ADVANCED',
    category: 'PULL',
    muscleGroups: ['Back', 'Biceps', 'Core', 'Shoulders'],
    repUnit: 'reps',
    ratingThresholds: { SILVER: 3, GOLD: 7, PLATINUM: 12, DIAMOND: 15 },
    steps: [
      'Start in a dead hang with overhand grip.',
      'Pull explosively, driving your elbows down and back.',
      'Continue pulling until your chest contacts the bar.',
      'Lower with full control back to dead hang.',
    ],
  },
  {
    id: 'ex-4',
    name: 'Muscle Up',
    description: 'The king of pulling exercises. Combine a pull-up with a dip to get from below the bar to above it in one fluid movement.',
    level: 'EXPERT',
    category: 'PULL',
    muscleGroups: ['Back', 'Biceps', 'Triceps', 'Core', 'Shoulders'],
    repUnit: 'reps',
    ratingThresholds: { SILVER: 2, GOLD: 5, PLATINUM: 8, DIAMOND: 12 },
    steps: [
      'Start with a false grip on the bar (wrists draped over, not under).',
      'Generate a slight kip to build momentum.',
      'Pull explosively — think chest-to-bar with maximum aggression.',
      'At the top of the pull, shoot your hips forward and transition your torso above the bar.',
      'Push into a straight-arm support position and lock out.',
    ],
  },
  {
    id: 'ex-5',
    name: 'Pike Push-up',
    description: 'A push-up in a pike position (hips high). Mimics the pressing angle of a handstand push-up, building shoulder strength safely.',
    level: 'BEGINNER',
    category: 'PUSH',
    muscleGroups: ['Shoulders', 'Triceps', 'Core'],
    repUnit: 'reps',
    ratingThresholds: { SILVER: 8, GOLD: 15, PLATINUM: 25, DIAMOND: 35 },
    steps: [
      'Start in a push-up position. Walk your feet towards your hands until your hips are high in the air.',
      'Your body should form an inverted V shape, head looking towards your feet.',
      'Bend your elbows to lower your head towards the floor between your hands.',
      'Push back up to the starting position by straightening your arms.',
    ],
  },
  {
    id: 'ex-6',
    name: 'Wall Handstand Hold',
    description: 'Build handstand balance and shoulder stability against a wall. Essential for developing the body tension for handstand push-ups.',
    level: 'INTERMEDIATE',
    category: 'STATIC',
    muscleGroups: ['Shoulders', 'Core', 'Forearms'],
    repUnit: 'seconds',
    ratingThresholds: { SILVER: 15, GOLD: 30, PLATINUM: 60, DIAMOND: 90 },
    steps: [
      'Face the wall and place your hands 10–15 cm from the base.',
      'Kick up into a handstand with your chest facing the wall.',
      'Stack your hips over your shoulders and ankles over your hips.',
      'Squeeze your glutes, core and quads hard. Hold for time.',
    ],
  },
  {
    id: 'ex-7',
    name: 'Handstand Push-up',
    description: 'A vertical pressing movement performed in a handstand. Requires maximum shoulder strength and body control.',
    level: 'ADVANCED',
    category: 'PUSH',
    muscleGroups: ['Shoulders', 'Triceps', 'Core'],
    repUnit: 'reps',
    ratingThresholds: { SILVER: 3, GOLD: 7, PLATINUM: 10, DIAMOND: 15 },
    steps: [
      'Kick up into a wall handstand with hands about 15 cm from the wall.',
      'Lower your head towards the floor with control, elbows tracking slightly forward.',
      'Stop when the top of your head lightly touches the floor.',
      'Press back up to full lockout and repeat.',
    ],
  },
  {
    id: 'ex-8',
    name: 'Squat',
    description: 'The foundational lower-body movement. Builds leg strength, joint mobility, and coordination as a base for all advanced leg work.',
    level: 'BEGINNER',
    category: 'LEGS',
    muscleGroups: ['Quads', 'Glutes', 'Core'],
    repUnit: 'reps',
    ratingThresholds: { SILVER: 20, GOLD: 40, PLATINUM: 60, DIAMOND: 100 },
    steps: [
      'Stand with feet shoulder-width apart, toes pointing slightly outward.',
      'Brace your core and keep your chest tall throughout.',
      'Push your knees out in line with your toes as you lower your hips.',
      'Descend until your thighs are at least parallel to the floor.',
      'Drive through your heels to return to standing.',
    ],
  },
  {
    id: 'ex-9',
    name: 'Bulgarian Split Squat',
    description: 'A single-leg squat with the rear foot elevated. Builds unilateral leg strength and reveals any left-right imbalances.',
    level: 'INTERMEDIATE',
    category: 'LEGS',
    muscleGroups: ['Quads', 'Glutes', 'Core'],
    repUnit: 'reps',
    ratingThresholds: { SILVER: 8, GOLD: 15, PLATINUM: 25, DIAMOND: 35 },
    steps: [
      'Stand 60–90 cm in front of a bench and place your rear foot on it.',
      'Lower your back knee towards the floor, keeping your front shin as vertical as possible.',
      'Your front knee should track over your middle toe.',
      'Press through your front heel to return to the start. Complete all reps then switch legs.',
    ],
  },
  {
    id: 'ex-10',
    name: 'Pistol Squat',
    description: 'A full single-leg squat with the non-working leg extended forward. The ultimate test of leg strength, balance, and ankle mobility.',
    level: 'EXPERT',
    category: 'LEGS',
    muscleGroups: ['Quads', 'Glutes', 'Core', 'Ankle'],
    repUnit: 'reps',
    ratingThresholds: { SILVER: 3, GOLD: 7, PLATINUM: 12, DIAMOND: 20 },
    steps: [
      'Stand on one leg, extending the other leg straight out in front of you.',
      'Lower your hips by bending your standing knee, keeping your heel firmly on the floor.',
      'Keep your extended leg parallel to the floor and your torso as upright as possible.',
      'Go as deep as possible without the heel lifting.',
      'Drive through your heel to stand back up. Switch legs.',
    ],
  },
];

// ─── Mock roadmaps ────────────────────────────────────────────────────────────

const ROADMAPS: Roadmap[] = [
  { id: 'rm-1', name: 'Muscle Up', description: 'Progress from horizontal rows to the king of bar movements.', targetExerciseId: 'ex-4', category: 'PULL' },
  { id: 'rm-2', name: 'Handstand Push-up', description: 'Build the shoulder strength and body control for vertical pressing.', targetExerciseId: 'ex-7', category: 'PUSH' },
  { id: 'rm-3', name: 'Pistol Squat', description: 'Develop unilateral leg strength, balance, and full-range mobility.', targetExerciseId: 'ex-10', category: 'LEGS' },
];

// minRatingRequired: rating needed on the PREVIOUS step to unlock THIS step.
// null = step 1, always accessible.
const ROADMAP_EXERCISES: RoadmapExercise[] = [
  { id: 're-1', roadmapId: 'rm-1', exerciseId: 'ex-1', stepOrder: 1, minRatingRequired: null },
  { id: 're-2', roadmapId: 'rm-1', exerciseId: 'ex-2', stepOrder: 2, minRatingRequired: 'SILVER' },
  { id: 're-3', roadmapId: 'rm-1', exerciseId: 'ex-3', stepOrder: 3, minRatingRequired: 'GOLD' },
  { id: 're-4', roadmapId: 'rm-2', exerciseId: 'ex-5', stepOrder: 1, minRatingRequired: null },
  { id: 're-5', roadmapId: 'rm-2', exerciseId: 'ex-6', stepOrder: 2, minRatingRequired: 'SILVER' },
  { id: 're-6', roadmapId: 'rm-3', exerciseId: 'ex-8', stepOrder: 1, minRatingRequired: null },
  { id: 're-7', roadmapId: 'rm-3', exerciseId: 'ex-9', stepOrder: 2, minRatingRequired: 'SILVER' },
];

// ─── Service ──────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class RoadmapService {
  constructor(
    private userExerciseService: UserExerciseService,
    private ratingCalc: RatingCalculatorService,
    private userProfileService: UserProfileService,
  ) {}

  getAllRoadmaps(): { roadmap: Roadmap; targetExercise: Exercise; completedCount: number; totalCount: number; category: ExerciseCategory }[] {
    const userExerciseMap = this.buildUserExerciseMap();

    return ROADMAPS.map(roadmap => {
      const steps = this.getStepsForRoadmap(roadmap.id);
      const targetExercise = EXERCISES.find(e => e.id === roadmap.targetExerciseId)!;
      const completedCount = steps.filter(s => userExerciseMap.has(s.exerciseId)).length;

      return { roadmap, targetExercise, completedCount, totalCount: steps.length, category: roadmap.category };
    });
  }

  getRoadmapDetail(roadmapId: string): RoadmapDetailViewModel | null {
    const roadmap = ROADMAPS.find(r => r.id === roadmapId);
    if (!roadmap) return null;

    const targetExercise = EXERCISES.find(e => e.id === roadmap.targetExerciseId)!;
    const steps = this.getStepsForRoadmap(roadmapId).sort((a, b) => a.stepOrder - b.stepOrder);
    const userExerciseMap = this.buildUserExerciseMap();
    const bodyWeight = this.userProfileService.getBodyWeight();

    // Build a helper: given a step, what rating does the user currently have?
    const getUserRating = (exerciseId: string): Rating | null => {
      const ue = userExerciseMap.get(exerciseId);
      if (!ue) return null;
      const ex = EXERCISES.find(e => e.id === exerciseId)!;
      return this.ratingCalc.calculate(ue.maxRepetitions, bodyWeight, ex.ratingThresholds);
    };

    const stepViewModels: RoadmapStepViewModel[] = steps.map((re, index) => {
      const exercise = EXERCISES.find(e => e.id === re.exerciseId)!;
      const userExercise = userExerciseMap.get(re.exerciseId) ?? null;
      const currentRating = getUserRating(re.exerciseId);
      const isCompleted = currentRating !== null;

      // Step is unlocked if:
      // - it's step 1 (no minRatingRequired)
      // - OR the previous step's rating meets minRatingRequired
      let isUnlocked = re.minRatingRequired === null;
      if (!isUnlocked && index > 0) {
        const prevRating = getUserRating(steps[index - 1].exerciseId);
        if (prevRating && re.minRatingRequired) {
          isUnlocked = this.ratingCalc.meetsOrExceeds(prevRating, re.minRatingRequired);
        }
      }

      return { stepOrder: re.stepOrder, exercise, isTarget: false, isUnlocked, isCompleted, rating: currentRating, userExercise };
    });

    // Add target exercise as the final node — unlocks when last step reaches GOLD
    const lastStep = steps[steps.length - 1];
    const lastRating = getUserRating(lastStep.exerciseId);
    const goalUnlocked = lastRating ? this.ratingCalc.meetsOrExceeds(lastRating, 'GOLD') : false;
    const goalUserExercise = userExerciseMap.get(targetExercise.id) ?? null;
    const goalRating = getUserRating(targetExercise.id);

    stepViewModels.push({
      stepOrder: steps.length + 1,
      exercise: targetExercise,
      isTarget: true,
      isUnlocked: goalUnlocked,
      isCompleted: goalRating !== null,
      rating: goalRating,
      userExercise: goalUserExercise,
    });

    const completedCount = stepViewModels.filter(s => s.isCompleted && !s.isTarget).length;

    return { roadmap, targetExercise, steps: stepViewModels, completedCount, totalCount: steps.length };
  }

  getExerciseById(id: string): Exercise | null {
    return EXERCISES.find(e => e.id === id) ?? null;
  }

  getAllCategories(): ExerciseCategory[] {
    const cats = new Set(ROADMAPS.map(r => r.category));
    return Array.from(cats);
  }

  private getStepsForRoadmap(roadmapId: string): RoadmapExercise[] {
    return ROADMAP_EXERCISES.filter(re => re.roadmapId === roadmapId);
  }

  private buildUserExerciseMap() {
    return new Map(this.userExerciseService.getAll().map(ue => [ue.exerciseId, ue]));
  }
}
