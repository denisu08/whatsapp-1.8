import { Component } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { PhoneService } from '../../services/phone.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage {
  phone = '';

  constructor(
    private alertCtrl: AlertController,
    private phoneService: PhoneService,
    private navCtrl: NavController,
  ) {}

  onInputKeypress({ keyCode }: KeyboardEvent): void {
    if (keyCode === 13) {
      this.login();
    }
  }

  async login(phone: string = this.phone) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm',
      message: `Would you like to proceed with the phone number ${phone}?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Yes',
          handler: () => {
            this.handleLogin();
            return false;
          },
        },
      ],
    });

    await alert.present();
  }

  async handleLogin() {
    this.alertCtrl
      .dismiss()
      .then(() => {
        return this.phoneService.verify(this.phone);
      })
      .then(() => {
        this.navCtrl.navigateRoot(`verification/${this.phone}`);
      })
      .catch(e => {
        this.handleError(e);
      });
  }

  async handleError(e: Error) {
    console.error(e);

    const alert = await this.alertCtrl.create({
      header: 'Oops!',
      message: e.message,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
