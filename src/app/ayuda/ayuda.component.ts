import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ayuda',
  templateUrl: './ayuda.component.html',
  styleUrls: ['./ayuda.component.scss'],
})
export class AyudaComponent   {

  showGuideSubMenu: boolean = false;

  constructor() {}

  toggleGuideSubMenu() {
    this.showGuideSubMenu = !this.showGuideSubMenu;
  }

}
