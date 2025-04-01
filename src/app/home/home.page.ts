import { Component, OnInit, Input, NgModule } from '@angular/core';
import { Coaster, Park } from '../models.model';
import { CoastersService } from '../coasters.service';
import { MainService } from '../main.service';
import { LocationService  } from '../location.service';
import { ParksService  } from '../parks.service';
import { AddComponent } from '../add/add.component';
import { StatsComponent } from '../stats/stats.component';
import { FeedbackComponent } from '../feedback/feedback.component';
import { ModalController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { Browser } from '@capacitor/browser';
import { IonicModule } from '@ionic/angular'; // Import IonicModule for Ionic components
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';


//declare var RSSParser;

interface time_coaster {
  id:  number,
  name: string,
  is_open: boolean,
  wait_time: number,
  last_updated: string
}

interface land {
  id: number,
  name: string,
  rides: Array<time_coaster>
}

interface park_time_request {
  lands: Array<land>;
  rides: Array<time_coaster>;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    RouterModule ,
    CommonModule
  ]
})

export class HomePage implements OnInit {
      
  frontCoasters: Coaster[] = [];
  frontTimesCoasters: Array<time_coaster> = [];
  targetUrl : string = "";
  news : any;
  hideHomeButton: boolean = false;
  frontPark: Park = new Park();
  isNaN: Function = Number.isNaN;
  Math: Math = Math;
  JSON: JSON = JSON;
  
  constructor(
  public coastersService: CoastersService, 
  private locationService:  LocationService,
  public mainService:  MainService,
  private parksService: ParksService,
  private modalCtrl: ModalController,
  private menu: MenuController,
  private http: HttpClient,
  private alertCtrl: AlertController,
  ) {
  }

  async ngOnInit() {
    this.frontPark =  new Park()
    if (!navigator.onLine) {
      this.mainService.noInternetMessage()
    }
    else {
      this.newsRequest()
      this.setFrontCoasters()
      //this.setFrontTimesCoasters()
    }
  }


  openLink(url: string) {
    Browser.open({ url: url });
  }

  async newsRequest() {
    let request = await this.http.get("https://server.coasterbuddy.app/api/news", {headers: new HttpHeaders({'accept': 'application/json'})})
    await request.subscribe(obj => {
      this.news = obj
    })
  }

  async setFrontCoasters() {
    await this.locationService.getClosePark().then(obj => {
      if (!obj) {
        obj = new Park();
      }
      this.frontPark = obj
    })
    if (this.frontPark.id < 0) {
      return;
    }
    let temp: Array<Coaster> = [];
    let request = await this.http.get<Array<Coaster>>("https://server.coasterbuddy.app/api/coasters?status=operating&park=" + encodeURI(this.frontPark.name.toLowerCase()), {headers: new HttpHeaders({'accept': 'application/json'})})
    await request.subscribe((coasters: Array<Coaster>) => {
      for(var i in coasters) {
        temp.unshift(coasters[i]);
      }
    })
    this.frontCoasters = temp
    Promise.resolve()
  }

  async setFrontTimesCoasters() {
    await this.http.get("https://server.coasterbuddy.app/times/parks", {headers: new HttpHeaders({'accept': 'application/json'})}).subscribe(obj1 => {
      console.log(obj1)
      this.locationService.getCloseTimesParks(obj1).then(obj2 => {
        console.log(obj2)
        let coasterData = "https://server.coasterbuddy.app/times/parks/" + obj2[0].id
        this.http.get<park_time_request>(coasterData).subscribe((obj3: park_time_request) => {
          const namesToSearch = ['coaster', 'thrill', 'rides'];
          let foundName = false;
          for (let name of namesToSearch) {
            for (let i = 0; i < obj3['lands'].length; i++) {
              if (obj3['lands'][i].name.toLowerCase().includes(name)) {
                   this.frontTimesCoasters = obj3['lands'][i].rides;
                  foundName = true
                  break;
              }
            }
            if (foundName) {
              break;
            }
          }
          if (!foundName) {
            if (obj3['lands'].length > 0) {
              let temp: Array<time_coaster> = []
              for (let i = 0; i < obj3['lands'].length; i++) {
                temp = temp.concat(obj3['lands'][i].rides)
              }
              this.frontTimesCoasters = temp
            }
            else {
              this.frontTimesCoasters = obj3['rides']
            }
          }
        })
      })
    });
  }

  openEnd() {
    this.menu.open('first');
    
  }
  closeEnd() {
    this.menu.close('first');
  }


  

 async openAddComponent() {
  

    const modal = await this.modalCtrl.create({
    component: AddComponent
    })

    await modal.present();
  }

  async openFeedbackComponent() {
    const modal = await this.modalCtrl.create({
      component: FeedbackComponent
      })
  
      await modal.present();
  }

  async openDBEditComponent() {
    const modal = await this.modalCtrl.create({
      component: FeedbackComponent
      })
  
      await modal.present();
  }

  async openStatsComponent() {
    const modal = await this.modalCtrl.create({
      component: StatsComponent
      })
  
      await modal.present();
  }

}
  






