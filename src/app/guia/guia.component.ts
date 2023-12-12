import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-guia',
  templateUrl: './guia.component.html',
  styleUrls: ['./guia.component.scss'],
})

export class GuiaComponent  {

  constructor(private router: Router) {
    // Constructor del componente
  }

  volverAlMenu() {
    this.router.navigate(['/datos']);
  }
}
