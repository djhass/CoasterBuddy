import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    children: [
      {
        path: "",
        loadChildren: () => import("./home/home.module").then(m =>  m.HomePageModule)
      },
      {
        path: 'coaster/:coasterid',
        pathMatch: 'prefix',
        loadChildren: () => import("./coaster-detail/coaster-detail.module").then(m =>  m.CoasterDetailPageModule)
      },
      {
        path: 'credit/:coasterid',
        pathMatch: 'prefix',
        loadChildren: () => import("./credit-detail/credit-detail.module").then(m =>  m.CreditDetailPageModule)
      },
      {
        path: 'park/:parkid',
        loadChildren: () => import("./park-detail/park-detail.module").then(m =>  m.ParkDetailPageModule)
        },{
        path: 'make/:makeid',
        loadChildren: () => import("./man-detail/man-detail.module").then(m =>  m.ManDetailPageModule)
        },
    ]
  },
  {
    path: 'log',
    children: [
      {
      path: "",
      loadChildren: () => import("./log/log.module").then(m =>  m.LogPageModule)
      },
      {
      path: 'ride/:coasterid',
      pathMatch: 'prefix',
      loadChildren: () => import("./coaster-detail/coaster-detail.module").then(m =>  m.CoasterDetailPageModule)
      },
      {
        path: 'credit/:coasterid',
        pathMatch: 'prefix',
        loadChildren: () => import("./credit-detail/credit-detail.module").then(m =>  m.CreditDetailPageModule)
        },
      {
      path: 'park/:parkname',
      loadChildren: () => import("./park-detail/park-detail.module").then(m =>  m.ParkDetailPageModule)
      },{
      path: 'make/:makeid',
      loadChildren: () => import("./man-detail/man-detail.module").then(m =>  m.ManDetailPageModule)
      },
      
    ]
  },
  {
    path: 'times',
    children: [
      {
        path: '',
        loadChildren: () => import('./times/times.module').then( m => m.TimesPageModule)
      },
      {
        path: 'park-times/:parkid',
        pathMatch: 'prefix',
        loadChildren: () => import("./times/park-times/park-times.module").then(m =>  m.ParkTimesPageModule)
      },
      
    ]
    
  },
  {
    path: 'database',
    children: [
      {
      path: "",
      loadChildren: () => import("./database/database.module").then(m =>  m.DatabasePageModule)
      },
      {
      path: 'ride/:coasterid',
      pathMatch: 'prefix',
      loadChildren: () => import("./coaster-detail/coaster-detail.module").then(m =>  m.CoasterDetailPageModule)
      },
      {
        path: 'credit/:coasterid',
        pathMatch: 'prefix',
        loadChildren: () => import("./credit-detail/credit-detail.module").then(m =>  m.CreditDetailPageModule)
        },
      {
      path: 'park/:parkid',
      loadChildren: () => import("./park-detail/park-detail.module").then(m =>  m.ParkDetailPageModule)
      },{
      path: 'make/:makeid',
      loadChildren: () => import("./man-detail/man-detail.module").then(m =>  m.ManDetailPageModule)
      },
      
    ]
  },
  {
    path: 'navigate',
    loadChildren: () => import('./navigate/navigate.module').then( m => m.NavigatePageModule)
  },
  {
    path: 'log',
    loadChildren: () => import('./log/log.module').then( m => m.LogPageModule)
  },
  {
    path: 'dbedit',
    loadChildren: () => import('./dbedit/dbedit.module').then( m => m.DBEditPageModule)
  },
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
