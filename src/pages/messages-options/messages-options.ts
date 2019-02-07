import { Component } from '@angular/core';
import {
  AlertController,
  NavController,
  PopoverController,
  NavParams,
} from '@ionic/angular';
import { MeteorObservable } from 'meteor-rxjs';

@Component({
  selector: 'messages-options',
  templateUrl: 'messages-options.html',
  styleUrls: ['messages-options.scss'],
})
export class MessagesOptionsComponent {
  constructor(
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public popoverController: PopoverController,
    private navParams: NavParams,
  ) {}

  async remove() {
    const alert = await this.alertCtrl.create({
      header: 'Remove',
      message: 'Are you sure you would like to proceed?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Yes',
          handler: () => {
            this.handleRemove(alert);
            return false;
          },
        },
      ],
    });

    this.alertCtrl.dismiss().then(() => {
      alert.present();
    });
  }

  private handleRemove(alert): void {
    const selectedChat = this.navParams.get('chat');
    MeteorObservable.call('removeChat', selectedChat._id).subscribe({
      next: () => {
        alert.dismiss().then(() => {
          this.popoverController.dismiss();
          this.navCtrl.navigateRoot('chats', {
            animated: true,
          });
        });
      },
      error: (e: Error) => {
        alert.dismiss().then(() => {
          this.popoverController.dismiss();
          if (e) {
            return this.handleError(e);
          }

          this.navCtrl.navigateRoot('chats', {
            animated: true,
          });
        });
      },
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
