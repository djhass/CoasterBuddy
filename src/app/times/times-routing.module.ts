import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TimesPage } from './times.page';

const routes: Routes = [
  {
    path: '',
    component: TimesPage
  },
  {
    path: 'park-times',
    loadChildren: () => import('./park-times/park-times.module').then( m => m.ParkTimesPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TimesPageRoutingModule {}
