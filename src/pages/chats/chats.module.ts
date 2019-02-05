import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MomentModule } from 'angular2-moment';
import { ChatsPage } from './chats.page';
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
  declarations: [ChatsPage, ChatsOptionsComponent],
  entryComponents: [ChatsOptionsComponent],
})
export class ChatsPageModule {}
