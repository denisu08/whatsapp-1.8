import { Component, Injectable } from '@angular/core';
import {
  AlertController,
  NavController,
  PopoverController,
} from '@ionic/angular';
import { PhoneService } from '../../services/phone.service';

@Component({
  selector: 'chats-options',
  templateUrl: 'chats-options.html',
  styleUrls: ['chats-options.scss'],
})
@Injectable()
export class ChatsOptionsComponent {
  constructor(
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private phoneService: PhoneService,
    private popoverController: PopoverController,
  ) {}

  async editProfile() {
    await this.popoverController.dismiss().then(() => {
      this.navCtrl.navigateRoot('profile');
    });
  }

  async logout() {
    const alert = await this.alertCtrl.create({
      header: 'Logout',
      message: 'Are you sure you would like to proceed?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Yes',
          handler: () => {
            this.handleLogout();
            return false;
          },
        },
      ],
    });

    await this.popoverController.dismiss().then(() => {
      alert.present();
    });
  }

  async handleLogout() {
    await this.alertCtrl
      .dismiss()
      .then(() => {
        return this.phoneService.logout();
      })
      .then(() => {
        this.navCtrl.navigateRoot('login?animate=true');
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

    alert.present();
  }
}
