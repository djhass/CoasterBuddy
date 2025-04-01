import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManDetailPageRoutingModule } from './man-detail-routing.module';

import { ManDetailPage } from './man-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManDetailPageRoutingModule,
    ManDetailPage
  ]
})
export class ManDetailPageModule {}
