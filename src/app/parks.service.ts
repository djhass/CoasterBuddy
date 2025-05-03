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

  parkRequest(parkid: string) {
    return this.http.get(`http://localhost:8080/park/${parkid}`, {headers: new HttpHeaders({'accept': 'application/json',})})
  //"https://server.coasterbuddy.app/api/parks?name=" + parkname
  }

  getPark(parkid: number) {
    return {
      ...this.parks.find(park => {
        return parseInt(park.id) == parkid;
      })
    };
  }

  parkIsVisited(park: Park) {
    for (let i in this.coastersService.credit_list) {
      if (this.coastersService.credit_list[i].park && this.coastersService.credit_list[i].park.name == park.name && this.coastersService.credit_list[i].park.id == park.id) {
        return true;
      }
    }
    return false;
  }
}
