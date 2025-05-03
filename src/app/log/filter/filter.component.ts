import { Component, OnInit, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CoastersService } from 'src/app/coasters.service';
import { Credit, Park, Filter, Range, UnitObj, Make } from 'src/app/models.model';
import { MainService } from 'src/app/main.service';
import { LogPage } from 'src/app/log/log.page';
import { IonicModule } from '@ionic/angular'; // Import IonicModule for Ionic components
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import * as _ from 'lodash';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  imports: [
    IonicModule,
    RouterModule,
    FormsModule,
    CommonModule
  ]
})


export class FilterComponent implements OnInit {

  credit_list: Array<Credit>;
  settings: any;
  maxTally: number;
  earliestDate: Date;
  currentDate: Date;
  models: Array<String>;
  parks: Array<Park>;
  makes: Array<Make>;
  topSpeed: number;
  topHeight: number;
  topLength: number;
  logPage: LogPage;

  initialFilterObj = new Filter();

  filters: Filter;


  constructor(
    private modalController: ModalController,
    private coastersService: CoastersService,
    public mainService: MainService
  ) { 

    this.credit_list = [...this.coastersService.credit_list];
    this.getMaxTally();
    this.getOldestDate();
    this.currentDate = new Date();
    this.parks = this.coastersService.parksInCredits().filter(obj => {return obj.id})
    this.makes = this.coastersService.manufacturersInCredits().filter(obj => {return obj.id})
    this.setTopValues();

    this.initializeFilters();
    
    if (this.mainService.filters) {
      this.filters = _.cloneDeep(this.mainService.filters);
    }
    if (this.mainService.initialFilterObj) {
      this.initialFilterObj = _.cloneDeep(this.mainService.initialFilterObj);
    }
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
    if (this.mainService.settings.metric) { //metric units
      this.topSpeed = 80; //km/h
      this.topHeight = 30; //m
      this.topLength = 300; //m
    }
    else {
      this.topSpeed = 50; //mph
      this.topHeight = 100; //ft
      this.topLength = 1000; //ft
    }
    for (let i = 0; i < this.coastersService.fullSortedList.length; i++) {
      let credit = this.coastersService.fullSortedList[i];
      let speed, height, length = 0

      //extract values
      if (this.mainService.settings.metric) { //if metric
        //speed
        if (credit.max_speed.metric) {
          speed = credit.max_speed.metric
        }
        else if (credit.max_speed.imperial) {
          speed = Math.round(credit.max_speed.imperial / 0.621371)
        }
        else {
          speed = 0;
        }

        //height
        if (credit.max_height.metric) {
          height = credit.max_height.metric
        }
        else if (credit.max_height.imperial) {
          height = Math.round(credit.max_height.imperial / 3.280839895)
        }
        else {
          height = 0;
        }

        //length
        if (credit.length.metric) {
          length = credit.length.metric
        }
        else if (credit.length.imperial) {
          length = Math.round(credit.length.imperial / 3.280839895)
        }
        else {
          length = 0;
        }
      }
      else { //if imperial
        //speed
        if (credit.max_speed.imperial) {
          speed = credit.max_speed.imperial
        }
        else if (credit.max_speed.metric) {
          speed = Math.round(credit.max_speed.metric * 0.621371)
        }
        else {
          speed = 0;
        }

        //height
        if (credit.max_height.imperial) {
          height = credit.max_height.imperial
        }
        else if (credit.max_height.metric) {
          height = Math.round(credit.max_height.metric * 3.280839895)
        }
        else {
          height = 0;
        }

        //length
        if (credit.length.imperial) {
          length = credit.length.imperial
        }
        else if (credit.length.metric) {
          length = Math.round(credit.length.metric * 3.280839895)
        }
        else {
          length = 0;
        }
      }

      //if values larger, make them the new limit
      if (speed > this.topSpeed) {
        this.topSpeed = speed;
      }
      if (height > this.topHeight) {
        this.topHeight = height;
      }
      if (length > this.topLength) {
        this.topLength = length;
      }
    }
  }

