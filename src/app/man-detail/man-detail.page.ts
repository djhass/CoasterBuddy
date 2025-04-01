import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoastersService } from '../coasters.service';
import { Coaster } from '../models.model';
import { Credit } from '../models.model';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-man-detail',
  templateUrl: './man-detail.page.html',
  styleUrls: ['./man-detail.page.scss'],
  imports: [
    IonicModule,
    RouterModule
  ]
})
export class ManDetailPage implements OnInit {
  coasters: Coaster[] = [];
  name: string;
  loading: boolean = false;
  coastersLoaded: boolean = false;
  displayCoasters: Coaster[] = [];
  displayCredits: Credit[] = [];

  constructor(
    private activatedRoute: ActivatedRoute, 
    public coastersService: CoastersService,
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      this.name = paramMap.get('manName');
      this.getAllCredits()
    });
  }

  getAllCredits() {
    this.displayCredits = this.coastersService.credit_list.filter((credit: Credit) => {
      return credit.manufacturer.name === this.name;
    });
  }

  async getAllCoasters() {
    if (!this.coastersLoaded) {
      this.coastersLoaded = true;
      this.loading = true;
        if (this.name) {
          this.coastersService.databaseParameterRequest("", "", "", encodeURI(this.name.toLowerCase()), "all").then(obj => {
            this.coasters = obj;
            this.displayCoasters = obj;
            this.loading = false;
          })
        }
    }
    else {
      this.displayCoasters = this.coasters;
    }
  }

  hideCoasters() {
    this.displayCoasters = [];
  }
}
