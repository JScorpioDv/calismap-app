import { DecimalPipe } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonBadge,
  IonContent,
  IonHeader,
  IonProgressBar,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Exercise, ExerciseCategory } from '../../models/exercise.model';
import { Roadmap } from '../../models/roadmap.model';
import { RoadmapService } from '../../services/roadmap.service';

interface RoadmapCard {
  roadmap: Roadmap;
  targetExercise: Exercise;
  completedCount: number;
  totalCount: number;
  category: ExerciseCategory;
}

const ALL = 'ALL' as const;
type Filter = ExerciseCategory | typeof ALL;

@Component({
  selector: 'app-roadmaps',
  templateUrl: './roadmaps.page.html',
  styleUrls: ['./roadmaps.page.css'],
  standalone: true,
  imports: [
    DecimalPipe, RouterLink,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonProgressBar, IonBadge,
  ],
})
export class RoadmapsPage implements OnInit {
  private all = signal<RoadmapCard[]>([]);
  activeFilter = signal<Filter>(ALL);
  categories = signal<Filter[]>([]);

  filtered = computed(() =>
    this.activeFilter() === ALL
      ? this.all()
      : this.all().filter(c => c.category === this.activeFilter()),
  );

  constructor(private roadmapService: RoadmapService) {}

  ngOnInit(): void {
    this.load();
  }

  ionViewWillEnter(): void {
    this.load();
  }

  setFilter(f: Filter): void {
    this.activeFilter.set(f);
  }

  progress(card: RoadmapCard): number {
    return card.totalCount === 0 ? 0 : card.completedCount / card.totalCount;
  }

  private load(): void {
    const data = this.roadmapService.getAllRoadmaps();
    this.all.set(data);
    const cats: Filter[] = [ALL, ...this.roadmapService.getAllCategories()];
    this.categories.set(cats);
  }
}
