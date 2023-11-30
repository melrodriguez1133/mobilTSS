import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  menuType!: string;

  constructor(private navCtrl: NavController) {
    this.menuType = ''; 
  }

  redirectToPage() {
    if (this.menuType === 'welcome') {
      this.navCtrl.navigateForward('/home');
    } 
    else if (this.menuType === 'guia') {
      this.navCtrl.navigateForward('/guia');
    }
    else if (this.menuType === 'datos') {
      this.navCtrl.navigateForward('/datos');
    }
    else if (this.menuType === 'simulacion') {
      this.navCtrl.navigateForward('/simulacion');
    }
    else if (this.menuType === 'ayuda') {
      this.navCtrl.navigateForward('/ayuda');
    }
}
}
