import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { CoastersService } from '../coasters.service';
import { MainService } from '../main.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Coaster } from '../models.model';


@Component({
  selector: 'app-coaster-detail',
  templateUrl: './coaster-detail.page.html',
  styleUrls: ['./coaster-detail.page.scss'],
  imports: [
    IonicModule,
    FormsModule,
    RouterModule,
    CommonModule
  ]
})

export class CoasterDetailPage implements OnInit {

  loadedCoaster: Coaster;
  page: string;
  similarList: Array<object>;
  Math: Math = Math;
  Number: Number = new Number;
  altImg: string = "/assets/a-stylized-black-and-white-line-drawing-of-two-roller-coaster-cars-ascending-a-track-vector.jpg"
  shownImg: string = this.altImg;
  useMetric: boolean;

  constructor(
  private activatedRoute: ActivatedRoute, 
  public coastersService: CoastersService,
  public mainService: MainService,
  private router: Router,
  private alertCtrl: AlertController,
  private http: HttpClient,
  ) {
    this.page = location.pathname.split('/')[1]
    this.loadedCoaster = new Coaster();
    this.activatedRoute.paramMap.subscribe(paramMap => {
  		if (!paramMap.has('coasterid')) {
        // redirect
        return;
      }
      const coasterid = paramMap.get('coasterid');

      this.getCoasterData(coasterid).subscribe(obj => {
        this.loadedCoaster = new Coaster(obj);
        this.shownImg = (this.loadedCoaster && this.loadedCoaster.image ? this.coastersService.getCoasterLargeImage(this.loadedCoaster.image) : this.altImg);
        if (this.mainService.settings.defaultUnits) {
          this.useMetric = this.loadedCoaster && this.loadedCoaster.prefersMetric ? this.loadedCoaster.prefersMetric : false
        }
        else {
          this.useMetric = this.mainService.settings.metric;
        }
        console.log(this.loadedCoaster)
      })
  	});
  }

  onImgFail() {
    this.shownImg = this.altImg;
  }

  ionViewWillLeave() {
    this.coastersService.setData()
  }

  displayDate(inputDate: string) {
    return new Date(inputDate).toDateString();
  }

  ngOnInit() {
    }

    test() {
      console.log(this.useMetric)
    }

    handleScroll(event: any) {
      let lastScrollTop = 0;

      const scrollTop = event.detail.scrollTop;
      const header = document.querySelector('.scroll-header') as HTMLElement;
    
      if (header) {
        if (scrollTop > lastScrollTop) {
          // Scrolling down
          header.style.display = 'block'; // Show toolbar
        } else {
          // Scrolling up
          header.style.display = 'none'; // Hide toolbar completely
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // Prevent negative values
      }
    }
    
  


  pushCredit(coaster) {
    let tempObj = coaster;
    tempObj.tally = 1;
    tempObj.time = new Date().toISOString()

    this.coastersService.credit_list.unshift(tempObj);
   }

  getCoasterData(coasterid) {
    //http://104.2.36.28:8085/captaincoaster.com/api/coasters
    //http://104.2.36.28:8085/queue-times.com/en-US/parks.json
    //http://104.2.36.28:8085/coasters-api.herokuapp.com
    //https://cors-anywhere.herokuapp.com/
    let url = `http://localhost:8080/ride/${coasterid}` //`https://server.coasterbuddy.app/api/coasters/${coasterid}`
    let httpHeaders = new HttpHeaders({
      'accept': 'application/json',
    })

    let options = {
        headers: httpHeaders
    }

    return this.http.get(url, options)
  }


}