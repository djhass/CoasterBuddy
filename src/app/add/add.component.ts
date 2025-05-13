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
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  imports: [
    IonicModule,
    FormsModule,
    CommonModule
  ]
})
export class AddComponent implements OnInit {

coasterInput: string = "";
searchList: Array<any> = [];
searchFocus: boolean = false;
selectedList: Array<any> = [];
selectOption: boolean = false;
manualCredit!: Credit;

  constructor(
  public coastersService: CoastersService, 
  public mainService: MainService,
  private alertCtrl: AlertController,
  private modalController: ModalController,
  private http: HttpClient,
  ) {
    this.manualCredit = new Credit();
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

   submitManual(credit: Credit) {
    //check if slots are blank
    if (!Object.values(credit).every(x => x == '' || x == undefined || Number.isNaN(x) || x.path == '' || x.name == '')) {
      credit.id = this.makeid(12);
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
      let credit = new Credit(coaster);
      if (credit.status && credit.status.open) {
        credit.tally = 1;
        credit.time = new Date().toISOString();
      }
      this.coastersService.pushCredit(credit)
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
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

isCoasterAvailable = false;

async searchItems(input: string) {
  console.log("test")
  if (input && input.trim() != "") {
    let temp: Array<any> = []
    let requestURL = `${this.mainService.SERVERURL}/search/${input}?include=rides`;
    
    const obj = await this.http.get<Array<Coaster>>(requestURL, {headers: new HttpHeaders({'accept': 'application/json'})}).toPromise();
    
    Array.prototype.push.apply(temp,obj);
    
    this.searchList = temp;
    console.log(this.searchList)
  }
}


isManufacturerAvailable = false;
}
