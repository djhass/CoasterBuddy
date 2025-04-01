import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DBEditPageRoutingModule } from './dbedit-routing.module';

import { DBEditPage } from './dbedit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DBEditPageRoutingModule,
    DBEditPage
  ]
})
export class DBEditPageModule {}
