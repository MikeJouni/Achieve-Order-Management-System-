import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
  ) {
  }

  myAlert = {
    class: true,
    show: false,
    type: null,
    message: null,
  }

  presentAlert(type, message) {
    this.myAlert.type = 'dark-' + type;
    this.myAlert.message = message;
    this.myAlert.show = true;
    setTimeout(() => {
      this.myAlert.class = false;
    }, 3000);
    setTimeout(() => {
      this.myAlert.show = false;
    }, 3000);
    setTimeout(() => {
      this.myAlert.class = true;
    }, 3500);
  }

}
