import { Component, OnInit, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CoastersService } from 'src/app/coasters.service';
import { Credit, Filter, Range, StatusesOptions, MaterialsOptions } from 'src/app/models.model';
import { MainService } from 'src/app/main.service';
import { LogPage } from 'src/app/log/log.page';
import { IonicModule } from '@ionic/angular'; // Import IonicModule for Ionic components
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import * as _ from 'lodash';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  imports: [
    IonicModule,
    RouterModule,
    FormsModule
  ]
})


export class FilterComponent implements OnInit {

  credit_list: Array<Credit>;
  settings: any;
  maxTally: number;
  earliestDate: Date;
  currentDate: Date;
  models: Array<String>;
  parks: Array<String>;
  manufacturers: Array<String>;
  topSpeed: number;
  topHeight: number;
  topLength: number;
  logPage: LogPage;

  initialFilterObj = new Filter();

  filters: Filter;

  test: Range;

  constructor(
    private modalController: ModalController,
    private coastersService: CoastersService,
    public mainService: MainService
  ) { 

    this.credit_list = [...this.coastersService.credit_list];
    this.settings = this.mainService.settings;
    this.getMaxTally();
    this.getOldestDate();
    this.currentDate = new Date();
    this.parks = this.coastersService.parksInCredits();
    this.manufacturers = this.coastersService.manufacturersInCredits();
    this.models = this.coastersService.typesInCredits()
    this.setTopValues();

    this.initializeFilters();
    
    if (this.mainService.filters) {
      this.filters = _.cloneDeep(this.mainService.filters);
    }
    if (this.mainService.initialFilterObj) {
      this.initialFilterObj = _.cloneDeep(this.mainService.initialFilterObj);
    }

    console.log(this.earliestDate)
    
  }

  ngOnInit() {

  }

  closeModal() { 
    this.modalController.dismiss();
  }

  getMaxTally() {
    let high = 10;
    for (let i = 0; i < this.credit_list.length; i++) {
      if (this.credit_list[i].tally > high) {
        high = this.credit_list[i].tally;
      }
    }
    this.maxTally = high;
  }

  getOldestDate() {
    let tempDate = new Date();

    for (let i = 1; i < this.credit_list.length; i++) {
      if (this.credit_list[i].time) {
        let newDate = new Date(this.credit_list[i].time);
        if (newDate < tempDate) {
          tempDate = newDate;
        }
      }
    }
    this.earliestDate = tempDate;
  }

  setTopValues() {
    if (this.settings.units == "imperial") { //imperial units
      this.topSpeed = 150; //mph
      this.topHeight = 456; //ft
      this.topLength = 8140; //ft
    }
    else {
      this.topSpeed = 240; //km/h
      this.topHeight = 140; //m
      this.topLength = 2480; //m
    }
  }

  initializeFilters() {
    this.filters = new Filter();
    this.filters.speedRange = new Range(0,this.topSpeed);
    this.filters.heightRange = new Range(0, this.topHeight);
    this.filters.lengthRange = new Range(0, this.topLength);
    this.filters.inversionRange = new Range(0, 14);
    this.filters.popularityRange = new Range(1,100);
    this.filters.tallyRange = new Range(0, this.maxTally);
    this.filters.dateRange = {lower: this.earliestDate.toISOString(), upper: new Date().toISOString()};
    this.filters.keepEmptyTallys = true;
    this.filters.keepEmptyDates = true;
    this.filters.materialsOptions = new MaterialsOptions();
    this.filters.statusesOptions = new StatusesOptions();
    this.filters.parks = this.parks;
    this.filters.manufacturers = this.manufacturers;
    this.filters.models = this.models;
    this.initialFilterObj = _.cloneDeep(this.filters); //sets all the same values to comparison object
  }

  submit() {
    this.filters.appliedFilters = true;
    this.initialFilterObj.appliedFilters = true; 
    this.mainService.filters = this.filters
    this.mainService.initialFilterObj = this.initialFilterObj;
    this.applyFilters();
    this.closeModal();
  }

