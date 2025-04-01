import { Injectable } from '@angular/core';
import { Keyboard } from '@capacitor/keyboard';
import { AdMobPlus, BannerAd, InterstitialAd, RewardedAd} from '@admob-plus/capacitor';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { settings, Filter } from './models.model'; 
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { AlertController } from '@ionic/angular';
import { CoastersService } from './coasters.service';
import { ToastController } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';
import { BehaviorSubject } from 'rxjs';

SplashScreen.show({
  showDuration: 850,
  autoHide: true
});

@Injectable({
  providedIn: 'root'
})
export class MainService {

  nativeAds: string[] = [];
  public settings: settings = {units: "metric", appearance: "system"};
  private coastersService: CoastersService;
  private alertCtrl: AlertController;
  public filters: Filter;
  public initialFilterObj: Filter;

  constructor(
    private toastController: ToastController,
    private http: HttpClient,
  ) {

      
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

  async setAds() {
    await AdMobPlus.requestTrackingAuthorization().catch(e => console.log(e))
    let request = await this.http.get("https://server.coasterbuddy.app/api/advertisements") //localhost:8080/api/advertisements
    request.subscribe(obj => {
      for(var i in obj["natives"]) {
        this.nativeAds.unshift(obj["natives"][i]);
      }
      if(obj["banners"]) {
        console.log("banners")
        async () => {
          const banner = new BannerAd({
            adUnitId: 'ca-app-pub-3940256099942544/2934735716', //real: ca-app-pub-8387175987712880/8205603241 test: ca-app-pub-3940256099942544/2934735716
            position: 'bottom',
          })
          await banner.show()

          AdMobPlus.addListener('banner.impression', async () => {
            await banner.hide()
          })
        }
      }
    })
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
        this.setUserData();
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

  setUnits(option: string) {
    this.settings.units = option;
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
