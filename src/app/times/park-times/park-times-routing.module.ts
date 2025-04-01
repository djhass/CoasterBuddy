import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParkTimesPage } from './park-times.page';

const routes: Routes = [
  {
    path: '',
    component: ParkTimesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParkTimesPageRoutingModule {}
