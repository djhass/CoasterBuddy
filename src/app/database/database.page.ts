import { Component, OnInit } from '@angular/core';
import { CoastersService } from '../coasters.service';
import { Coaster } from '../models.model';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Keyboard } from '@capacitor/keyboard';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ToastController } from '@ionic/angular/standalone';



@Component({
  selector: 'app-database',
  templateUrl: './database.page.html',
  styleUrls: ['./database.page.scss'],
  imports:  [
    IonicModule,
    RouterModule,
    FormsModule,
    CommonModule
  ]
})
export class DatabasePage implements OnInit {

  database: Array<any> = [];
  searched: boolean = false;
  fabHidden: boolean;
  randomCoaster: Coaster;
  dbSearch: string = "";
  altImg: string = "/assets/a-stylized-black-and-white-line-drawing-of-two-roller-coaster-cars-ascending-a-track-vector.jpg"
  
  constructor(
    private http: HttpClient,
    private toastController: ToastController,
    public coastersService: CoastersService,
  ) {
    this.getRandomCoaster();
  }

  ngOnInit() {
  }

  getImg(img: string) {
    if (img == null || img == "") {
      return this.altImg;
    }
    else {
      return this.coastersService.getCoasterSmallImage(img);
    }
  }

  ionInputEvent() {
    if (this.dbSearch.length > 0) {
      this.searchDatabase(this.dbSearch);
    }
    else {
      this.database = [];
      this.searched = false;
    }
  }

  async getRandomCoaster() {
    this.randomCoaster = await this.http.get<Coaster>("http://localhost:8080/randomride", {
      headers: new HttpHeaders({ 'accept': 'application/json' })
    }).toPromise();
    console.log(this.randomCoaster)
  }

  async searchDatabase(input: string) {
    this.searched = true;
    if (input && input.trim() !== "") {
      let temp: Array<any> = [];
      let requestURL = `http://localhost:8080/search/${input}?include=all`;
      
      try {
        const obj = await this.http.get<Array<Coaster>>(requestURL, {
          headers: new HttpHeaders({ 'accept': 'application/json' })
        }).toPromise();
  
        // If successful, update the temporary array
        Array.prototype.push.apply(temp, obj);
        this.database = temp;
      } catch (error) {
        this.database = [];
        this.searched = false;
        this.showError(error.name);
      }
    }
  }

  async showError(text) {
    const toast = await this.toastController.create({
      message: `An Error occured: ${text}`,
      duration: 3000,
      position: "bottom",
    });

    await toast.present();
  }

  clearFab() {
    setTimeout(() => { this.fabHidden = true }, 100 );
  }
  showFab() {
    setTimeout(() => { this.fabHidden = false }, 100 );
  }

  keyPress(value) {
    if (value == 13) { //enter
      this.searchDatabase(this.dbSearch);
      //Keyboard.removeAllListeners();
      //Keyboard.hide().catch(e => console.log(e));
    }
  }
}
