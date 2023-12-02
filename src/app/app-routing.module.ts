import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AyudaComponent } from './ayuda/ayuda.component';
import { DatosComponent } from './datos/datos.component';
import { GuiaComponent } from './guia/guia.component';
import { PlanteamientoComponent } from './planteamiento/planteamiento.component';
import { FormulacionComponent } from './formulacion/formulacion.component';

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
  {
    path: 'simulacion',
    component: FormulacionComponent 
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
