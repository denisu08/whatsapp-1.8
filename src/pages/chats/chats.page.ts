import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { Chats, Messages, Users } from 'api/collections';
import { Chat, Message } from 'api/models';
import { tap, map, mergeMap, startWith } from 'rxjs/operators';
import {
  IonItemSliding,
  NavController,
  PopoverController,
  ModalController,
  AlertController,
} from '@ionic/angular';
import { zoneOperator } from 'meteor-rxjs';
import { ChatsOptionsComponent } from '../chat-options/chats-options';
import { NewChatComponent } from '../new-chat/new-chat';
import { MeteorObservable } from 'meteor-rxjs';
import { Observable, Subscriber } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { Meteor } from 'meteor/meteor';

@Component({
  selector: 'app-chats',
  templateUrl: 'chats.page.html',
  styleUrls: ['chats.page.scss'],
})
export class ChatsPage implements OnInit {
  chats;
  senderId: string;

  constructor(
    private navCtrl: NavController,
    private popoverCtrl: PopoverController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
  ) {
    this.senderId = Meteor.userId();
  }

  async addChat() {
    const modal = await this.modalCtrl.create({
      component: NewChatComponent,
      componentProps: {},
    });
    modal.present();
  }

  ngOnInit() {
    // this.chats = this.findChats();
    MeteorObservable.subscribe('chats').subscribe(() => {
      MeteorObservable.autorun().subscribe(() => {
        this.chats = this.findChats();
      });
    });
  }

  findChats(): Observable<Chat[]> {
    // Find chats and transform them
    return Chats.find().pipe(
      map(chats => {
        chats.forEach(chat => {
          // chat.title = '';
          // chat.picture = '';

          const receiverId = chat.memberIds
            ? chat.memberIds.find(memberId => memberId !== this.senderId)
            : '';
          const receiver = Users.findOne(receiverId);

          if (receiver) {
            chat.title = receiver.profile.name;
            chat.picture = receiver.profile.picture;
          }

          // This will make the last message reactive
          this.findLastChatMessage(chat._id).subscribe(message => {
            chat.lastMessage = message;
          });
        });

        return chats;
      }),
    );
  }

  findLastChatMessage(chatId: string): Observable<Message> {
    return Observable.create((observer: Subscriber<Message>) => {
      const chatExists = () => !!Chats.findOne(chatId);

      // Re-compute until chat is removed
      MeteorObservable.autorun()
        .pipe(takeWhile(chatExists))
        .subscribe(() => {
          Messages.find(
            { chatId },
            {
              sort: { createdAt: -1 },
            },
          ).subscribe({
            next: messages => {
              // Invoke subscription with the last message found
              if (!messages.length) {
                return;
              }

              const lastMessage = messages[0];
              observer.next(lastMessage);
            },
            error: e => {
              observer.error(e);
            },
            complete: () => {
              observer.complete();
            },
          });
        });
    });
  }

  async showOptions(evt) {
    const popover = await this.popoverCtrl.create({
      component: ChatsOptionsComponent,
      componentProps: {
        cssClass: 'options-popover chats-options-popover',
      },
      event: evt,
    });

    popover.present();
  }

  showMessages(chat): void {
    this.navCtrl.navigateForward(`messages/${chat._id}`);
  }

  removeChat(slidingItem: IonItemSliding, chat: Chat): void {
    slidingItem.close();
    // this.chats = this.chats.pipe(
    //   map((chatsArray: Chat[]) => {
    //     const chatIndex = chatsArray.indexOf(chat);
    //     if (chatIndex !== -1) {
    //       chatsArray.splice(chatIndex, 1);
    //     }
    //     return chatsArray;
    //   }),
    // );

    MeteorObservable.call('removeChat', chat._id).subscribe({
      error: (e: Error) => {
        if (e) {
          this.handleError(e);
        }
      },
    });
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
