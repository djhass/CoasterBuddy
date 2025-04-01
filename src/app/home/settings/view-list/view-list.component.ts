import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams} from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Credit } from 'src/app/models.model';
import { CoastersService } from 'src/app/coasters.service';
import { AlertController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular'; // Import IonicModule for Ionic components

@Component({
  selector: 'app-view-list',
  templateUrl: './view-list.component.html',
  styleUrls: ['./view-list.component.scss'],
  imports: [
    IonicModule // Import the module for Ionic components
  ],
})

export class ViewListComponent implements OnInit {

  private index: number = 0;
  list: Array<Credit> = [];

  constructor(
    private modalController: ModalController,
    private route: ActivatedRoute,
    private coastersService: CoastersService,
    private alertCtrl: AlertController,
  ) {
    this.initialize();
  }

  ngOnInit() {}

  async initialize() {
    Number(await this.route.snapshot.paramMap.get('index'));
    this.list = this.coastersService.history[this.index].credits
  }

  closeModal() { 
    this.modalController.dismiss();
  }

  revert() {
    this.alertCtrl.create({
      header: 'Revert Credits?',
      message: 'Do you want to revert your current credit list selection to this backup?',
      buttons: [
      {
        text: 'Cancel',
        role: 'cancel'
      },
      {
        text: 'Yes',
        handler: () => {
          this.coastersService.revertFromHistory(this.index);
          this.closeModal();
        }
      }
    ]
  })
  .then(alertEl => {
      alertEl.present();
  });
  }
}
