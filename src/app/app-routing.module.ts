import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AyudaComponent } from './ayuda/ayuda.component';
import { DatosComponent } from './datos/datos.component';
import { GuiaComponent } from './guia/guia.component';
import { PlanteamientoComponent } from './planteamiento/planteamiento.component';
import { ModalMensajeComponent } from './modal-mensaje/modal-mensaje.component';
import { ConceptosBasicosComponent } from './conceptos-basicos/conceptos-basicos.component';
import { SoporteTecnicoComponent } from './soporte-tecnico/soporte-tecnico.component';
import { SimulacionComponent } from './simulacion/simulacion.component';
import { VideoGuiaComponent } from './video-guia/video-guia.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent 
  },
  {
    path: 'datos',
    component: DatosComponent 
  },
  {
    path: 'ayuda',
    component: AyudaComponent 
  },
  {
    path: 'guia',
    component: GuiaComponent 
  },
  {
    path: 'info',
    component: PlanteamientoComponent 
  },
  { path: 'conceptos-basicos',
   component: ConceptosBasicosComponent 
  },
  { path: 'soporte-tecnico',
   component: SoporteTecnicoComponent 
  },
  {
    path: 'simulacion',
    component: SimulacionComponent 
  },
  {
    path: 'guia-escrita',
    component: GuiaComponent 
  },
  {
    path: 'video-guia',
    component: VideoGuiaComponent 
  },
  {
    path: '**', 
    redirectTo: '/home'
  }
 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
