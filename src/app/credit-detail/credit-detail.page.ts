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
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';




@Component({
  selector: 'app-coaster-detail',
  templateUrl: './credit-detail.page.html',
  styleUrls: ['./credit-detail.page.scss'],
  imports: [
    IonicModule,
    FormsModule,
    RouterModule,
    CommonModule
  ]
})
export class CreditDetailPage implements OnInit {
  loadedCoaster: Coaster;
  loadedCredit: Credit;
  unchangedCredit: Credit;
  similarList: Array<object>;
  Math: any;
  page: string;
  
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
      const coasterid = Number(paramMap.get('coasterid'));
      this.loadedCredit = this.coastersService.getCredit(coasterid);
      console.log(this.loadedCredit)
      
  	});
    
  }

  ngAfterViewInit() {
    this.cdr.detectChanges(); // Ensures proper DOM rendering
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
    this.loadedCredit.tally = this.loadedCredit.tally + 1;
  }

  getCoasterImage(value) {
    if (value != null) {
      return 'pictures.captaincoaster.com/280x210/' + value.path
    }
    else {
      return ""
    }
  }

  save() {
    this.coastersService.set(this.loadedCredit.id, this.loadedCredit);
  }
}