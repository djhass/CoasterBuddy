import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CoasterDetailPage } from './coaster-detail.page';

const routes: Routes = [
  {
    path: '',
    component: CoasterDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoasterDetailPageRoutingModule {}
