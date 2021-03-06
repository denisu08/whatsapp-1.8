import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MomentModule } from 'angular2-moment';
import { MessagesPage } from './messages.page';
// import { MessagesOptionsModule } from '../messages-options/messages-options.module';
import { MessagesOptionsComponent } from '../messages-options/messages-options';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: MessagesPage,
      },
    ]),
    MomentModule,
  ],
  declarations: [MessagesPage, MessagesOptionsComponent],
  entryComponents: [MessagesOptionsComponent],
})
export class MessagesPageModule {}
