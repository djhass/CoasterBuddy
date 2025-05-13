import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ParksService } from '../parks.service';
import { Park } from '../models.model';
import { Coaster } from '../models.model';
import { CoastersService } from '../coasters.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MainService } from '../main.service';

@Component({
  selector: 'app-park-detail',
  templateUrl: './park-detail.page.html',
  styleUrls: ['./park-detail.page.scss'],
  imports: [
    RouterModule ,
    IonicModule
  ]
})
export class ParkDetailPage implements OnInit {
  loadedPark: Park = new Park();
  parkName: string;
  coasters: Coaster[];
  page: string
  constructor(
  private activatedRoute: ActivatedRoute, 
  private parksService: ParksService,
  private router: Router,
  public coastersService: CoastersService,
  private http: HttpClient,
  public mainService: MainService,
  ) { 
    this.page = location.pathname.split('/')[1]

    this.activatedRoute.paramMap.subscribe(paramMap => {
  		if (!paramMap.has('parkid')) {
        // redirect
        return;
      }
      const parkid = paramMap.get('parkid');
      console.log(parkid)
      
      this.getParkData(parkid).subscribe(obj => {
        this.loadedPark = new Park(obj);
        console.log(this.loadedPark)
      })
  })
}

getParkData(parkid) {
  let url = `${this.mainService.SERVERURL}/park/${parkid}` //`https://server.coasterbuddy.app/api/park/${parkid}`
  let httpHeaders = new HttpHeaders({
    'accept': 'application/json',
  })

  let options = {
      headers: httpHeaders
  }

  return this.http.get(url, options)
}

  ngOnInit() {

  }

  setCoasters() {
    this.coastersService.databaseParameterRequest("", "", this.parkName, "", "operating").then(obj => {
      let tempArray = []
      for(var i in obj) {
        tempArray.push(obj[i]);
      }
      this.coasters = tempArray;
    })
  }

  website() {
    window.open(this.loadedPark.website, '_system', 'location=yes'); return false;
  }
  maps() {
    if (this.mainService.settings.mapsService == "apple") {
      window.open("http://maps.apple.com/?q=" + this.loadedPark.name, '_system', 'location=yes');
    }
    else if (this.mainService.settings.mapsService == "google") {
      window.open("https://www.google.com/maps/search/?api=1&query=" + this.loadedPark.name, '_system', 'location=yes');
    }
    else if (this.mainService.settings.mapsService == "waze") {
      window.open("https://www.waze.com/ul?query=" + this.loadedPark.name, '_system', 'location=yes');
    }
  }
}
