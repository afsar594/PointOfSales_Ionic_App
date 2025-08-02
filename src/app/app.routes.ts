import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
    {
    path:'auth',
    loadChildren:() => import('./auth/auth.module').then((m) =>m.AuthModule ),
    },
    {
    path:'pages',
    loadChildren:() => import('./pages/pages.module').then((m) =>m.PagesModule ),
    }
];
