import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { AyudaComponent } from './ayuda/ayuda.component';
import { DatosComponent } from './datos/datos.component';
import { GuiaComponent } from './guia/guia.component';
import { FormulacionComponent } from './formulacion/formulacion.component';
import { PlanteamientoComponent } from './planteamiento/planteamiento.component';

//material de ionic 
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
   HomeComponent,
   AyudaComponent,
   DatosComponent,
   GuiaComponent,
   FormulacionComponent,
   PlanteamientoComponent
  ],
  imports: [
    BrowserModule,
     IonicModule.forRoot(),
      AppRoutingModule,
      FormsModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