  clearFilters() {
    this.initializeFilters();
    this.mainService.filters = this.filters
    this.filters.appliedFilters = false;
    this.initialFilterObj.appliedFilters = false; 
    this.mainService.filters.appliedFilters = false;
    this.coastersService.displayCreditList = [...this.coastersService.credit_list];
    this.closeModal();
  }

  applyFilters() {

    let adjustedSpeedRange = _.cloneDeep(this.filters.speedRange);
    let adjustedheightRange = _.cloneDeep(this.filters.heightRange);
    let adjustedlengthRange = _.cloneDeep(this.filters.lengthRange);

    adjustedSpeedRange.lower /= (this.mainService.settings.units == "imperial" ? 0.621371 : 1);
    adjustedSpeedRange.upper /= (this.mainService.settings.units == "imperial" ? 0.621371 : 1);
    adjustedheightRange.lower /= (this.mainService.settings.units == "imperial" ? 3.280839895 : 1);
    adjustedheightRange.upper /= (this.mainService.settings.units == "imperial" ? 3.280839895 : 1); //3.280575539
    adjustedlengthRange.lower /= (this.mainService.settings.units == "imperial" ? 3.280839895 : 1);
    adjustedlengthRange.upper /= (this.mainService.settings.units == "imperial" ? 3.280839895 : 1);

    adjustedSpeedRange.lower = Math.round(adjustedSpeedRange.lower);
    adjustedSpeedRange.upper = Math.round(adjustedSpeedRange.upper);
    adjustedheightRange.lower = Math.round(adjustedheightRange.lower);
    adjustedheightRange.upper = Math.round(adjustedheightRange.upper);
    adjustedlengthRange.lower = Math.round(adjustedlengthRange.lower);
    adjustedlengthRange.upper = Math.round(adjustedlengthRange.upper);

    this.coastersService.displayCreditList = [...this.coastersService.fullSortedList];

    this.coastersService.displayCreditList = this.coastersService.displayCreditList.filter(credit => {
      return (
        (isNaN(credit.speed) || ((adjustedSpeedRange.lower <= credit.speed) && (credit.speed <= adjustedSpeedRange.upper))) && 
        (isNaN(credit.height) || ((adjustedheightRange.lower <= credit.height) && (credit.height <= adjustedheightRange.upper))) &&
        (isNaN(credit.length) || ((adjustedlengthRange.lower <= credit.length) && (credit.length <= adjustedlengthRange.upper))) &&
        (isNaN(credit.inversionsNumber) || ((this.filters.inversionRange.lower <= credit.inversionsNumber) && (credit.inversionsNumber <= this.filters.inversionRange.upper))) &&
        (!credit.score || ((this.filters.popularityRange.lower <= Math.round(parseFloat(credit.score))) && (Math.round(parseFloat(credit.score)) <= this.filters.popularityRange.upper))) &&
        (isNaN(credit.tally) || ((this.filters.tallyRange.lower <= credit?.tally) && (credit?.tally <= this.filters.tallyRange.upper))) &&
        ((this.filters.keepEmptyTallys) || !(!credit.tally)) &&
        ((!credit.time || (new Date(this.filters.dateRange.lower) <= new Date(credit.time)) && (new Date(credit.time) <= new Date(this.filters.dateRange.upper)))) &&
        ((this.filters.keepEmptyDates) || !(!credit.time)) &&
        (((this.filters.materialsOptions.wood) && (credit.materialType.name == "Wooden")) ||
          ((this.filters.materialsOptions.steel) && (credit.materialType.name == "Steel")) ||
          ((this.filters.materialsOptions.hybrid) && ((credit.materialType.name != "Wooden") && credit.materialType.name != "Steel"))) &&
        (((this.filters.statusesOptions.defunct) && (credit.status.name == "status.closed.definitely")) ||
          ((this.filters.statusesOptions.operating) && (credit.status.name == "status.operating")) ||
          ((this.filters.statusesOptions.standing) && ((credit.status.name != "status.closed.definitely") && credit.status.name != "status.operating"))) &&
        (!credit.park || (this.filters.parks.includes(credit.park.name))) &&
        (!credit.manufacturer || (this.filters.manufacturers.includes(credit.manufacturer.name))) &&
        (!credit.seatingType || (this.filters.models.includes(credit.seatingType.name)))
      
      )
    })
  }
}
