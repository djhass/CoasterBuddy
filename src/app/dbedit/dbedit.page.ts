import { Component, OnInit } from '@angular/core';
import { Coaster } from '../models.model';
import { AlertController } from '@ionic/angular';
import { CoastersService } from '../coasters.service';
import { MainService } from '../main.service';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';


@Component({
  selector: 'app-dbedit',
  templateUrl: './dbedit.page.html',
  styleUrls: ['./dbedit.page.scss'],
  imports: [
    FormsModule,
    IonicModule
  ]
})
export class DBEditPage implements OnInit {

  public inputRide: Coaster | undefined = undefined;
  private searchList: Array<any> = []
  public input: string;

  constructor(
    private coastersService: CoastersService,
    private mainService: MainService,
    private alertCtrl: AlertController,
  ) {}

  ngOnInit() {
  }

  searchItems(val) {
    if (val && val.trim() != "") {
      this.coastersService.databaseParameterRequest(val, "", "", "", "all").then(obj => {
        this.searchList = obj;
        console.log(obj)
      })
    }
    else {
      this.searchList = [];
    }
  }

  enterRide(ride: Coaster) {
    console.log(ride.name)
    this.inputRide = ride;
  }

  test() {
    console.log("test")
  }

  areYouSureMessage(name: string) {
    this.alertCtrl.create({
      header: "Add New Entry?",
      message: "Would you like to request the ride " + name + " to add to the database?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel"
        },
        {
        text: "Yes",
        handler: () => {
            this.enterRide(new Coaster({name: name, id: -1}))
          }
        }
      ]
    })
    .then(alertEl => {
      alertEl.present();
  });
  }

}
