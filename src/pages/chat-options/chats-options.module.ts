import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MomentModule } from 'angular2-moment';
import { ChatsOptionsComponent } from './chats-options';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: ChatsOptionsComponent,
      },
    ]),
    MomentModule,
  ],
  declarations: [ChatsOptionsComponent],
})
export class ChatsOptionsPageModule {}
