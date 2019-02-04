import { Component, OnInit } from '@angular/core';
import { Observable, of, combineLatest } from 'rxjs';
import * as moment from 'moment';
import { Chats, Messages } from 'api/collections';
import { Chat } from 'api/models';
import { tap, map, mergeMap, startWith } from 'rxjs/operators';
import { IonItemSliding } from '@ionic/angular';
import { zoneOperator } from 'meteor-rxjs';

@Component({
  selector: 'app-chats',
  templateUrl: 'chats.page.html',
  styleUrls: ['chats.page.scss'],
})
export class ChatsPage implements OnInit {
  chats;

  constructor() {}

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
