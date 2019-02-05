import { Component, OnInit } from '@angular/core';
import { Profile } from 'api/models';
import { AlertController, NavController } from '@ionic/angular';
import { MeteorObservable } from 'meteor-rxjs';
import { ChatsPage } from '../chats/chats.page';
import { Meteor } from 'meteor/meteor';

@Component({
  selector: 'profile',
  templateUrl: 'profile.page.html',
})
export class ProfilePage implements OnInit {
  picture: string;
  profile: Profile;

  constructor(
    private alertCtrl: AlertController,
    private navCtrl: NavController,
  ) {}

  ngOnInit(): void {
    this.profile = Meteor.user().profile || {
      name: '',
    };
  }

  updateProfile(): void {
    MeteorObservable.call('updateProfile', this.profile).subscribe({
      next: () => {
        this.navCtrl.navigateForward('chat');
      },
      error: (e: Error) => {
        this.handleError(e);
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
