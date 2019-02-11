import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MomentModule } from 'angular2-moment';
import { ChatsPage } from './chats.page';
import { NewChatComponent } from '../new-chat/new-chat';
import { ChatsOptionsComponent } from '../chat-options/chats-options';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: ChatsPage,
      },
    ]),
    MomentModule,
  ],
  declarations: [ChatsPage, ChatsOptionsComponent, NewChatComponent],
  entryComponents: [ChatsOptionsComponent, NewChatComponent],
})
export class ChatsPageModule {}
