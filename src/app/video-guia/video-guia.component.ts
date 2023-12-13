import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-video-guia',
  templateUrl: './video-guia.component.html',
  styleUrls: ['./video-guia.component.scss'],
})
export class VideoGuiaComponent  implements OnInit {

  constructor(private router: Router) {
    // Constructor del componente
  }

  volverAlMenu() {
    this.router.navigate(['/ayuda']);
  }

  ngOnInit() {}

}
