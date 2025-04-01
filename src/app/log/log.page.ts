import { Component, OnInit, Input, ViewChild, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { Credit, Park, Manufacturer } from '../models.model';
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

import * as _ from 'lodash';


@Component({
  selector: 'app-home',
  templateUrl: 'log.page.html',
  styleUrls: ['log.page.scss'],
  imports: [
    IonicModule,
    RouterModule,
    CommonModule
  ]
})

export class LogPage implements OnInit {

  @ViewChild(IonContent, {
    static: false
  })

  itemElements: QueryList<ElementRef>;

  @ViewChildren('checkboxElement', {
    read: ElementRef, 
  })
  checkboxElements: QueryList<ElementRef>;

  content: IonContent;
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
  displayManList: Array<Manufacturer>;
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

  test() {
    console.log("Tests")
  }

  ionViewWillLeave() {

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
      document.getElementById('searchToolbar').animate(
        [
          {
            height: '0px'
          },
          {
            height: '48px'
          }
        ],
        {
          duration: duration,
          easing: 'linear'
        }
      )
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
      if (this.coastersService.credit_list[i]?.park?.name == park) {
        count++;
      }
    }
    return count;
 }

creditsInMan(man) {
  var count = 0
  for (let i = 0; i < this.coastersService.credit_list.length; i++) {
    if (this.coastersService.credit_list[i]?.manufacturer?.name == man) {
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
  const criteria = this.sort_select;

  const compareFunction = (a, b) => {
    const valueA = a[criteria];
    const valueB = b[criteria];

    // Handle null or undefined values
    if (valueA === null || valueA === undefined) {
      return 1; // Move valueA to the end
    }
    if (valueB === null || valueB === undefined) {
      return -1; // Move valueB to the end
    }

    // Handle NaN values (if applicable)
    if (Number.isNaN(valueA)) {
      return 1; // Move valueA to the end
    }
    if (Number.isNaN(valueB)) {
      return -1; // Move valueB to the end
    }

    // Regular comparison based on criteria
    return criteria === 'time'
      ? Date.parse(valueB) - Date.parse(valueA)
      : valueB - valueA;
  };

  // Sort the

  if (criteria == "rank" && !this.mainService.filters?.appliedFilters) {
    console.log(this.coastersService.credit_list)
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


