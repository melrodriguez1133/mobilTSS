import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private menu: MenuController) {}

  toggleMenu() {
    this.menu.toggle(); // Abre o cierra el menú lateral
  }
  closeMenu() {
    this.menu.close(); // Cierra el menú lateral
  }
}
