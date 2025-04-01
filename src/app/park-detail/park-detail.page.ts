import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ParksService } from '../parks.service';
import { Park } from '../models.model';
import { Coaster } from '../models.model';
import { CoastersService } from '../coasters.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

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
  ) { 
    this.page = location.pathname.split('/')[1]
  }

  ngOnInit() {
  	this.activatedRoute.paramMap.subscribe(paramMap => {
  		if (!paramMap.has('parkname')) {
        // redirect
        return;
      }
      this.parkName = paramMap.get('parkname');

      this.parksService.parkRequest(this.parkName).subscribe(obj => {
        this.loadedPark = obj[0]
        this.setCoasters()
      })
  	});
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
    window.open("http://maps.apple.com/?q=" + this.loadedPark.name, '_system', 'location=yes'); return false;
  }
}
