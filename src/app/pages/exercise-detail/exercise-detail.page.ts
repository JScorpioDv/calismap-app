import { Location } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  AlertController,
  IonBackButton,
  IonBadge,
  IonButton,
  IonButtons,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { barbellOutline, checkmarkCircle, clipboardOutline, listOutline, trophyOutline } from 'ionicons/icons';
import { Exercise, Rating } from '../../models/exercise.model';
import { UserExercise } from '../../models/user-exercise.model';
import { RatingCalculatorService } from '../../services/rating-calculator.service';
import { RoadmapService } from '../../services/roadmap.service';
import { UserExerciseService } from '../../services/user-exercise.service';
import { UserProfileService } from '../../services/user-profile.service';

@Component({
  selector: 'app-exercise-detail',
  templateUrl: './exercise-detail.page.html',
  styleUrls: ['./exercise-detail.page.css'],
  standalone: true,
  imports: [
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButtons, IonBackButton,
    IonList, IonItem, IonLabel, IonInput,
    IonButton, IonBadge, IonChip, IonIcon,
  ],
})
export class ExerciseDetailPage implements OnInit {
  exercise = signal<Exercise | null>(null);
  userExercise = signal<UserExercise | null>(null);

  reps = signal(0);
  weight = signal(0);

  currentRating = computed<Rating | null>(() => {
    const ue = this.userExercise();
    const ex = this.exercise();
    if (!ue || !ex) return null;
    return this.ratingCalc.calculate(ue.maxRepetitions, this.userProfileService.getBodyWeight(), ex.ratingThresholds);
  });

  /** Live preview: what rating would the reps entered right now yield? */
  previewResult = computed(() => {
    const ex = this.exercise();
    if (!ex || this.reps() <= 0) return null;
    return this.ratingCalc.preview(this.reps(), this.userProfileService.getBodyWeight(), ex);
  });

  bodyWeight = signal(75);

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private roadmapService: RoadmapService,
    private userExerciseService: UserExerciseService,
    private ratingCalc: RatingCalculatorService,
    private userProfileService: UserProfileService,
    private toast: ToastController,
    private alert: AlertController,
  ) {
    addIcons({ checkmarkCircle, barbellOutline, listOutline, trophyOutline, clipboardOutline });
  }

  ngOnInit(): void { this.load(); }
  ionViewWillEnter(): void { this.load(); }

  private load(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.exercise.set(this.roadmapService.getExerciseById(id));
    this.userExercise.set(this.userExerciseService.getByExerciseId(id));
    this.bodyWeight.set(this.userProfileService.getBodyWeight());

    const ue = this.userExercise();
    this.reps.set(ue?.maxRepetitions ?? 0);
    this.weight.set(ue?.maxWeight ?? 0);
  }

  /** Quick exam: alert asking for max reps, auto-saves with live rating. */
  async openExam(): Promise<void> {
    const ex = this.exercise();
    if (!ex) return;

    const bw = this.userProfileService.getBodyWeight();
    const a = await this.alert.create({
      header: `Exam: ${ex.name}`,
      message: `Your bodyweight: ${bw} kg\nDo as many ${ex.repUnit === 'seconds' ? 'seconds' : 'reps'} as you can and enter the result.`,
      inputs: [{ name: 'reps', type: 'number', placeholder: `Max ${ex.repUnit === 'seconds' ? 'seconds' : 'reps'}`, min: 1 }],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Save',
          handler: (data) => {
            const r = Number(data.reps);
            if (!r || r <= 0) return false;
            this.saveProgress(r, 0);
            return true;
          },
        },
      ],
    });
    await a.present();
  }

  async saveSession(): Promise<void> {
    await this.saveProgress(this.reps(), this.weight());
    this.location.back();
  }

  private async saveProgress(reps: number, weightKg: number): Promise<void> {
    const ex = this.exercise();
    if (!ex) return;

    this.userExerciseService.saveMaxReps(ex.id, reps, weightKg);
    this.userExercise.set(this.userExerciseService.getByExerciseId(ex.id));

    const bw = this.userProfileService.getBodyWeight();
    const rating = this.ratingCalc.calculate(reps, bw, ex.ratingThresholds);

    const t = await this.toast.create({
      message: `Saved! Rating: ${rating}`,
      duration: 2000,
      color: 'success',
      position: 'bottom',
    });
    await t.present();
  }

  repUnitLabel(): string {
    return this.exercise()?.repUnit === 'seconds' ? 'seconds' : 'reps';
  }
}
