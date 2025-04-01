import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ParkDetailPageRoutingModule } from './park-detail-routing.module';

import { ParkDetailPage } from './park-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ParkDetailPageRoutingModule,
    ParkDetailPage
  ],
})
export class ParkDetailPageModule {}
