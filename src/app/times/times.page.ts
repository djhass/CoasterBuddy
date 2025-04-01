import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Park } from '../models.model'
import { LocationService } from '../location.service';
import { MainService } from '../main.service';

@Component({
  selector: 'app-times',
  templateUrl: './times.page.html',
  styleUrls: ['./times.page.scss'],
  standalone: false,
})

export class TimesPage implements OnInit {
  parkObj: any;
  closeParks: Array<Park> = [];
  searchParks: Array<Park> = [];
  fabHidden: boolean = false;
  loading: boolean = true;

  constructor(
    private http: HttpClient,
    private locationService: LocationService,
    protected mainService: MainService
  ) {
    console.log("Times Page")
    this.set()
   }

   ngOnInit(): void {}

  async set() {
    await this.http.get("https://server.coasterbuddy.app/times/parks", {headers: new HttpHeaders({'accept': 'application/json'})}).subscribe(obj => {
      this.parkObj = obj;
      this.locationService.getCloseTimesParks(obj).then(obj => {
        this.closeParks = obj
      });
      console.log(this.closeParks)
      this.loading = false;
    })
  }

  clearFab() {
    setTimeout(() => { this.fabHidden = true }, 100);
  }
  showFab() {
    setTimeout(() => { this.fabHidden = false }, 100);
  }

  async searchItems(ev: any) {
    console.log("test")
    let tempList = [];
    const val = ev.target.value.toLowerCase();
    if (val && val.trim() != "") {
      for (var i = 0; i < 12; i++) {
        for (var j = 0; j < this.parkObj[i].parks.length; j++) {
          if (this.parkObj[i].parks[j].name.toLowerCase().indexOf(val) > -1) {
            tempList.push(this.parkObj[i].parks[j]);
          }
        }
      }
    }
    this.searchParks = tempList
  }
}
