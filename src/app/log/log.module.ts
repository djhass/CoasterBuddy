import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { LogPage } from './log.page';
import { AddComponent } from '../add/add.component';
import { LogPageRoutingModule } from './log-routing.module';




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LogPageRoutingModule,
    AddComponent
  ]
})
export class LogPageModule {}
