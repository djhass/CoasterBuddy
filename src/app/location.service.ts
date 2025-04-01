import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ParksService } from './parks.service';
import { MainService } from './main.service';
import { ToastController } from '@ionic/angular';
import { Park } from './models.model';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  latitude: number = 0;
  longitude: number = 0;
  geoLocationOptions: object = {
    enableHighAccuracy: true, timeout: 5000
  };

  constructor(
    private ParksService: ParksService,
    private geolocation: Geolocation,
    public toastController: ToastController,
    protected mainService: MainService
  ) {
  }

  async getGeolocation() {
    await this.geolocation.watchPosition(this.geoLocationOptions)
    await this.geolocation.getCurrentPosition(this.geoLocationOptions).then((resp) => {
        this.setGeoLocation(resp.coords.latitude, resp.coords.longitude);
      }).catch((error) => {
          this.mainService.noLocationMessage()
        });
    return Promise.resolve()
  }
    
  setGeoLocation(lat: number, lon: number) {
    this.latitude = lat;
    this.longitude = lon;
  }
    
  getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
    var dLon = this.deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  }
    
  deg2rad(deg: number) {
    return deg * (Math.PI/180)
  }

  getDistanceFromPark(Park: Park) {
    if(Park && Park.longitude && Park.latitude) {
      return this.getDistanceFromLatLonInKm(this.latitude, this.longitude, Park.latitude, Park.longitude)
    }
    else {
      return NaN
    }
  }

  async getClosePark() {
    let temp;
    await this.getGeolocation()
    for (let i = 0; i < 2100; i++) {
      let distance = this.getDistanceFromPark(this.ParksService.parks[i])
      if (distance < 100) {
        if (temp == undefined || distance > this.getDistanceFromPark(temp)) {
          temp = this.ParksService.parks[i];
        }
      }
    }
    return temp;
  }

  async getCloseTimesParks(obj: any) {
    let parkLon;
    let parkLat;
    let list = [];
  
    for (var i = 0; i < 17; i++) {
      for (var j = 0; j < obj[i].parks.length; j++) {
        parkLon = obj[i].parks[j].longitude;
        parkLat = obj[i].parks[j].latitude;
        
        const distance = this.getDistanceFromLatLonInKm(parkLat, parkLon, this.latitude, this.longitude);
  
        if (distance <= 100) {
          list.push({ park: obj[i].parks[j], distance: distance });
        }
      }
    }
  
    // Sort the list based on the precalculated distances
    list.sort((item1, item2) => item1.distance - item2.distance);
  
    // Extract the parks from the sorted list
    const sortedParks = list.map(item => item.park);
  
    return sortedParks;
  }
  
}
