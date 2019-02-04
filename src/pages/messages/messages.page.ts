import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chat, Message, MessageType } from 'api/models';
import { Observable } from 'rxjs';
import { Chats, Messages } from 'api/collections';
import { map } from 'rxjs/operators';
import { MeteorObservable } from 'meteor-rxjs';
import { zoneOperator } from 'meteor-rxjs';

@Component({
  selector: 'messages-page',
  templateUrl: 'messages.page.html',
})
export class MessagesPage implements OnInit {
  selectedChat: Chat;
  title: string;
  picture: string;
  messages: Observable<Message[]>;
  message = '';

  constructor(private activatedRoute: ActivatedRoute) {
    this.selectedChat = Chats.findOne({
      _id: this.activatedRoute.snapshot.paramMap.get('chatId'),
    });

    console.log('Selected chat is: ', this.selectedChat);

    this.title = this.selectedChat.title;
    this.picture = this.selectedChat.picture;
  }

  ngOnInit() {
    let isEven = false;
    this.messages = Messages.find(
      { chatId: this.selectedChat._id },
      { sort: { createdAt: 1 } },
    ).pipe(
      map((messages: Message[]) => {
        messages.forEach((message: Message) => {
          message.ownership = isEven ? 'mine' : 'other';
          isEven = !isEven;
        });

        return messages;
      }),
    );
  }

  onInputKeypress({ keyCode }: KeyboardEvent): void {
    if (keyCode === 13) {
      this.sendTextMessage();
    }
  }

  sendTextMessage(): void {
    // If message was yet to be typed, abort
    if (!this.message) {
      return;
    }

    MeteorObservable.call(
      'addMessage',
      MessageType.TEXT,
      this.selectedChat._id,
      this.message,
    )
      .pipe(zoneOperator())
      .subscribe(() => {
        // Zero the input field
        this.message = '';
      });
  }
}
