import { NxWelcomeComponent } from './nx-welcome.component';
import { Route } from '@angular/router';
import { loadRemoteModule } from '@nx/angular/mf';

export const appRoutes: Route[] = [
  {
    path: 'listview',
    loadChildren: () =>
      loadRemoteModule('listview', './Module').then((m) => m.RemoteEntryModule),
  },
  {
    path: 'map',
    loadChildren: () =>
      loadRemoteModule('map', './Module').then((m) => m.RemoteEntryModule),
  },
  {
    path: '',
    component: NxWelcomeComponent,
  },
];
