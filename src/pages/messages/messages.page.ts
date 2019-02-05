import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chat, Message, MessageType } from 'api/models';
import { Observable } from 'rxjs';
import { Chats, Messages } from 'api/collections';
import { map } from 'rxjs/operators';
import { MeteorObservable } from 'meteor-rxjs';
import { zoneOperator } from 'meteor-rxjs';
import { IonContent } from '@ionic/angular';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Meteor } from 'meteor/meteor';

@Component({
  selector: 'messages-page',
  templateUrl: 'messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit, OnDestroy {
  @ViewChild('scrollArea') content: IonContent;

  selectedChat: Chat;
  title: string;
  picture: string;
  messagesDayGroups;
  messages: Observable<Message[]>;
  message = '';
  autoScroller: MutationObserver;
  scrollOffset = 0;
  scrollElement: HTMLElement;
  senderId: string;

  constructor(private activatedRoute: ActivatedRoute, private el: ElementRef) {
    this.selectedChat = Chats.findOne({
      _id: this.activatedRoute.snapshot.paramMap.get('chatId'),
    });
    this.title = this.selectedChat.title;
    this.picture = this.selectedChat.picture;
    this.senderId = Meteor.userId();
  }

  private get messagesPageContent(): Element {
    return this.el.nativeElement.querySelector('.messages-page-content');
  }

  private get messagesList(): Element {
    return this.messagesPageContent.querySelector('.messages');
  }

  private get scroller(): Element {
    return this.scrollElement;
  }

  ngOnInit() {
    (this.content.getScrollElement() as any).then(el => {
      this.scrollElement = el;
      this.autoScroller = this.autoScroll();
      this.subscribeMessages();
    });
  }

  subscribeMessages() {
    this.scrollOffset = this.scrollElement.scrollHeight;
    this.messagesDayGroups = this.findMessagesDayGroups();
    // this.messagesDayGroups.subscribe(val => console.log('value', val));
  }

  findMessagesDayGroups() {
    // let isEven = false;
    return Messages.find(
      { chatId: this.selectedChat._id },
      { sort: { createdAt: 1 } },
    ).pipe(
      map((messages: Message[]) => {
        const format = 'D MMMM Y';

        // Compose missing data that we would like to show in the view
        messages.forEach((message: Message) => {
          message.ownership =
            this.senderId === message.senderId ? 'mine' : 'other';

          // isEven = !isEven;
          return message;
        });

        // Group by creation day
        const groupedMessages = _.groupBy(messages, message => {
          return moment(message.createdAt).format(format);
        });

        // Transform dictionary into an array since Angular's view engine doesn't know how
        // to iterate through it
        return Object.keys(groupedMessages).map((timestamp: string) => {
          return {
            timestamp: timestamp,
            messages: groupedMessages[timestamp],
            today: moment().format(format) === timestamp,
          };
        });
      }),
    );
  }

  ngOnDestroy() {
    this.autoScroller.disconnect();
  }

  autoScroll(): MutationObserver {
    const autoScroller = new MutationObserver(this.scrollDown.bind(this));

    autoScroller.observe(this.messagesList, {
      childList: true,
      subtree: true,
    });

    return autoScroller;
  }

  scrollDown(): void {
    // Scroll down and apply specified offset
    this.scroller.scrollTop = this.scroller.scrollHeight - this.scrollOffset;
    // Zero offset for next invocation
    this.scrollOffset = 0;
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