  initializeFilters() {
    this.filters = new Filter();
    this.filters.speedRange = new Range(0,this.topSpeed);
    this.filters.heightRange = new Range(0, this.topHeight);
    this.filters.lengthRange = new Range(0, this.topLength);
    this.filters.inversionRange = new Range(0, 14);
    this.filters.tallyRange = new Range(0, this.maxTally);
    this.filters.dateRange = {lower: this.earliestDate.toISOString(), upper: new Date().toISOString()};
    this.filters.keepEmptyTallys = true;
    this.filters.keepEmptyDates = true;
    this.filters.parks = this.parks.map(park => park.id);
    this.filters.makes = this.makes.map(make => make.id);
    this.filters.models = this.models;
    this.filters.statusesOptions = {
      defunct: true,
      standing: true,
      operable: true
    };
    this.filters.materialsOptions = {
      wood: true,
      steel: true,
      hybrid: true
    };
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

  getValue(obj: UnitObj, factor: number) {
    if (this.mainService.settings.metric) {
      if (obj.metric) {
        return obj.metric
      }
      else if (obj.imperial) {
        return  Math.round(obj.imperial / factor);
      }
      else {
        return NaN
      }
    }
    else {
      if (obj.imperial) {
        return obj.imperial
      }
      else if (obj.metric) {
        return  Math.round(obj.metric * factor);
      }
      else {
        return NaN
      }
    }
  }

  applyFilters() {

    this.coastersService.displayCreditList = [...this.coastersService.fullSortedList];

    this.coastersService.displayCreditList = this.coastersService.displayCreditList.filter(credit => {

      return (
        (isNaN(this.getValue(credit.max_speed, 0.621371)) || ((this.filters.speedRange.lower <= this.getValue(credit.max_speed, 0.621371)) && (this.getValue(credit.max_speed, 0.621371) <= this.filters.speedRange.upper))) && 
        (isNaN(this.getValue(credit.max_height, 3.280839895)) || ((this.filters.heightRange.lower <= this.getValue(credit.max_height, 3.280839895)) && (this.getValue(credit.max_height, 3.280839895) <= this.filters.heightRange.upper))) &&
        (isNaN(this.getValue(credit.length, 3.280839895)) || ((this.filters.lengthRange.lower <= this.getValue(credit.length, 3.280839895)) && (this.getValue(credit.length, 3.280839895) <= this.filters.lengthRange.upper))) &&
        (isNaN(credit.inversions) || ((this.filters.inversionRange.lower <= credit.inversions) && (credit.inversions <= this.filters.inversionRange.upper))) &&
        (isNaN(credit.tally) || ((this.filters.tallyRange.lower <= credit?.tally) && (credit?.tally <= this.filters.tallyRange.upper))) &&
        ((this.filters.keepEmptyTallys) || !(!credit.tally)) &&
        ((!credit.time || (new Date(this.filters.dateRange.lower) <= new Date(credit.time)) && (new Date(credit.time) <= new Date(this.filters.dateRange.upper)))) &&
        ((this.filters.keepEmptyDates) || !(!credit.time)) &&
        (((this.filters.materialsOptions.wood) && (credit.material.toLowerCase().includes("wood"))) ||
          ((this.filters.materialsOptions.steel) && (credit.material.toLowerCase().includes("steel"))) ||
          ((this.filters.materialsOptions.hybrid) && (credit.material.toLowerCase().includes("hybrid")))) &&
        (((this.filters.statusesOptions.operable) && (credit.status.operable)) ||
          ((this.filters.statusesOptions.standing) && (credit.status.standing)) ||
          ((this.filters.statusesOptions.defunct) && (!(credit.status.operable) && !(credit.status.standing)))) &&
        (!credit.park || (this.filters.parks.filter(id => {id == credit.park.id}))) &&
        (!credit.make || (this.filters.makes.filter(id => {id == credit.make.id})))
      
      )
    })
  }
}
