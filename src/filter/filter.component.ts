import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams} from '@ionic/angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-filter',
  templateUrl: './log//filter/filter.component.html',
  styleUrls: ['./log/filter/filter.component.scss'],
  imports: [
    RouterModule
  ]
})
export class FilterComponent implements OnInit {

  constructor(
    private modalController: ModalController,
  ) { }

  ngOnInit() {}

  closeModal() { 
    this.modalController.dismiss();
     }

}
