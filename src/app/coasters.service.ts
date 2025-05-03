import { Injectable } from '@angular/core';
import { Credit, Coaster, Park, Make } from './models.model';
import { AlertController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { NavController } from '@ionic/angular';

interface HistoryLog {
  credits: Array<Credit>;
  date: String;
}

@Injectable({
  providedIn: 'root'
})
export class CoastersService {
  public credit_list: Credit[] = [];
  public displayCreditList: Credit[] = [];
  public fullSortedList: Credit[] = [];
  backupTime: String = "";
  selectedCredit: Credit = new Credit(); //used for the edit modal

  history: Array<HistoryLog> = [];

  constructor(
    private alertCtrl: AlertController,
    private http: HttpClient,
    private navCtrl: NavController
  ) {
    this.initialize()
  }

  async initialize() {
    await this.getData();
    this.getHistory()
    this.displayCreditList = [...this.credit_list];
    this.fullSortedList = [...this.credit_list];
  }

  ionViewWillLeave() {
    this.setData()
  }

  logHistory() {
    console.log(this.history)
  }

  //network request functions
    //get coasters from server based on string parameters
    async databaseParameterRequest(general: string, name: string, park: string, manufacturer: string, status: string) {
      /** 
      * Returns Promise with list of coasters from given filter parameters
      * 
      * @param general - string, filters by name, park, and manufacturer
      * @param name - string, filters by name
      * @param park - string, filters by park
      * @param manufacturer - string, filters by manufacturer
      * @param status - string, filters by status ('all', 'open', 'closed')
      * */
      let temp: Array<Coaster> = []
      let requestURL = "https://server.coasterbuddy.app/api/coasters?"
      if (general && general.trim() != "") {
        requestURL+= "general=" + general + "&"
      }
      if (name && name.trim() != "") {
        requestURL+= "name=" + name + "&"
      }
      if (park && park.trim() != "") {
        requestURL+= "park=" + park + "&"
      }
      if (manufacturer && manufacturer.trim() != "") {
        requestURL+= "manufacturer=" + manufacturer + "&"
      }
      if (status != "all") {
        requestURL+= "status=" + status
      }
      
      const obj = await this.http.get<Array<Coaster>>(requestURL, {headers: new HttpHeaders({'accept': 'application/json'})}).toPromise();
      
      Array.prototype.push.apply(temp as Array<Coaster>,obj as Array<Coaster>);
      
      return temp;
    }
    
    //get coaster from server based on id
  async databaseIdRequest(id: string) {
    return this.http.get("https://server.coasterbuddy.app/api/coasters/" + id, {headers: new HttpHeaders({'accept': 'application/json'})}).toPromise()
  }

  //get functions
    //get string for coaster image 
  getCoasterLargeImage(mainImage: string) {
    if (mainImage) {
      return 'https://pictures.captaincoaster.com/1440x1440/' + mainImage
    }
    else {
      return ""
    }
  }

  getCoasterSmallImage(mainImage: string) {
    if (mainImage) {
      return 'https://pictures.captaincoaster.com/280x210/' + mainImage
    }
    else {
      return ""
    }
  }
    //get credit with id
  getCredit(creditid: string) {
    return {
        ...this.credit_list.find(credit => {
            return credit.id === creditid;
        })
     }
  }
    //get boolean for if credit list includes credit of id
  creditIsInList(id: string) {
    for (var i = 0; i < this.credit_list.length; i++) {
        if (this.credit_list[i].id == id) {
            return true
        }
    }
    return false;
  }
    //get list of manufacturers in credit list
  manufacturersInCredits() {
    let tempList: Array<Make> = [];
    for (let i = 0; i < this.credit_list.length; i++) {
      const manufacturer = this.credit_list[i]?.make;
      if (typeof this.credit_list[i].make != "undefined" && this.credit_list[i].make != null) {
        if ((manufacturer && !(tempList.find(obj =>{
          return obj.id == manufacturer.id
        })))) {
          tempList.push(manufacturer)
        }
      }
    }
    return tempList;
  }
    //get list of parks in credit list
    parksInCredits() {
      let tempList: Array<Park> = [];
      for (let i = 0; i < this.credit_list.length; i++) {
        const park = this.credit_list[i]?.park;
        if (typeof park !== 'undefined' && park !== null) {
          // Check if the park already exists in the tempList
          if (!tempList.some(existingPark => (existingPark.id === park.id) && (existingPark.name === park.name))) { 
            tempList.push(park);
          }
        }
      }
      return tempList;
    }


  //credit list manipulation functions
    //delete credit given id
  deleteCredit(position: number) {
    this.credit_list.splice(position, 1);
    this.setData()
  }
    //clears list
  clearList() {
    this.credit_list = []
  }
    //add 1 to tally attribute of credit of given id 
  tallyCredit(id: string) {
    //get specific credit using "id"
    var credit = this.credit_list.find(credit => {
      return credit.id === id;
    })
    if (!credit) {
      throw new Error("could not find credit of id " + id);
    }
    //add tally to selcted credit
    if (!credit.tally) {
      credit.tally = 0;
    }
    credit.tally++;
  }
  //set attributes of credit of id
  set(id: string, object: { [key: string]: any }) {
    let credit = (this.credit_list.find(obj => obj.id == id) as any);
    for (let prop in object) {
      credit[prop] = object[prop];
    }
    this.setData();
  }
    
    //add coaster to credit list
  pushCredit(credit: Credit) {
    this.credit_list.unshift(credit);
    this.setData()
  }

  //stats functions
    //returns number of parks in credit list
  numberOfParksInCredits() {
    let temp: Array<string> = []
    for (let credit of this.credit_list) {
      if(credit.park?.id && !temp.includes(credit.park?.id)) {
        temp.push(credit.park?.id)
      }
    }
    return temp.length;
  }
    //returns number of manufacturers in credit list
  numberOfMansInCredits() {
    let temp: Array<String> = []
    for (let credit of this.credit_list) {
      if(credit.make?.name && !temp.includes(credit.make?.name)) {
        temp.push(credit.make?.name)
      }
    }
    return temp.length;
  }

  //file functions
    //get credits from files
  async getData() {
    const contents = await Filesystem.readFile({
      path: 'credits.json',
      encoding: Encoding.UTF8,
      directory: Directory.Documents,
    });
    this.credit_list = JSON.parse(contents.data as string)
    return Promise.resolve
  }
    //write current credit list to files
  async setData() {
    //get currentCredits from file
    let currentCredits = []

    await Filesystem.readFile({
      path: 'credits.json',
      encoding: Encoding.UTF8,
      directory: Directory.Documents,
    }).then(obj => {
      currentCredits = JSON.parse(obj.data as string)
    }).catch(err => {currentCredits = []}); // if file doesn't exist, make currentCredits blank. 

    if(currentCredits.length < 2 || (this.credit_list != undefined && this.credit_list.length != undefined && this.credit_list.length != 0)) { //if overiding with blank data, don't proceed
      await Filesystem.writeFile({
        path: 'credits.json',
        data: JSON.stringify(this.credit_list),
        encoding: Encoding.UTF8,
        directory: Directory.Documents
      });
      this.addToHistory(this.credit_list)
    }
    this.displayCreditList = this.credit_list;
  };
    //backup current credit list to files
  async backup() {
    this.alertCtrl.create({
      header: 'Backup Data?',
      message: 'Do you want to backup your current credit list? It will overwrite any previous backup.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Backup',
          handler: async () => {
            let contents = await Filesystem.readFile({
              path: 'credits.json',
              encoding: Encoding.UTF8,
              directory: Directory.Documents,
            })
            
            let finalData = {
              time: new Date(),
              credits: JSON.parse(contents.data as string)
            }
        
            await Filesystem.writeFile({
              path: 'backup.json',
              data: JSON.stringify(finalData),
              directory: Directory.Documents,
              encoding: Encoding.UTF8
            })

          }
        },
    ]
  })
  .then(alertEl => {
      alertEl.present();
  });

    return Promise.resolve
  }
    //set credit list to backup up data
  async restore() {
    let contents = await Filesystem.readFile({
      path: 'backup.json',
      encoding: Encoding.UTF8,
      directory: Directory.Documents,
    })

    let Contents = JSON.parse(contents.data as string)

    this.alertCtrl.create({
      header: 'Restore Backup?',
      message: `You will replace your credit list with the backup created on ${new Date(Contents.time).toDateString()} at ${new Date(Contents.time).toLocaleTimeString()} with ${Contents.credits.length} coasters?` ,
      buttons: [
      {
        text: 'Cancel',
        role: 'cancel'
      },
      {
        text: 'Restore',
        handler: () => {
          this.credit_list = Contents.credits
          this.setData()
        }
      }
    ]
  })
  .then(alertEl => {
      alertEl.present();
  });
    
    return Promise.resolve
  }
    //set variable backupTime to string of the time of the last backup

  async addToHistory(list: Array<Credit>) {

    let maxHistoryLength = 30;

    await this.getHistory();

    this.history.unshift({
      credits: list,
      date: new Date().toString()
    });
    if (this.history.length > maxHistoryLength) {
      this.history.pop();
    }
    await Filesystem.writeFile({
      path: 'history.json',
      data: JSON.stringify(this.history),
      encoding: Encoding.UTF8,
      directory: Directory.Documents
    });
    
  }

  async getHistory() {
    try {
      const contents = await Filesystem.readFile({
        path: 'history.json',
        encoding: Encoding.UTF8,
        directory: Directory.Documents,
      });
      this.history = JSON.parse(contents.data as string)
    }
    catch {
      this.history = [];
    }

    Promise.resolve()
  }

  revertFromHistory(index: number) {
    this.credit_list = this.history[index].credits;
    this.displayCreditList = this.history[index].credits;
    this.setData();
  }

  clearAllData() {
    Filesystem.deleteFile({
      path: 'credits.json',
      directory: Directory.Documents,
    });
    Filesystem.deleteFile({
      path: 'history.json',
      directory: Directory.Documents,
    });
    this.credit_list = []
    this.history = []
  }


}
