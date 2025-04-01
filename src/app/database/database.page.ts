import { Component, OnInit } from '@angular/core';
import { CoastersService } from '../coasters.service';
import { Coaster } from '../models.model';

import { HttpClient } from '@angular/common/http';

import { Keyboard } from '@capacitor/keyboard';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-database',
  templateUrl: './database.page.html',
  styleUrls: ['./database.page.scss'],
  imports:  [
    IonicModule,
    RouterModule,
    FormsModule
  ]
})
export class DatabasePage implements OnInit {

  database: any;
  showLoad: boolean;
  fabHidden: boolean;
  operating: string = "all";
  randomCoaster: any;
  manufacturerSearch: string = "";
  parkSearch: string = "";
  coasterSearch: string = "";

  constructor(
    private http: HttpClient,
    public coastersService: CoastersService,
  ) {}

  async ngOnInit() {
    await this.getRandomCoaster()
  }

  async searchDatabase(name, park, manufacturer) {
    if (name && name.trim() || park && park.trim() || manufacturer && manufacturer.trim() != "") {
      this.coastersService.databaseParameterRequest("", name, park, manufacturer, this.operating).then(obj => this.database = obj);
    }
  }

  async getRandomCoaster() {
    let id = Math.floor(Math.random() * 3001);
    await this.coastersService.databaseIdRequest(id).then(obj => {this.randomCoaster = obj})
    Promise.resolve()
  }

  clearFab() {
    setTimeout(() => { this.fabHidden = true }, 100 );
  }
  showFab() {
    setTimeout(() => { this.fabHidden = false }, 100 );
  }

  closeKeyboard(value) {
    if (value == 13) {
      //alert(value)
      Keyboard.removeAllListeners();
     Keyboard.hide().catch(e => console.log(e))
    }
  }
}
