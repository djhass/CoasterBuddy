import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Make } from '../models.model';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MainService } from '../main.service';

@Component({
  selector: 'app-man-detail',
  templateUrl: './man-detail.page.html',
  styleUrls: ['./man-detail.page.scss'],
  imports: [
    IonicModule,
    RouterModule,
    CommonModule
  ]
})
export class ManDetailPage implements OnInit {

    loadedMake: Make = new Make();
    page: string

  constructor(
    private activatedRoute: ActivatedRoute, 
    private http: HttpClient,
    private mainService: MainService
  ) {
        this.page = location.pathname.split('/')[1]
        console.log(this.page)
    
        this.activatedRoute.paramMap.subscribe(paramMap => {
          if (!paramMap.has('makeid')) {
            // redirect
            console.log("boob")
            return;
          }
          const makeid = paramMap.get('makeid');
          console.log(makeid)
          
          this.getMakeData(makeid).subscribe(obj => {
            this.loadedMake = new Make(obj);
            console.log(this.loadedMake)
          })
      })
  }

  ngOnInit() {

  }

  getMakeData(makeid) {
    let url = `${this.mainService.SERVERURL}/make/${makeid}` //`https://server.coasterbuddy.app/api/make/${makeid}`
    let httpHeaders = new HttpHeaders({
      'accept': 'application/json',
    })
  
    let options = {
        headers: httpHeaders
    }
  
    return this.http.get(url, options)
  }

  website() {
    console.log(this.loadedMake.website)
    window.open(this.loadedMake.website, '_system', 'location=yes'); return false;
  }
}
