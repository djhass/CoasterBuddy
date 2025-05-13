import { Component, OnInit, ViewChild } from '@angular/core';
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
import { ChangeDetectorRef } from '@angular/core';


//declare var RSSParser;

interface time_coaster {
  id:  number,
  name: string,
  is_open: boolean,
  wait_time: number,
  last_updated: string
}


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    RouterModule,
    CommonModule,
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
  private cdr: ChangeDetectorRef
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
    }
  }


  openLink(url: string) {
    Browser.open({ url: url });
  }
  

  async newsRequest() {
    let request = await this.http.get(`${this.mainService.SERVERURL}/api/news`, {headers: new HttpHeaders({'accept': 'application/json'})})
    await request.subscribe(obj => {
      this.news = obj
    })
  }

  async setFrontCoasters() {
    /*

    this.locationService.getClosePark().then(obj => {
      if (!obj) {
        obj = new Park();
      }
      this.frontPark = obj
    })
    let temp: Array<Coaster> = [];
    let request = await this.http.get<Array<Coaster>>(`${this.mainService.SERVERURL}/api/coasters?status=operating&park=${encodeURI(this.frontPark.name.toLowerCase())}`, {headers: new HttpHeaders({'accept': 'application/json'})})
    await request.subscribe((coasters: Array<Coaster>) => {
      for(var i in coasters) {
        temp.unshift(coasters[i]);
      }
    })
    this.frontCoasters = temp
    Promise.resolve()

    */
    this.locationService.getClosePark().then(park => {

      if (!park) {
        return
      }

      this.frontPark = park
      let temp: Array<Coaster> = [];
      let request = this.http.get<Array<Coaster>>(`${this.mainService.SERVERURL}/search/%20?include=rides&status=operating&wait_time=true&park=${encodeURI(this.JSON.stringify({name: park.name, id: park.id.toString()}))}`, {headers: new HttpHeaders({'accept': 'application/json'})})

      request.subscribe((coasters: Array<Coaster>) => {
        
      for(var i in coasters) {
        temp.unshift(coasters[i]);
      }

      this.frontCoasters = temp
    })

    Promise.resolve();
    })

    Promise.resolve()
  }

  openEnd() {
    this.menu.open('first');
    
  }
  closeEnd() {
    this.menu.close('first');
  }

ionViewDidEnter() {
  setTimeout(() => {
    this.cdr.detectChanges();
  }, 700);
}

stopPropagation(event: Event) {
  event.preventDefault();
  event.stopPropagation();
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
  






