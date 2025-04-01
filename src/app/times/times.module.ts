import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Geolocation } from '@ionic-native/geolocation/ngx';

import { TimesPageRoutingModule } from './times-routing.module';

import { TimesPage } from './times.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TimesPageRoutingModule
  ],
  providers: [
  	Geolocation
  ],
  declarations: [TimesPage]
})
export class TimesPageModule {}
