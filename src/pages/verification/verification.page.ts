import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { PhoneService } from '../../services/phone.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'verification',
  templateUrl: 'verification.page.html',
})
export class VerificationPage implements OnInit {
  private code = '';
  private phone: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private phoneService: PhoneService,
  ) {}

  ngOnInit() {
    this.phone = this.activatedRoute.snapshot.paramMap.get('phone');
  }

  onInputKeypress({ keyCode }: KeyboardEvent): void {
    if (keyCode === 13) {
      this.verify();
    }
  }

  verify(): void {
    this.phoneService
      .login(this.phone, this.code)
      .then(() => {
        this.navCtrl.navigateRoot('profile?animate=true');
      })
      .catch(e => {
        this.handleError(e);
      });
  }

  async handleError(e: Error) {
    console.error(e);

    const alert = await this.alertCtrl.create({
      header: 'Oops!',
      message: e.message,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
