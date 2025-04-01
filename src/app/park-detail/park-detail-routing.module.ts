import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParkDetailPage } from './park-detail.page';

const routes: Routes = [
  {
    path: '',
    component: ParkDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParkDetailPageRoutingModule {}
