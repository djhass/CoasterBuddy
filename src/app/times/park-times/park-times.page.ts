import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { MainService } from 'src/app/main.service';

interface ResponseStruct {
  lands: Array<SectionStruct>,
  rides?: Array<RideStruct>
}

interface SectionStruct {
  id: number,
  name: string,
  rides: Array<RideStruct>
}

interface RideStruct {
  id: number,
  name: string,
  is_open: boolean,
  wait_time: number,
  last_updated: string
}

@Component({
  selector: 'app-park-times',
  templateUrl: './park-times.page.html',
  styleUrls: ['./park-times.page.scss'],
  standalone: false
})
export class ParkTimesPage implements OnInit {

  parkId: string = "";
  coasterData: Array<RideStruct> = [];
  sectionData: Array<SectionStruct> = [];
  returnedValue: boolean;
  loading: boolean;
  Math: Math = Math;

  constructor(
    private activatedRoute: ActivatedRoute, 
    private http: HttpClient,
    private alertCtrl: AlertController,
    protected mainService: MainService
  ) { 
    this.returnedValue = true
    this.loading = true;
  }

  ngOnInit() {
    this.updateData()
  }

  ISOToReadable(input: string) {
    return new Date(input).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit'
    });
  }

  async refreshed(event: any) {
    await this.updateData()
    event.target.complete()
  }

  getCoasterData() {
    let coasterData = "https://server.coasterbuddy.app/times/parks/" + this.parkId
    return this.http.get<ResponseStruct>(coasterData);
  }

  async updateData() {
    
    this.activatedRoute.paramMap.subscribe(paramMap => {
  		if (!paramMap.has('parkid')) {
        // redirect
        return;
      }

      this.parkId = String(paramMap.get('parkid'));
      
      this.getCoasterData().subscribe(obj => {
        console.log(obj)
        if (obj.lands.length == 0) {
          this.returnedValue = false
          console.log("Object: ")
          console.log(obj)
          if (obj.rides) {
            this.coasterData = obj.rides
          }
        }
        else {
          this.sectionData = obj.lands
        }

        this.loading = false
      })
  	});
  }
}
