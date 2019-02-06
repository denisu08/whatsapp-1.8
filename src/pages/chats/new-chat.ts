import { Component, OnInit } from '@angular/core';
import { Chats, Users } from 'api/collections';
import { User } from 'api/models';
import {
  AlertController,
  PopoverController,
  ModalController,
} from '@ionic/angular';
import { MeteorObservable } from 'meteor-rxjs';
import * as _ from 'lodash';
import { Observable, Subscription } from 'rxjs';
import { startWith, mergeMap } from 'rxjs/operators';
import { Meteor } from 'meteor/meteor';

@Component({
  selector: 'new-chat',
  templateUrl: 'new-chat.html',
  styleUrls: ['new-chat.scss'],
})
export class NewChatComponent implements OnInit {
  senderId: string;
  users: Observable<User[]>;
  usersSubscription: Subscription;

  constructor(
    private alertCtrl: AlertController,
    private popupController: PopoverController,
    public modalController: ModalController,
  ) {
    this.senderId = Meteor.userId();
  }

  ngOnInit() {
    this.loadUsers();
  }

  addChat(user): void {
    MeteorObservable.call('addChat', user._id).subscribe({
      next: () => {
        this.popupController.dismiss();
      },
      error: (e: Error) => {
        this.popupController.dismiss().then(() => {
          this.handleError(e);
        });
      },
    });
  }

  loadUsers(): void {
    this.users = this.findUsers();
  }

  findUsers(): Observable<User[]> {
    // Find all belonging chats
    return Chats.find(
      {
        memberIds: this.senderId,
      },
      {
        fields: {
          memberIds: 1,
        },
      },
    ).pipe(
      startWith([]),
      // Invoke merge-map with an empty array in case no chat found
      mergeMap(chats => {
        // Get all userIDs who we're chatting with
        const receiverIds = _.chain(chats)
          .map('memberIds')
          .flatten()
          .concat(this.senderId)
          .value();

        // Find all users which are not in belonging chats
        return Users.find({
          _id: { $nin: receiverIds },
        }).pipe(
          // Invoke map with an empty array in case no user found
          startWith([]),
        );
      }),
    );
  }

  async handleError(e: Error) {
    console.error(e);

    const alert = await this.alertCtrl.create({
      buttons: ['OK'],
      message: e.message,
      header: 'Oops!',
    });

    alert.present();
  }
}
