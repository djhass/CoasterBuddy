import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManDetailPage } from './man-detail.page';

const routes: Routes = [
  {
    path: '',
    component: ManDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManDetailPageRoutingModule {}
