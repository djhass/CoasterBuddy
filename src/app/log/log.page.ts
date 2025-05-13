import { Component, OnInit, Input, ViewChild, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { Credit, Park, Make } from '../models.model';
import { CoastersService } from '../coasters.service';
import { ParksService } from '../parks.service';
import { MainService } from '../main.service';
import { AlertController } from '@ionic/angular';
import { AddComponent } from '../add/add.component';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { EditComponent } from '../credit-detail/edit/edit.component';
import { IonContent } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { FilterComponent } from './filter/filter.component'
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import * as _ from 'lodash';


@Component({
  selector: 'app-home',
  templateUrl: 'log.page.html',
  styleUrls: ['log.page.scss'],
  imports: [
    IonicModule,
    RouterModule,
    CommonModule,
    FormsModule
  ]
})

export class LogPage implements OnInit {

  // Decorator for IonContent (single element reference)
  @ViewChild(IonContent, { static: false }) 
  content!: IonContent;

  // Decorator for item elements (multiple element references)
  @ViewChildren('itemElement', { read: ElementRef }) 
  itemElements!: QueryList<ElementRef>;

  // Decorator for checkbox elements (multiple element references)
  @ViewChildren('checkboxElement', { read: ElementRef }) 
  checkboxElements!: QueryList<ElementRef>;

  sorted: Array<Credit>;
  list_select: string = "Coasters";
  sort_select: string = "rank";
  list: Array<object>;
  sortList: Array<Credit>;
  devMode: boolean;
  selectedList: Array<Credit> = [];
  Math: any = Math;
  showSearchbar: boolean = false;
  edit: boolean = false;
  haveBeenArranged: boolean = false;
  displayParkList: Array<Park>;
  displayManList: Array<Make>;
  displayFab: boolean = true;

  constructor(
  public coastersService: CoastersService, 
  private ParksService: ParksService,
  public mainService: MainService,
  private alertCtrl: AlertController,
  private modalCtrl: ModalController,
  private router: Router,
  private popoverController: PopoverController,
  ) {
    
  }

  ngOnInit(): void {
    
  };

  ionViewWillLeave() {

  }

  ISOToReadable(input: string) {
    return new Date(input).toLocaleTimeString('en-US', { 
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  }

  secondsToTime(input: number) {
    if (input == 0 || isNaN(input)) {
      return ""
    }
    else {
      return (Math.round(input/60) + ":" + this.Math.round(input%60)).padStart(2, '0');
    }
  }

  showFab() {
    this.displayFab = true;
  }

  hideFab() {
    this.displayFab = false;
  }

  startEdit() {
    this.edit = true;
    this.haveBeenArranged = false;
  }

  stopEdit() {
    this.edit = false;
    if (this.haveBeenArranged) {
      this.coastersService.setData();
    }
  }
  
  async toggleSearchbar() {
    let duration = 80;
    //Hide
    if (this.showSearchbar) {
      this.unHighlightElements();
      document.getElementById('searchToolbar').animate(
        [
          {
            height: '48px'
          },
          {
            height: '0px'
          }
        ],
        {
          duration: duration,
          easing: 'linear'
        }
      )
      await new Promise((resolve) => {
        setTimeout(resolve, duration - 6);
      });
      this.showSearchbar = false;
    }
    //Show
    else {
      this.showSearchbar = true;
      const searchToolbar = document.getElementById('searchToolbar');
      if (searchToolbar) {
        searchToolbar.animate(
          [
            { height: '0px' },
            { height: '48px' }
          ],
          {
            duration: duration,
            easing: 'linear'
          }
        );
      } else {
        console.error("searchToolbar element not found");
      }
    }
  }

onSearch(ev: any) {
  const val = ev.target.value.toLowerCase().replace(/\s/g, '');
  if (val && val.trim() != "") { 
    let found = false;
    this.coastersService.credit_list.forEach((item, i) => {
      
      if (item.name.toLowerCase().replace(/\s/g, '').includes(val) && !found) {
        found = true;
        let itemElement = this.itemElements.toArray()[i].nativeElement;
        this.unHighlightElements()
        this.highlightElement(itemElement)
        itemElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
      }
    })
  }
  else {
    this.unHighlightElements();
  }
}

highlightElement(element) {
  element.setAttribute('style', 'font-size: 18px; font-weight: 600; background-color: yellow; color: black')
}

unHighlightElements() {
  this.itemElements.toArray().forEach(item => {
    item.nativeElement.setAttribute('style', 'font-size: 18px; font-weight: 600; background-color: transparent')
  })
}

 async openAddComponent() {

    const modal = await this.modalCtrl.create({
    component: AddComponent
    })

    await modal.present();
  }

  async openEditComponent(coaster) {
    const modal = await this.modalCtrl.create({
      component: EditComponent
      })

      this.coastersService.selectedCredit = coaster
  
      await modal.present();
  }

  async openFilterComponent() {
    const modal = await this.modalCtrl.create({
      component: FilterComponent
      })
  
      await modal.present();

      const { role } = await modal.onWillDismiss();
      this.sortBy();
  }

  addToSelectedList(credit) {
    let temp = this.selectedList.findIndex(item => {
      return item.id == credit.id
    })
    if (temp == -1) {
      this.selectedList.push(credit)
    }
    else {
      this.selectedList.splice(temp, 1)
    }
  }

  deleteInSelectedList() {

    this.alertCtrl.create({
      header: 'Are You Sure?',
      message: 'Do you want to delete ' + this.selectedList.length + ' items?',
      buttons: [
      {
        text: 'Cancel',
        role: 'cancel'
      },
      {
        text: 'Delete',
        handler: () => {
          for (let i = 0; i < this.selectedList.length; i++) {
            let temp = this.coastersService.credit_list.findIndex(item => {
              return this.selectedList[i].id == item.id
            })
            this.coastersService.credit_list.splice(temp, 1)
          }
          this.coastersService.setData();
      }
     }
    ]
  })
  .then(alertEl => {
      alertEl.present();
  });
  }
  clearSelectedList() {
    this.selectedList = [];
    for (let i = 0; i < this.coastersService.credit_list.length; i++) {
      this.checkboxElements.toArray()[i].nativeElement.setAttribute("checked", "false")
    }
  }

 creditsInPark(park) {
  var count = 0
    for (let i = 0; i < this.coastersService.credit_list.length; i++) {
      if (this.coastersService.credit_list[i]?.park?.id ? this.coastersService.credit_list[i]?.park?.id == park.id : this.coastersService.credit_list[i]?.park?.name == park.name) {
        count++;
      }
    }
    return count;
 }

  creditsInMake(make) {
    var count = 0
    for (let i = 0; i < this.coastersService.credit_list.length; i++) {
      if (this.coastersService.credit_list[i]?.make?.id ? this.coastersService.credit_list[i]?.make?.id == make.id : this.coastersService.credit_list[i]?.make?.name == make.name) {
        count++;
      }
    }
    return count;
  }

  sortByPopularity(array) {
    if (array.length <= 1) {
      return array;
    }
  
    var pivot = array[0];
    
    var left = []; 
    var right = [];
  
    for (var i = 1; i < array.length; i++) {
      Number(array[i].score) < Number(pivot.score) ? left.push(array[i]) : right.push(array[i]);
    }
  
    return this.sortByPopularity(left).concat(pivot, this.sortByPopularity(right));
  };

  sortPrompt() {
    this.alertCtrl.create({
      header: "How Would You Like to Rank your coasters?",
      buttons: [{
        cssClass: "alertCancel",
        text: "Sorting Wizard",
        handler: () => {
          this.router.navigate(['log/sort'])
        }
      },
      {
        text: "By Popularity",
        handler: () => {
          this.coastersService.credit_list = this.sortByPopularity(this.coastersService.credit_list).reverse()
          this.coastersService.setData();
        }
      },
      {
        text: "Cancel",
        role: "cancel"
      }
      ]
    })
    .then(alertEl => {
      alertEl.present();
  });
  }

  onDeleteCoaster(position) {
    this.alertCtrl.create({
        header: 'Are You Sure?',
        message: 'Do you want to delete ' + this.coastersService.displayCreditList[position].name + '?',
        buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            this.coastersService.deleteCredit(position);
          }
        }
      ]
    })
    .then(alertEl => {
        alertEl.present();
    });
  }


reorderItems(event) {
    const displayMove = this.coastersService.displayCreditList.splice(event.detail.from, 1) [0];
    this.coastersService.displayCreditList.splice(event.detail.to, 0, displayMove);

    const creditsMove = this.coastersService.credit_list.splice(event.detail.from, 1) [0];
    this.coastersService.credit_list.splice(event.detail.to, 0, creditsMove);

    this.haveBeenArranged = true;
    event.detail.complete();
}

sortBy() {
  const useMetric = this.mainService.settings.metric;
  const criteria = this.sort_select;


  const compareFunction = (a, b) => {
    const getValue = (item) => {
      let value = item[criteria];

      // Check if the value is a sub-object with metric/imperial
      if (value && typeof value === 'object') {

        if (value.metric && (!value.imperial || useMetric)) {
          return value.metric;
        }
        else if (value.imperial && (!value.metric || !useMetric)) {
          return value.imperial;
        }
        else {
          return 0;
        }
      }
    };
  
    const valueA = getValue(a);
    const valueB = getValue(b);
  
    // Handle null or undefined values
    if (valueA === null || valueA === undefined) {
      return 1; // Move valueA to the end
    }
    if (valueB === null || valueB === undefined) {
      return -1; // Move valueB to the end
    }
  
    // Handle NaN values
    if (Number.isNaN(valueA)) {
      return 1; // Move valueA to the end
    }
    if (Number.isNaN(valueB)) {
      return -1; // Move valueB to the end
    }
  
    // Handle date comparison
    if (criteria === 'time') {
      return Date.parse(valueB) - Date.parse(valueA); // Compare dates
    }
  
    // Regular numeric comparison
    return valueB - valueA;
  };

  // Sort
  if (criteria == "rank" && !this.mainService.filters?.appliedFilters) {
    this.coastersService.displayCreditList = [...this.coastersService.credit_list]
  }
  else if (criteria == "rank" && this.mainService.filters?.appliedFilters) {
    // Step 1: Create a map for quick lookup of original list items
    const map = new Map<Credit, number>();
    this.coastersService.displayCreditList.forEach((item, index) => {
      map.set(item, index);
    });

    // Step 2: Iterate through the scrambled list and construct the unscrambled list
    let unscrambledList: Credit[] = [];
    this.coastersService.credit_list.forEach(item => {
      if (map.has(item)) {
        unscrambledList.push(item);
      }
    });
    this.coastersService.displayCreditList = [...unscrambledList]
  }
  else {
    this.coastersService.displayCreditList.sort(compareFunction);
    this.coastersService.fullSortedList.sort(compareFunction);
  }
  }
}


