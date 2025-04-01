import { Injectable } from '@angular/core';
import { Park } from './models.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CoastersService } from './coasters.service';

@Injectable({
  providedIn: 'root'
})
export class ParksService {

public parks: Array<Park> = [];
  constructor(
    private http: HttpClient,
    private coastersService: CoastersService
  ) {
    this.setParks()
  }

  async setParks() {
    let request = await this.http.get("assets/data/parks.json")
    await request.subscribe(obj => {
      let tempArray: Array<Park> = [];
      for(var i in obj) {
        tempArray.push(obj[i]);
      }
      this.parks = tempArray
    })
    return Promise.resolve()
  }

  parkRequest(parkname: string) {
    return this.http.get("https://server.coasterbuddy.app/api/parks?name=" + parkname, {headers: new HttpHeaders({'accept': 'application/json',})})
  }

  getPark(parkname: string) {
    return {
      ...this.parks.find(park => {
        return park.name === parkname;
      })
    };
  }

  parkIsVisited(parkname: string) {
    for (let i in this.coastersService.credit_list) {
      if (this.coastersService.credit_list[i].park && this.coastersService.credit_list[i].park.name == parkname) {
        return true;
      }
    }
    return false;
  }
}
