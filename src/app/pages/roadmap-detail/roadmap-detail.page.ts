import { DecimalPipe, NgClass } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircle, lockClosed, trophy } from 'ionicons/icons';
import { Rating } from '../../models/exercise.model';
import { RoadmapDetailViewModel, RoadmapStepViewModel } from '../../models/roadmap.model';
import { RoadmapService } from '../../services/roadmap.service';

@Component({
  selector: 'app-roadmap-detail',
  templateUrl: './roadmap-detail.page.html',
  styleUrls: ['./roadmap-detail.page.css'],
  standalone: true,
  imports: [
    DecimalPipe, NgClass, RouterLink,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButtons, IonBackButton, IonIcon,
  ],
})
export class RoadmapDetailPage implements OnInit {
  detail = signal<RoadmapDetailViewModel | null>(null);

  /** Steps displayed top→bottom: goal first, then prerequisites in reverse order */
  stepsReversed = computed(() => {
    const d = this.detail();
    return d ? [...d.steps].reverse() : [];
  });

  progress = computed(() => {
    const d = this.detail();
    return d && d.totalCount > 0 ? d.completedCount / d.totalCount : 0;
  });

  constructor(
    private route: ActivatedRoute,
    private roadmapService: RoadmapService,
  ) {
    addIcons({ checkmarkCircle, lockClosed, trophy });
  }

  ngOnInit(): void { this.load(); }
  ionViewWillEnter(): void { this.load(); }

  private load(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.detail.set(this.roadmapService.getRoadmapDetail(id));
  }

  nodeClass(step: RoadmapStepViewModel): string {
    if (step.isTarget) return step.isCompleted ? 'node-goal node-done' : 'node-goal';
    if (step.isCompleted) return `node-done node-rating-${step.rating?.toLowerCase()}`;
    if (step.isUnlocked) return 'node-unlocked';
    return 'node-locked';
  }

  connectorClass(step: RoadmapStepViewModel, next: RoadmapStepViewModel | undefined): string {
    if (!next) return '';
    if (next.isCompleted && step.isCompleted) return 'connector-done';
    if (step.isCompleted) return 'connector-half';
    return '';
  }

  ratingLabel(rating: Rating | null): string {
    if (!rating) return '';
    const icons: Record<Rating, string> = {
      BRONZE: '🥉', SILVER: '🥈', GOLD: '🥇', PLATINUM: '💠', DIAMOND: '💎',
    };
    return icons[rating] + ' ' + rating;
  }
}
