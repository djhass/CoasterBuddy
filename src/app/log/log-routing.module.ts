import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogPage } from './log.page';

const routes: Routes = [
  {
    path: '',
    component: LogPage,
  },
  {
    path: 'coasterid',
    loadChildren: () => import('../coaster-detail/coaster-detail.module').then( m => m.CoasterDetailPageModule)
  },{
    path: 'park-detail',
    loadChildren: () => import('../park-detail/park-detail.module').then( m => m.ParkDetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LogPageRoutingModule {}
