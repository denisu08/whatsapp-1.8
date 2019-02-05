import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'chats', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: '../pages/login/login.module#LoginPageModule',
  },
  {
    path: 'verification/:phone',
    loadChildren:
      '../pages/verification/verification.module#VerificationPageModule',
  },
  {
    path: 'profile',
    loadChildren: '../pages/profile/profile.module#ProfilePageModule',
  },
  {
    path: 'chats',
    loadChildren: '../pages/chats/chats.module#ChatsPageModule',
  },
  {
    path: 'messages/:chatId',
    loadChildren: '../pages/messages/messages.module#MessagesPageModule',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
