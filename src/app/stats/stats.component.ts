import { Component, OnInit, Input } from '@angular/core';
import { HomePage } from '../home/home.page';
import { CoastersService } from '../coasters.service';
import { AlertController } from '@ionic/angular';
import { ParksService } from '../parks.service';
import { Coaster, Park } from '../models.model';
import { Credit } from '../models.model';
import { ridden } from '../models.model';
import { ManufacturersService } from '../manufacturers.service';
import { ModalController, NavParams} from '@ionic/angular';
import { IonicModule } from '@ionic/angular'; // Import IonicModule for Ionic components

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
  imports: [
    IonicModule // Import the module for Ionic components
  ],
})
export class StatsComponent implements OnInit {

  coasters: Coaster[] = [];
  ridden: ridden[] = [];
  list: Array<object> = [];
  credit_list: Credit[] = [];
  timeSortList: Array<object> = [];

  constructor(
    public coastersService: CoastersService, 
    private modalController: ModalController,
    public navParams: NavParams,
  ) { 
    this.sortTime();
  }

  ngOnInit() {}

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  sortTime() {
    var list = [];
    for (var i = 0; i < this.coastersService?.credit_list?.length; i++) {
      if (list.length == 0) {
        list.push(this.coastersService?.credit_list[i])
      }
      else if (Date.parse(this.coastersService?.credit_list[i]?.time ?? "") < Date.parse(list[list.length -1]?.time ?? "")) {
        list.push(this.coastersService?.credit_list[i])
      }
      else {
        for (var j = 0; j < list.length; j++) {
          if (Date.parse(list[j]?.time ?? "") < Date.parse(this.coastersService?.credit_list[i]?.time ?? "")) {
            list.splice(j, 0, this.coastersService?.credit_list[i])
            break;   
          }
        }        
      }
    }
    this.timeSortList = list;
  }
  
  findVisitedParks() {
    var tempList: Array<String> = [];
    // if park is not in tempList, push it
    for (var i = 0; i <this.coastersService.credit_list.length; i++) {
      if (!tempList.includes(this.coastersService.credit_list[i]?.park?.name ?? "")) {
        tempList.push(this.coastersService.credit_list[i]?.park?.name ?? "")
      }
    }
    return tempList.length
  }

  findVisitedMans() {
    var tempList: Array<String> = [];
    // if park is not in tempList, push it
    for (var i = 0; i <this.coastersService.credit_list.length; i++) {
      if (!tempList.includes(this.coastersService.credit_list[i]?.manufacturer?.name ?? "")) {
        tempList.push(this.coastersService.credit_list[i]?.manufacturer?.name ?? "")
      }
    }
    return tempList.length
  }

  findVisitedModels() {
    var tempList: Array<String> = [];
    // if park is not in tempList, push it
    for (var i = 0; i <this.coastersService.credit_list.length; i++) {
      if (!tempList.includes(this.coastersService.credit_list[i]?.seatingType?.name ?? "")) {
        tempList.push(this.coastersService.credit_list[i]?.seatingType?.name ?? "")
      }
    }
    return tempList.length
  }

  findVisitedWood() {
    var amount = 0;
    // if park is not in tempList, push it
    for (var i = 0; i <this.coastersService.credit_list.length; i++) {
      if (this.coastersService.credit_list[i]?.materialType?.name == "Wooden") {
        amount++;
      }
    }
    return amount
  }

  findVisitedSteel() {
    var amount = 0;
    // if park is not in tempList, push it
    for (var i = 0; i <this.coastersService.credit_list.length; i++) {
      if (this.coastersService.credit_list[i]?.materialType?.name == "Steel") {
        amount++;
      }
    }
    return amount
  }

  findTallestCoaster() {
    var returnCoaster: Coaster = this.coastersService?.credit_list[0];
    for (var i = 1; i < this.coastersService.credit_list.length; i++) {
      var currentHeight = this.coastersService?.credit_list[i]?.height
      if (!currentHeight) {
        currentHeight = 0;
      }
      if (returnCoaster.height && (currentHeight > returnCoaster?.height)) {
        returnCoaster = this.coastersService.credit_list[i]
      }
    }
    return returnCoaster
  }

  findTallyCoaster() {
    var returnCoaster: Credit = this.coastersService?.credit_list[0];
    for (var i = 1; i < this.coastersService.credit_list.length; i++) {
      var currentTally = this.coastersService?.credit_list[i]?.tally
      if (!currentTally) {
        currentTally = 0;
      }
      if (returnCoaster.tally && (currentTally > returnCoaster?.tally)) {
        returnCoaster = this.coastersService.credit_list[i]
      }
    }
    return returnCoaster
  }
}
