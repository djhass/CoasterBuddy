import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ParkTimesPageRoutingModule } from './park-times-routing.module';

import { ParkTimesPage } from './park-times.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ParkTimesPageRoutingModule
  ],
  declarations: [ParkTimesPage]
})
export class ParkTimesPageModule {}
