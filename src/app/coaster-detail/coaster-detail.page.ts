import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { CoastersService } from '../coasters.service';
import { MainService } from '../main.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-coaster-detail',
  templateUrl: './coaster-detail.page.html',
  styleUrls: ['./coaster-detail.page.scss'],
  imports: [
    IonicModule,
    FormsModule,
    RouterModule
  ]
})
export class CoasterDetailPage implements OnInit {
  loadedCoaster: any;
  similarList: Array<object>;
  Math: any;
  page: string;
  constructor(
  private activatedRoute: ActivatedRoute, 
  public coastersService: CoastersService,
  public mainService: MainService,
  private router: Router,
  private alertCtrl: AlertController,
  private http: HttpClient,
  ) {
    this.page = location.pathname.split('/')[1]
    this.Math = Math
    this.activatedRoute.paramMap.subscribe(paramMap => {
  		if (!paramMap.has('coasterid')) {
        // redirect
        return;
      }
      const coasterid = paramMap.get('coasterid');

      this.loadedCoaster = {
        park: {},
        manufacturer: {},
        seatingType: {},
        materialType: {},
        status: {}
      }
      this.getCoasterData(coasterid).subscribe(obj => {
        this.loadedCoaster = obj
        console.log(this.loadedCoaster)
      })
  	});
  }

  ionViewWillLeave() {
    this.coastersService.setData()
  }

  ngOnInit() {
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
    let url = "https://server.coasterbuddy.app/api/coasters/" + coasterid
    let httpHeaders = new HttpHeaders({
      'accept': 'application/json',
    })

    let options = {
        headers: httpHeaders
    }

    return this.http.get(url, options)
  }
}