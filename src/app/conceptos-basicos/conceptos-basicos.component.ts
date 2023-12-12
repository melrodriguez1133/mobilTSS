import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-conceptos-basicos',
  templateUrl: './conceptos-basicos.component.html',
  styleUrls: ['./conceptos-basicos.component.scss'],
})
export class ConceptosBasicosComponent {

  constructor(private router: Router) {
    // Constructor del componente
  }

  volverAlMenu() {
    this.router.navigate(['/ayuda']);
  }
  volversimulacion() {
    this.router.navigate(['/datos']);
  }
}
