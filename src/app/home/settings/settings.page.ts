import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/main.service';
import { CoastersService } from 'src/app/coasters.service';
import { ViewListComponent } from '../settings/view-list/view-list.component';
import { ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LongPressDirective } from 'src/app/longpress.directive';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    LongPressDirective
  ],
  providers: [
    { provide: Date, useFactory: () => new Date() }
  ]
})
export class SettingsPage implements OnInit {


  constructor(
    public coastersService: CoastersService,
    public mainService:  MainService,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public newDate: Date = new Date()
  ) {
  }

  ngOnInit() {
  }

  async openViewListComponent(number: number) {
    const modal = await this.modalCtrl.create({
      component: ViewListComponent,
      componentProps: {
        // Pass your data here
        index: number,
      },
    });
  
    await modal.present();
  }

  clearData() {
    this.alertCtrl.create({
          header: 'Delete All Data?',
          message: 'This action cannot be undone.',
          buttons: [
          {
            text: 'Cancel',
            role: 'cancel'
          },
          {
            text: 'Delete',
            handler: () => {
              this.coastersService.clearAllData()
              this.coastersService.displayCreditList = [];
            }
          }
        ]
      })
      .then(alertEl => {
          alertEl.present();
      });
    };

  timeAgo(date: String | undefined) {
    if (!date) {
      date = "";
    }
    const now = new Date();
    const seconds = Math.floor((now.valueOf() - new Date(date as string).valueOf()) / 1000);
  
    let interval = Math.floor(seconds / 31536000);
  
    if (interval >= 1) {
      return interval + " years ago";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      return interval + " months ago";
    }
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
      return interval + " days ago";
    }
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
      return interval + " hours ago";
    }
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
      return interval + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";
  }

}
