import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MomentModule } from 'angular2-moment';
import { MessagesOptionsComponent } from './messages-options';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: MessagesOptionsComponent,
      },
    ]),
    MomentModule,
  ],
  declarations: [MessagesOptionsComponent],
  exports: [MessagesOptionsComponent],
})
export class MessagesOptionsModule {}
