import { Routes } from '@angular/router';
import { TabsPage } from './tabs/tabs.page';
import { authRoutes } from './auth/auth.routes';

export const routes: Routes = [
  {
    path: 'auth',
    children: authRoutes,
  },
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      { path: 'home', loadComponent: () => import('./home/home.page').then((m) => m.HomePage) },
      { path: 'history', loadComponent: () => import('./history/history.page').then((m) => m.HistoryPage) },
      { path: 'profile', loadComponent: () => import('./profile/profile.page').then((m) => m.ProfilePage) },
      { path: 'settings', loadComponent: () => import('./settings/settings.page').then((m) => m.SettingsPage) },
      { path: 'build-room', loadComponent: () => import('./build-room/build-room.page').then((m) => m.BuildRoomPage) },
      { path: 'exterior-design', loadComponent: () => import('./exterior-design/exterior-design.page').then((m) => m.ExteriorDesignPage) },
      { path: 'replace', loadComponent: () => import('./replace/replace.page').then((m) => m.ReplacePage) },
      { path: 'cleanup', loadComponent: () => import('./cleanup/cleanup.page').then((m) => m.CleanupPage) },
      { path: 'style-transfer', loadComponent: () => import('./style-transfer/style-transfer.page').then((m) => m.StyleTransferPage) },
      { path: 'walls', loadComponent: () => import('./walls/walls.page').then((m) => m.WallsPage) },
      { path: 'flooring', loadComponent: () => import('./flooring/flooring.page').then((m) => m.FlooringPage) },
      { path: 'gen/:id', loadComponent: () => import('./generation-detail/generation-detail.page').then((m) => m.GenerationDetailPage) },
      { path: 'subscription', loadComponent: () => import('./subscription/subscription.page').then((m) => m.SubscriptionPage) },
      { path: 'privacy', loadComponent: () => import('./privacy/privacy.page').then((m) => m.PrivacyPage) },
      { path: '', redirectTo: '/tabs/home', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: '/tabs/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/tabs/home' },
];
