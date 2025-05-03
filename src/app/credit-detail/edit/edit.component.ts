import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams} from '@ionic/angular';
import { Credit } from 'src/app/models.model';
import { CoastersService } from 'src/app/coasters.service';
import { MainService } from 'src/app/main.service';
import { AlertController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  imports: [
    IonicModule,
    FormsModule
  ]
})
export class EditComponent implements OnInit {

  public inputCredit: Credit;

  constructor(
    private modalController: ModalController,
    private coastersService: CoastersService,
    private alertCtrl: AlertController,
  ) { 
    this.inputCredit = {...this.coastersService.selectedCredit};
  }

  ngOnInit() {}

  closeModal() { 
    this.modalController.dismiss();
  }

  resetValues() {
    this.alertCtrl.create({
      header: `Do you want to reset ${this.inputCredit.name} to it's original values?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: () => {
            this.coastersService.databaseIdRequest(this.inputCredit.id).then(obj => {
              this.coastersService.set(this.inputCredit.id, obj);
              this.coastersService.setData();
              this.closeModal();
            })
          },
        }
      ],
    }).then(alertEl => {
      alertEl.present()
    });
    
  }

  submit() {
    this.coastersService.set(this.inputCredit.id, this.coastersService.selectedCredit);
    this.coastersService.setData();
    this.closeModal();
  }

}
