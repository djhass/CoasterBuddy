import { Injectable } from '@angular/core';
import { Keyboard } from '@capacitor/keyboard';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { settings, Filter } from './models.model'; 
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { AlertController } from '@ionic/angular';
import { CoastersService } from './coasters.service';
import { ToastController } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';
import { BehaviorSubject } from 'rxjs';
import { Platform } from '@ionic/angular';


SplashScreen.show({
  showDuration: 850,
  autoHide: true
});

@Injectable({
  providedIn: 'root'
})
export class MainService {

  nativeAds: string[] = [];
  public settings: settings = new settings();
  private coastersService: CoastersService;
  private alertCtrl: AlertController;
  public filters: Filter;
  public initialFilterObj: Filter;

  constructor(
    private toastController: ToastController,
    private http: HttpClient,
    private platform: Platform
  ) {
    this.settings.mapsService = this.platform.is('ios') ? "apple" : "google";
      
    try {
      this.getUserData()
    }
    catch {
      console.log("Error Caught")
    }
  }

  private componentExitedSubject = new BehaviorSubject<boolean>(false);
  componentExited$ = this.componentExitedSubject.asObservable();

  setComponentExited() {
      this.componentExitedSubject.next(true);
  }

  setMapService(option: string) {
    this.settings.mapsService = option;

    this.setUserData();
  }

  setDarkMode(option: String) {
    if (option == 'dark') {
      document.body.classList.toggle('dark', true);
      this.settings.appearance = 'dark'
    }
    else if (option == 'light') {
      document.body.classList.toggle('dark', false);
      this.settings.appearance = 'light'
    }
    else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.body.classList.toggle('dark', prefersDark);
      this.settings.appearance = 'system'
    }
    this.setUserData();
  }

  async noInternetMessage() {
    const toast = await this.toastController.create({
      message: "No Internet Connection",
      duration: 5000,
      position: "bottom",
      buttons: [
        {
          text: "Close",
          role: "cancel"
        }
      ]
    });
    await toast.present();
  }

  async noLocationMessage() {
    const toast = await this.toastController.create({
      message: "Could Not Get Location",
      duration: 5000,
      position: "bottom",
      buttons: [
        {
          text: "Close",
          role: "cancel"
        }
      ]
    });
    await toast.present();
  }

  setUserData() {
    Filesystem.writeFile({
      path: 'userdata.json',
      data: JSON.stringify(this.settings),
      encoding: Encoding.UTF8,
      directory: Directory.Documents
    });
  }

  async getUserData() {
    try {
      return await Filesystem.readFile({
        path: 'userdata.json',
        encoding: Encoding.UTF8,
        directory: Directory.Documents
      }).then(obj => {
        this.settings = JSON.parse(obj.data as string);
        this.setDarkMode(this.settings.appearance);
      })
    }
    catch {
      Filesystem.writeFile({
        path: 'userdata.json',
        data: JSON.stringify(this.settings),
        encoding: Encoding.UTF8,
        directory: Directory.Documents
      })
    }
  }

  clearUserData() {
    Filesystem.deleteFile({
      path: 'userdata.json',
      directory: Directory.Documents
    });
  }

  setUnits(option: boolean) {
    this.settings.metric = option;
    this.setUserData();
  }

  closeKeyboard(value) {
    if (value == 13) {
     Keyboard.hide()
    }
  }

  interpolateIonicColors(goodColorVar, badColorVar, percentage) {
    // Convert percentage to a value between 0 and 1
    percentage = Math.min(1, Math.max(0, percentage));
  
    // Get RGB values from Ionic color variables
    const getRGB = colorVar => {
      const rgbArray = window.getComputedStyle(document.documentElement).getPropertyValue(`--ion-color-${colorVar}`).match(/[A-Fa-f0-9]{2}/g)?.map(v => parseInt(v, 16));
      return Array.isArray(rgbArray) ? rgbArray : [0, 0, 0]; // Default to [0, 0, 0] if rgbArray is null
    };
  
    // Calculate interpolated color values
    const interpolateValue = (good, bad) => Math.round(bad + (good - bad) * percentage);
  
    const goodRGB = getRGB(goodColorVar);
    const badRGB = getRGB(badColorVar);
  
    // Interpolate RGB values
    const interpolatedColor = `rgb(${interpolateValue(goodRGB[0], badRGB[0])}, ${interpolateValue(goodRGB[1], badRGB[1])}, ${interpolateValue(goodRGB[2], badRGB[2])})`;

    // Adjust saturation while maintaining hue
    const resultRGB = goodRGB.map((channel, index) => {
      // Find the corresponding channel in the success color
      const maxChannel = badRGB[index];
    
      // Calculate the adjusted channel value based on the rating score
      // Ensure the value does not exceed 255 (maximum RGB value)
      return Math.min(255, Math.round(channel + (maxChannel - channel) * (percentage / 100)));
    });
    return interpolatedColor;
  }

}
