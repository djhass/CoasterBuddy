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

  public loadedCredit: Credit;
  public inputCredit: Credit;

  public displaySpeed: number;
  public displayHeight: number;
  public displayLength: number;

  constructor(
    private modalController: ModalController,
    private coastersService: CoastersService,
    private mainService: MainService,
    private alertCtrl: AlertController,
  ) { 

    this.inputCredit = {
      height:NaN,
      id:NaN,
      inversionsNumber:NaN,
      length:NaN,
      mainImage:{path: ""},
      manufacturer:{name: ""},
      materialType:{name: ""},
      name:"",
      park:{name: ""},
      rank:NaN,
      score:"",
      seatingType:{name: ""},
      speed:NaN,
      status:{name: ""},
      totalRatings:NaN,
      validDuels:NaN
    }
    this.inputCredit.tally = NaN
    
    
    this.loadedCredit = this.coastersService.selectedCredit

    this.inputCredit.materialType.name = this.loadedCredit.materialType.name

    this.displaySpeed = Math.round(this.loadedCredit.speed);
    this.displayHeight = Math.round(this.loadedCredit.height);
    this.displayLength = Math.round(this.loadedCredit.length);

    //convert units
    if (this.mainService.settings.units == "imperial") {
      this.displaySpeed = Math.round(this.displaySpeed * 0.621371);
      this.displayHeight = Math.round(this.displayHeight * 3.280839895);
      this.displayLength = Math.round(this.displayLength * 3.280839895);
    }
  }

  ngOnInit() {}

  closeModal() { 
    this.modalController.dismiss();
  }

  changeCoaster(coaster) {
    if (coaster.name != "") {
      this.loadedCredit.name = coaster.name
    }
    if (!Number.isNaN(coaster.height)) {
      if (this.mainService.settings.units == "imperial") {
        this.loadedCredit.height = coaster.height / 3.280839895
      }
      else {
        this.loadedCredit.height = coaster.height
      }
    }
    if (!Number.isNaN(coaster.inversionsNumber)) {
      this.loadedCredit.inversionsNumber = coaster.inversionsNumber
    }
    if (!Number.isNaN(coaster.length)) {
      if (this.mainService.settings.units == "imperial") {
        this.loadedCredit.length = coaster.length / 3.280839895
      }
      else {
        this.loadedCredit.length = coaster.length
      }
    }
    if (coaster.mainImage.path != "") {
      this.loadedCredit.mainImage.path = coaster.mainImage.path
    }
    if (coaster.manufacturer.name != "") {
      this.loadedCredit.manufacturer.name = coaster.manufacturer.name
    }
    if (coaster.materialType.name != this.loadedCredit.materialType.name) {
      this.loadedCredit.materialType.name = coaster.materialType.name
    }
    if (coaster.park.name != "") {
      this.loadedCredit.park.name = coaster.park.name
    }
    if (coaster.seatingType.name != "") {
      this.loadedCredit.seatingType.name = coaster.seatingType.name
    }
    if (!Number.isNaN(coaster.speed)) {
      if (this.mainService.settings.units == "imperial") {
        this.loadedCredit.speed = Math.round(coaster.speed / 0.621371)
      }
      else {
        this.loadedCredit.speed = coaster.speed
      }
    }
    if (coaster.time != undefined) {
      this.loadedCredit.time = coaster.time
    }
    if (!Number.isNaN(coaster.tally)) {
      this.loadedCredit.tally = coaster.tally
    }
  }

  resetValues() {
    this.alertCtrl.create({
      header: `Do you want to reset ${this.loadedCredit.name} to it's original values?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: () => {
            this.coastersService.databaseIdRequest(this.loadedCredit.id).then(obj => {
              this.changeCoaster(obj)
              this.coastersService.set(this.loadedCredit.id, obj);
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
    this.changeCoaster(this.inputCredit)
    this.coastersService.set(this.loadedCredit.id, this.loadedCredit);
    this.coastersService.setData();
    this.closeModal();
  }

}
