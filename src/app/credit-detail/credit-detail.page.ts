import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { CoastersService } from '../coasters.service';
import { MainService } from '../main.service';
import { Coaster } from '../models.model';
import { Credit } from '../models.model';
import { Park } from '../models.model';
import { ModalController } from '@ionic/angular';
import { EditComponent } from '../credit-detail/edit/edit.component';
import { NavController } from '@ionic/angular';
import { IonicModule, IonDatetime } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, ViewChild, NgModule  } from '@angular/core';
import { LongPressDirective } from '../longpress.directive';


@Component({
  selector: 'app-coaster-detail',
  templateUrl: './credit-detail.page.html',
  styleUrls: ['./credit-detail.page.scss'],
  imports: [
    IonicModule,
    FormsModule,
    RouterModule,
    CommonModule,
    LongPressDirective
  ]
})


export class CreditDetailPage implements OnInit {
  @ViewChild('datetimePicker', { static: false }) datetimePicker: IonDatetime;
  @ViewChild('autoFocusInput') autoFocusInput: any;
  isDatetimeOpen: boolean = false;
  loadedCoaster: Coaster;
  loadedCredit: Credit;
  editTally: boolean = false;
  unchangedCredit: Credit;
  similarList: Array<object>;
  Math: any;
  page: string;
  altImg: string = "/assets/a-stylized-black-and-white-line-drawing-of-two-roller-coaster-cars-ascending-a-track-vector.jpg"
  shownImg: string = this.altImg;
  useMetric: boolean;
  
  
  constructor(
  private activatedRoute: ActivatedRoute, 
  public coastersService: CoastersService,
  public mainService: MainService,
  private router: Router,
  private alertCtrl: AlertController,
  private modalCtrl: ModalController,
  public navCtrl: NavController,
  private cdr: ChangeDetectorRef
  ) {
    this.page = location.pathname.split('/')[1]
    this.Math = Math

    this.activatedRoute.paramMap.subscribe(paramMap => {
  		if (!paramMap.has('coasterid')) {
        // redirect
        return;
      }
      const coasterid = paramMap.get('coasterid');
      this.loadedCredit = this.coastersService.getCredit(coasterid);
      this.shownImg = (this.loadedCredit && this.loadedCredit.image ? this.coastersService.getCoasterLargeImage(this.loadedCredit.image) : this.altImg);
        if (this.mainService.settings.defaultUnits) {
          this.useMetric = this.loadedCredit.prefersMetric
        }
        else {
          this.useMetric = this.mainService.settings.metric;
        }
        console.log(this.loadedCredit)
  	});
    
  }

  startEditingTally() {
    this.editTally = true;
  }

  stopEditingTally() {
    this.editTally = false;
    this.coastersService.set(this.loadedCredit.id, {tally: this.loadedCredit.tally})
  }

  openDatetimePicker() {
    this.isDatetimeOpen = true; // Opens the datetime picker
  }

  ngAfterViewInit() {
    this.cdr.detectChanges(); // Ensures proper DOM rendering
    if (this.editTally) {
      this.autoFocusInput.nativeElement.focus();
    }

  }

  displayDate(inputDate: string) {
    return new Date(inputDate).toDateString();
  }

  onImgFail() {
    this.shownImg = this.altImg;
  }

  handleScroll(event: any) {
    let lastScrollTop = 0;

    const scrollTop = event.detail.scrollTop;
    const header = document.querySelector('.scroll-header') as HTMLElement;
  
    if (header) {
      if (scrollTop > lastScrollTop) {
        // Scrolling down
        header.style.display = 'block'; // Show toolbar
      } else {
        // Scrolling up
        header.style.display = 'none'; // Hide toolbar completely
      }
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // Prevent negative values
    }
  }

  ngOnInit() {}

    async openEditComponent() {
  
      const modal = await this.modalCtrl.create({
      component: EditComponent
      })

      this.coastersService.selectedCredit = this.loadedCredit;
  
      await modal.present();
    }

  tally() {
    if (!this.loadedCredit.tally) {
      this.loadedCredit.tally = 0;
    }
    this.loadedCredit.tally = this.loadedCredit.tally + 1;
    this.coastersService.set(this.loadedCredit.id, {tally: this.loadedCredit.tally})
  }

  save() {
    this.coastersService.set(this.loadedCredit.id, this.loadedCredit);
  }
}