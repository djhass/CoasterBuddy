import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CoastersService } from '../coasters.service';
import { AlertController } from '@ionic/angular';
import { ParksService } from '../parks.service';
import { MainService } from '../main.service'
import { Coaster } from '../models.model';
import { Credit } from '../models.model';
import { ridden } from '../models.model';
import { ManufacturersService } from '../manufacturers.service';
import { ModalController, NavParams} from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Keyboard } from '@capacitor/keyboard';


@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  imports: [
    IonicModule,
    FormsModule
  ]
})
export class AddComponent implements OnInit {

coasterInput: string = "";
nameInput: string = "";
heightInput: number = NaN;
parkInput: string = "";
materialInput: string = "";
modelInput: string = "";
timeInput: string = "";
coasters: Coaster[] = [];
ridden: ridden[] = [];
searchList: Array<any> = [];
manufacturerSearch: Array<object> = [];
parkSearch: Array<object> = [];
credit_list: Credit[] = [];
modelSearch: Array<object> = [];
searchFocus: boolean = false;
selectedList: Array<any> = [];
selectOption: boolean = false;
manualCredit!: Credit;
showDefunct: boolean = false;

  constructor(
  public coastersService: CoastersService, 
  public mainService: MainService,
  private alertCtrl: AlertController,
  private ParksService: ParksService,
  private ManufacturersService: ManufacturersService,
  private modalController: ModalController,
  private http: HttpClient
  
  ) {
      this.manualCredit = {
      height:NaN,
      id:NaN,
      inversionsNumber:NaN,
      length:0,
      mainImage:{path: ""},
      manufacturer:{name: ""},
      materialType:{name: ""},
      name:"",
      park:{name: ""},
      rank:NaN,
      score:undefined,
      seatingType:{name: ""},
      speed:NaN,
      status:{name: ""},
      totalRatings:NaN,
      validDuels:NaN
    };

    this.manualCredit.height = 0;
    this.manualCredit.length = 0;
    this.manualCredit.speed = 0;
    this.manualCredit.seatingType = {name: ""};
   }

  ngOnInit() {
 
  }

  @ViewChild('myInput') myInput!: ElementRef<HTMLInputElement>;

  onBlurClicked() {
    this.myInput.nativeElement.blur();
  }

  closeModal() { 
  this.modalController.dismiss();
   }

   closeKeyboard(value: number) {
    if (value == 13) {
      //alert(value)
      Keyboard.removeAllListeners();
      Keyboard.hide().catch(e => console.log(e))
    }
  }


   submit(credit: Credit) {
    //check if slots are blank
    if (!Object.values(this.manualCredit).every(x => x == '' || x == undefined || Number.isNaN(x) || x.path == '' || x.name == '')) {
      this.manualCredit.id = Math.floor(Math.random()*90000) + 10000;
      if(this.mainService.settings.units == "imperial") {
        if (!this.manualCredit.length) {
          this.manualCredit.length = 0;
        }
        if (!this.manualCredit.height) {
          this.manualCredit.height = 0;
        }
        if (!this.manualCredit.speed) {
          this.manualCredit.speed = 0;
        }
        this.manualCredit.length /= 3.280839895;
        this.manualCredit.height /= 3.280839895;
        this.manualCredit.speed /= 0.621371;
      } 
      this.coastersService.pushCredit(credit); 
      this.closeModal();
    }
    else {
      this.alertCtrl.create({
        header: "All Values are Empty",
        message: "Fill in at least one value before adding a custom credit.",
        buttons: [
        {
          text: 'OK',
          role: 'cancel'
        },
      ]
    })
    .then(res => {
        res.present();
    });
    }
   }

  itemClicked(coaster: Coaster) {
    if (this.selectOption) {
      if (this.isSelected(coaster)) {
        this.removeSelected(coaster);
      }
      else {
        this.addSelected(coaster);
        }
    }
    else {
      this.coastersService.pushCredit(coaster)
      this.coastersService.setData();
      this.closeModal()
    }
  }

  addSelected(coaster: Coaster) {
    this.selectedList.push(coaster);
  }

  removeSelected(coaster: Coaster) {
    this.selectedList.splice(this.selectedList.indexOf(coaster), 1);
  }

  isSelected(coaster: Coaster) {
    for (let i = 0; i < this.selectedList.length; i++) {
      if (this.selectedList[i].id == coaster.id) {
        return true
      }
    }
   
    return false
  }

  clearSelected() {
    this.selectedList = [];
  }

  pushSelectedList() {
    this.alertCtrl.create({
      header: "Add " + this.selectedList.length + " coasters to your credits?",
      buttons: [
      {
        text: 'Cancel',
        role: 'cancel'
      },
      {
        text: 'OK',
        handler: () => {
          this.coastersService.credit_list = this.selectedList.concat(this.coastersService.credit_list)
          this.coastersService.displayCreditList = this.selectedList.concat(this.coastersService.displayCreditList)
          this.clearSelected();
          this.coastersService.setData()
          this.closeModal()
          }
     }
    ]
  })
  .then(res => {
      res.present();
  });
}

 makeid(length: number) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

isCoasterAvailable = false;
searchItems(val: string) {
  if (val && val.trim() != "") {
    this.isCoasterAvailable = true;
    this.coastersService.databaseParameterRequest(val, "", "", "", this.showDefunct ? "all" : "operating").then(obj => this.searchList = obj)
  }
}

isManufacturerAvailable = false;
}
