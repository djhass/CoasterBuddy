import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DBEditPage } from './dbedit.page';

const routes: Routes = [
  {
    path: '',
    component: DBEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DBEditPageRoutingModule {}
