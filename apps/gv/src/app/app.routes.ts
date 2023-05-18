import { NxWelcomeComponent } from './nx-welcome.component';
import { Route } from '@angular/router';
import { loadRemoteModule } from '@nx/angular/mf';

export const appRoutes: Route[] = [
  {
    path: 'login',
    loadChildren: () => import('login/Module').then((m) => m.RemoteEntryModule),
  },
  {
    path: 'passport',
    loadChildren: () =>
      import('passport/Module').then((m) => m.RemoteEntryModule),
  },
  {
    path: 'listview',
    loadChildren: () =>
      import('listview/Module').then((m) => m.RemoteEntryModule),
  },
  {
    path: 'map',
    loadChildren: () => import('map/Module').then((m) => m.RemoteEntryModule),
  },
  {
    path: 'mfe1',
    loadChildren: () =>
      loadRemoteModule('login', './Module').then((m) => m.RemoteEntryModule),
  },
  {
    path: '',
    component: NxWelcomeComponent,
  },
];
