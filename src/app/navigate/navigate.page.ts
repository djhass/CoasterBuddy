import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ParksService } from '../parks.service';
import { LocationService } from '../location.service';
import { Park } from '../models.model';
import { CoastersService } from '../coasters.service';
import { MainService } from '../main.service'
import { AlertController } from '@ionic/angular';
import { Coaster } from '../models.model';
import { ViewChild, ElementRef } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { ToastController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular'; // Import IonicModule for Ionic components
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

declare var google: any;

class mapOptions {
	redMarker: boolean;
  blueMarker: boolean;
  route: boolean;
}

@Component({
  selector: 'app-navigate',
  templateUrl: './navigate.page.html',
  styleUrls: ['./navigate.page.scss'],
  imports: [
    IonicModule,
    RouterModule,
    FormsModule,
    CommonModule
  ]
})
export class NavigatePage implements OnInit {
  map: any;
  trip: Array<object> = [];
  tripList: Array<any> = [];
  number: number = 0;
  states: Array<any>;
  stateSelect: string;
  directionsService: any = new google.maps.DirectionsService;
  directionsDisplay: any = new google.maps.DirectionsRenderer;
  selectedPark: Park;
  geoLocationOptions: any = {
    enableHighAccuracy: true, timeout: 5000, maximumAge: 0
  };
  savedTrip: Array<object> = [];
  searchParks: Array<Park> = [];
  distance: number = -1;
  time: number = -1;
  mapOptions: mapOptions = {
    redMarker: true,
    blueMarker: true,
    route: true
  };
  redMarker: boolean = true;
  fabHidden: boolean;

  
  @ViewChild('map', {read: ElementRef, static: false}) mapRef: ElementRef;
  
  infoWindows: any = [];
  markers: any = [];
  mapMarkers: any = [];
  
    constructor(
    public parksService: ParksService,
    private LocationService: LocationService,
    public mainService: MainService,
    private alertCtrl: AlertController,
    public platform: Platform,
    private toastController: ToastController,
    private locationService: LocationService,
    private cdr: ChangeDetectorRef
    )
    {
      this.directionsDisplay.setOptions({
        markerOptions: {
          visible: false,
        },
        suppressInfoWindows: true,
        preserveViewport: true
      });
    }
    
    ngOnInit() {
      //create new file if one doesn't exist
      Filesystem.readFile({
        path: 'trips.json',
        encoding: Encoding.UTF8,
        directory: Directory.Documents,
      }).catch(e => {this.setTrips()})
  }
  
  async ionViewDidEnter() {
    await this.LocationService.getGeolocation();
    await this.getTrips();
    this.showMap(); 
  }
  
  clearFab() {
    setTimeout(() => { this.fabHidden = true }, 100 );
  }
  showFab() {
    setTimeout(() => { this.fabHidden = false }, 100 );
  }

  searchItems(ev: any) {
    const val = ev.target.value;
    if(val == "") {
      this.searchParks = [];
    }
    else {
      this.searchParks = this.parksService.parks.filter((park: any) => {
        return (park.name.toLowerCase().indexOf(val.toLowerCase()) > -1)
      })
    }
  }
  
  async getTrips() {
    const contents = await Filesystem.readFile({
      path: 'trips.json',
      encoding: Encoding.UTF8,
      directory: Directory.Documents,
    });
    this.tripList = JSON.parse(contents.data as string)
    return Promise.resolve()
  }
  
  async setTrips() {
    await Filesystem.writeFile({
      path: 'trips.json',
      data: JSON.stringify(this.tripList),
      encoding: Encoding.UTF8,
      directory: Directory.Documents
    });
  }
  
  showMap() {
    if (this.locationService.longitude == undefined && this.locationService.latitude == undefined) {
      var options = {
        center: {lat: 39.8283, lng: -98.5795},
        zoom: 4,
        disableDefaultUI: true
      }  
    }
    else {
      var options = {
        center: {lat: this.locationService.latitude, lng: this.locationService.longitude},
        zoom: 5,
        disableDefaultUI: true
      }  
    }
  
    this.map = new google.maps.Map(this.mapRef.nativeElement, options);
    this.directionsDisplay.setMap(this.map)
    this.addMarkersToMap();
    this.calculateAndDisplayRoute()
    google.maps.event.trigger(this.map, 'resize')
  }
  
  calculateAndDisplayRoute() {
    if(this.tripList[this.number].list.length == 0 || this.tripList.length == 0) {
      this.number = 0;
      this.distance = 0;
      this.directionsDisplay.setDirections({
        routes: [
          {
            lat: this.locationService.latitude, lng: this.locationService.longitude
          },
          {
            lat: this.locationService.latitude, lng: this.locationService.longitude
          }
        ]
      })
      return
    }
    if (!this.mapOptions.route) {
      this.directionsDisplay.setDirections({
        routes: [
          {
            lat: this.locationService.latitude, lng: this.locationService.longitude
          },
          {
            lat: this.locationService.latitude, lng: this.locationService.longitude
          }
        ]
      })
      return
    }
    let wayPointsList = []
  
    for(let i = 0; i < this.tripList[this.number].list.length; i++) {
      wayPointsList.push({
        location: {lat: this.tripList[this.number].list[i].latitude, lng: this.tripList[this.number].list[i].longitude},
        stopover: true
      })
    }
  
    this.directionsService.route({
      origin: {lat: this.locationService.latitude, lng: this.locationService.longitude},
      destination: {lat: wayPointsList[wayPointsList.length-1].location.lat, lng: wayPointsList[wayPointsList.length-1].location.lng},
      waypoints: wayPointsList,
      provideRouteAlternatives: false,
      travelMode: google.maps.TravelMode.DRIVING,
      drivingOptions: {
        departureTime: new Date(/* now, or future date */),
        trafficModel: 'bestguess'
      },
      unitSystem: this.mainService.settings.metric ? google.maps.UnitSystem.METRIC : google.maps.UnitSystem.IMPERIAL
    }, (result, status) => {
      if (status === 'OK') {
        this.distance = -1
        this.time = -1
        for(let i = 0; i < result.routes[0].legs.length; i++) {
          this.distance += Math.round(result.routes[0].legs[i].distance.value / (!this.mainService.settings.metric ? 1608.05882353 : 1000))
          this.time += result.routes[0].legs[i].duration.value
        }
        this.directionsDisplay.setDirections(result);
      } else {
        this.time = 0;
        this.distance = 0;
        this.presentToast("There was an error finding a path \n Error: " + result.status);
      }
    });
  }
  
  tripSelectChanged() {
    if (this.number != -1) {
      this.addMarkersToMap()
    }
    this.calculateAndDisplayRoute()
  }
  
  addMarkersToMap() {
    this.clearMarkers()
    this.mapMarkers = []
  
    var color;
  
    //this.setMarkers();
    for (let park of this.parksService.parks) {
      color = "red";
      if (this.tripList.length > 0) {
        if (this.tripList[this.number].list.find((obj) => {
          return obj.id == park.id
        })) {
          color = "ltblue";
        } 
      }
      let position = new google.maps.LatLng(park.latitude, park.longitude);
      let mapMarker = new google.maps.Marker({
        position: position,
        title: park.name,
        id: park.id,
        latitude: park.latitude,
        longitude: park.longitude,
        icon: "assets/Maps/" + color + "-dot.png",
        visible: color == "red" ? this.mapOptions.redMarker : this.mapOptions.blueMarker
      });
  
      mapMarker.setMap(this.map);
      this.addInfoWindowToMarker(mapMarker);
      this.mapMarkers.push(mapMarker);
    }
  }
  
    selectPark(parkId) {
      this.selectedPark = {...this.parksService.getPark(parkId)};
      this.cdr.detectChanges();
    }
    
    addInfoWindowToMarker(marker) {
      let infoWindowContent = "<h5 style=\"color: black;\">" + marker.title + "</h5>" 
      let infoWindow = new google.maps.InfoWindow({
        content: infoWindowContent
      });
      marker.addListener('click', () => {
        if (this.mapMarkers.length != this.markers.length) {
          this.mapMarkers[this.mapMarkers.length - 1].setMap(null);
        }
        this.closeAllInfoWindows();
        this.selectPark(marker.id);
        infoWindow.open(this.map, marker);
      });
      this.infoWindows.push(infoWindow);
    }
  
    openWindow(park) {
  
      if (this.mapMarkers.length != this.markers.length) {
        this.mapMarkers[this.mapMarkers.length - 1].setMap(null);
      }
  
      let position = new google.maps.LatLng(park.latitude, park.longitude);
      var color = "red";
  
      if (this.tripList[this.number].list.find((Park) => park.name == Park.name)) {
        color = "ltblue";
      }
  
      let mapMarker = new google.maps.Marker({
        position: position,
        title: park.name,
        latitude: park.latitude,
        longitude: park.longitude,
        icon: "assets/Maps/" + color + "-dot.png"
      });
      this.mapMarkers.push(mapMarker)
      mapMarker.setMap(this.map);
      let infoWindowContent = "<h5 style=\"color: black;\">" + mapMarker.title + "</h5>"
      let infoWindow = new google.maps.InfoWindow({
        content: infoWindowContent
      });
      this.closeAllInfoWindows();
      this.selectPark(mapMarker.id)
      infoWindow.open(this.map, mapMarker);
      this.infoWindows.push(infoWindow);
  
      infoWindow.addListener('closeclick', () => {
       mapMarker.setMap(null);
      });
  
      mapMarker.addListener('click', () => {
        mapMarker.setMap(null);
       });
    }
  
    setMarkers() {
      this.markers = []
      for (var i = 0; i < this.parksService.parks.length; i++) {
        this.markers.push(this.parksService.parks[i])
      }
    }
  
    clearMarkers() {
      for (var i = 0; i < this.mapMarkers.length; i++) {
        this.mapMarkers[i].setMap(null);
      }
    }
  
    closeAllInfoWindows() {
      for(let window of this.infoWindows) {
        window.close();
      }
    }
  
    pushTripAlert() {
      if (this.tripList.length == 0) {
        this.alertCtrl.create({
          header: "You must have a trip to add this to",
        })
        .then(alertEl => {
          alertEl.present();
        });
      }
      else {
        this.alertCtrl.create({
          header: 'Add ' + this.selectedPark.name + ' to ' + this.tripList[this.number].name + '?',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel'
            },
            {
              text: 'Yes',
              handler: data => {
                this.pushTripList(this.selectedPark);
                this.replaceMarker(this.selectedPark);
                this.calculateAndDisplayRoute()
              }
            }
          ]
        })
        .then(alertEl => {
            alertEl.present();
        })
      }
    }
  
    pushTrip(name) {
      this.tripList.unshift({
        value: this.tripList.length +1,
        name: name,
        list: []
      })
    this.number = 0;
    }
  
    pushTripList(park) {
      this.tripList[this.number].list.push(park)
      this.setTrips()
    }
  
    listName() {
      this.alertCtrl.create({
        header: 'Name of List',
        inputs: [
          { 
            id: 'name',
            name: 'name',
            placeholder: 'Name'
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel'
          },
          {
            text: 'Save',
            handler: data => {
              this.pushTrip(data.name);
              this.setTrips()
              this.resetMapOptions()
              this.addMarkersToMap()
              this.calculateAndDisplayRoute()
            }
          }
        ]
      })
      .then(alertEl => {
          alertEl.present();
      });
    }
  
    deleteTrip() {
      this.alertCtrl.create({
        header: 'Delete ' + this.tripList[this.number].name + '?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel'
          },
          {
            text: 'Delete',
            handler: () => {
              if (this.tripList.length > 0) {
                this.tripList.splice(this.number, 1);
                this.setTrips()
                this.number = 0;
                this.addMarkersToMap()
                this.calculateAndDisplayRoute()
              }
            }
          }
        ]
      })
      .then(alertEl => {
        alertEl.present();
      });
    }
  
    deleteFromTrip(park) {
      this.alertCtrl.create({
        header: 'Delete ' + this.tripList[this.number].list[park].name + '?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel'
          },
          {
            text: 'Delete',
            handler: () => {
              this.tripList[this.number].list.splice(park, 1);
              this.replaceMarker(this.tripList[this.number].list[park])
              this.setTrips()
              this.calculateAndDisplayRoute()
            }
          },
        ]
      })
      .then(alertEl => {
        alertEl.present();
      });
    }
  
    planSelect() {
      if(this.number == -1) {
        this.number = 0;
        this.listName();
      }
    }
  
    replaceMarker(park) {
      var color = "red";
      if (this.tripList[this.number].list.find((Park) => Park.id == park.id)) {
        color = "ltblue";
      }
      var index = this.mapMarkers.findIndex(x => x.title == park.name);
      var mapMarker = this.mapMarkers[index];
      mapMarker.icon = "assets/Maps/" + color + "-dot.png"
      mapMarker.visible = color == "red" ? this.mapOptions.redMarker : this.mapOptions.blueMarker
      this.mapMarkers[index].setMap(null);
      this.mapMarkers[index] = mapMarker;
      mapMarker.setMap(this.map);
    }
  
    searchBarCleared() {
      setTimeout(() => { this.searchParks = [] }, 10 );
    }
  
    toHoursAndMinutes(seconds) {
      let returnString = ""
  
      let minutes = Math.floor(seconds / 60);
      let hours = Math.floor(minutes / 60);
  
      minutes = minutes - (hours * 60);
  
      if(hours != 0) {
        returnString += hours + " hr "
      }
      returnString +=  minutes + " m"
      return  returnString
    }
  
    reorderItems(event) {
      const itemMove = this.tripList[this.number]?.list.splice(event.detail.from, 1) [0];
      this.tripList[this.number]?.list.splice(event.detail.to, 0, itemMove);
      this.setTrips()
      event.detail.complete();
      this.calculateAndDisplayRoute()
    }
  
    resetMapOptions() {
      this.mapOptions = {
        redMarker: true,
        blueMarker: true,
        route: true
      }
    }
  
    async presentToast(message) {
      const toast = await this.toastController.create({
        message: message,
        duration: 3500,
        position: "top",
        buttons: [
          {
            text: "Close",
            role: "cancel"
          }
        ]
      });
  
      await toast.present();
    }
  

}
