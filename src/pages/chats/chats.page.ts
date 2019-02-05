import { Component, OnInit } from '@angular/core';
import { Observable, of, combineLatest } from 'rxjs';
import * as moment from 'moment';
import { Chats, Messages } from 'api/collections';
import { Chat } from 'api/models';
import { tap, map, mergeMap, startWith } from 'rxjs/operators';
import { IonItemSliding } from '@ionic/angular';
import { zoneOperator } from 'meteor-rxjs';
import { NavController, PopoverController } from '@ionic/angular';
import { MessagesPage } from '../messages/messages.page';
import { ChatsOptionsComponent } from '../chat-options/chats-options';

@Component({
  selector: 'app-chats',
  templateUrl: 'chats.page.html',
  styleUrls: ['chats.page.scss'],
})
export class ChatsPage implements OnInit {
  chats;

  constructor(
    private navCtrl: NavController,
    private popoverCtrl: PopoverController,
  ) {}

  ngOnInit() {
    this.chats = Chats.find({}).pipe(
      mergeMap((chats: Chat[]) =>
        combineLatest(
          chats.map((chat: Chat) => {
            return Messages.find({ chatId: chat._id }).pipe(
              startWith(null),
              map(messages => {
                if (messages) {
                  chat.lastMessage = messages[0];
                }
                return chat;
              }),
            );
          }),
        ),
      ),
      tap(val => val),
      zoneOperator(),
    );
  }

  async showOptions() {
    const popover = await this.popoverCtrl.create({
      component: ChatsOptionsComponent,
      componentProps: {
        cssClass: 'options-popover chats-options-popover',
      },
    });

    popover.present();
  }

  showMessages(chat): void {
    // this.navCtrl.navigateRoot(`messages/${chat._id}`);
    this.navCtrl.navigateForward(`messages/${chat._id}`);
  }

  removeChat(slidingItem: IonItemSliding, chat: Chat): void {
    slidingItem.close();
    this.chats = this.chats.pipe(
      map((chatsArray: Chat[]) => {
        const chatIndex = chatsArray.indexOf(chat);
        if (chatIndex !== -1) {
          chatsArray.splice(chatIndex, 1);
        }
        return chatsArray;
      }),
    );
  }
}
