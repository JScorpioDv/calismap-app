import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'roadmaps', pathMatch: 'full' },
  {
    path: 'roadmaps',
    loadComponent: () => import('./pages/roadmaps/roadmaps.page').then(m => m.RoadmapsPage),
  },
  {
    path: 'roadmaps/:id',
    loadComponent: () => import('./pages/roadmap-detail/roadmap-detail.page').then(m => m.RoadmapDetailPage),
  },
  {
    path: 'exercises/:id',
    loadComponent: () => import('./pages/exercise-detail/exercise-detail.page').then(m => m.ExerciseDetailPage),
  },
];
