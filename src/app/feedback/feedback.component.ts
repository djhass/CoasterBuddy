import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams} from '@ionic/angular';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AlertController } from '@ionic/angular';

import { Keyboard } from '@capacitor/keyboard';

import { IonicModule } from '@ionic/angular';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
  imports: [
    IonicModule,
    FormsModule,
    CommonModule
  ]
})

export class FeedbackComponent implements OnInit {

  name: string = "";
  email: string = "";
  feedback: string = "";
  showLoad: boolean = false

  constructor(
    private modalController: ModalController,
    private http: HttpClient,
    private alertCtrl: AlertController,
  ) {
    this.showLoad = false;
  }

  ngOnInit() {}

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  closeKeyboard(value: number) {
    if (value == 13) {
      Keyboard.removeAllListeners();
      Keyboard.hide()
    }
  }

  submitClick() {
    this.showLoad = true;
    if (typeof this.feedback == "undefined" || this.feedback.length < 1) {
      this.showLoad = false
      this.alertCtrl.create({
        header: 'No Feedback!',
        message: "You must have something typed in the feedback section.",
        buttons: [
          {
            text: "OK",
            role: "cancel"
          },
        ]
      }).then(alertEl => {
        alertEl.present();
      });
    }
    else if (this.email && this.email.length > 0 && !this.email.includes("@")) {
      this.showLoad = false;
      this.alertCtrl.create({
        header: 'Not a valid email!',
        message: "To get a response a valid email must be provided. Or optionally leave it blank.",
        buttons: [
          {
            text: "OK",
            role: "cancel"
          },
        ]
      }).then(alertEl => {
        alertEl.present();
      });
    }
    else {
      this.submitFeedback()
    }
  }

  submitFeedback() {
    console.log(`Name: ${this.name}, Email: ${this.email}, Feedback: ${this.feedback}`);
    

    let url = "https://server.coasterbuddy.app/feedback"
    let httpHeaders = new HttpHeaders({
      'accept': 'application/json',
    })
    let options = {
      headers: httpHeaders
    }

    let obj = {
      name: this.name,
      email: this.email,
      feedback: this.feedback
    }

    this.http.post(url, obj).subscribe((resp: any) => {
      console.log(resp)
      if (resp["received"]) {
        this.showLoad = false
        this.successMessage()
      }
      else {
        this.showLoad = false
        this.failureMessage(new Error("Server Returned False"))
      }
    }, error => {
      this.showLoad = false
      this.failureMessage(error)
    })
  }

  successMessage() {
    this.alertCtrl.create({
      header: 'Feedback Received!',
      message: "We will try to respond shortly",
      buttons: [
        {
          text: "OK",
          handler: () => {this.dismiss()}
        },
      ]
    }).then(alertEl => {
      alertEl.present();
    });
  }


  failureMessage(error: Error) {
    this.alertCtrl.create({
      header: 'Submission Failed',
      message: `There was an error processing your request. Error: "${error.message}". If the issue persists, you can send an email to support@coasterbuddy.app`,
      buttons: [
        {
          text: "OK",
          role: "cancel"
        },
      ]
    }).then(alertEl => {
      alertEl.present();
    });
  }
}
