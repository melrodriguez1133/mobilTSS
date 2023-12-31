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
import { PlanteamientoComponent } from './planteamiento/planteamiento.component';
import { ModalMensajeComponent } from './modal-mensaje/modal-mensaje.component';
import { ConceptosBasicosComponent } from './conceptos-basicos/conceptos-basicos.component';
import { SoporteTecnicoComponent } from './soporte-tecnico/soporte-tecnico.component';
import { SimulacionComponent } from './simulacion/simulacion.component';
import { VideoGuiaComponent } from './video-guia/video-guia.component';


// Material de Ionic
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AyudaComponent,
    DatosComponent,
    GuiaComponent,
    PlanteamientoComponent,
    ModalMensajeComponent,
    ConceptosBasicosComponent,
    SoporteTecnicoComponent,
    SimulacionComponent,
    VideoGuiaComponent,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
  ],
  
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
