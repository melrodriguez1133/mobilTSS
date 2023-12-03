import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
  export class DataService {
    private inversionInicial: number = 0;
    private desviacionInversionInicial: number = 0;
    private flujoNetoInicial: number = 0;
    private desviacionFlujoNeto: number = 0;
    private tasaTREMA: number = 0;
    private datosAlmacenados: any;
  
    constructor() { }

   // Método para almacenar los datos
   almacenarDatos(datos: any): void {
    this.datosAlmacenados = datos;
  }
  setIIu(value: number) {
    this.inversionInicial = value;
  }

  setIIo(value: number) {
    this.desviacionInversionInicial = value;
  }

  setFNo(value: number) {
    this.flujoNetoInicial = value;
  }

  setFNu(value: number) {
    this.desviacionFlujoNeto = value;
  }

  setTrema(value: number) {
    this.tasaTREMA = value;
  }

  // Método para obtener los datos almacenados
  obtenerDatosAlmacenados(): any {
    return this.datosAlmacenados;
  }
  obtenerIIu(): number {
    return this.inversionInicial;
  }

  obtenerIIo(): number {
    return this.desviacionInversionInicial;
  }

  obtenerFNo(): number {
    return this.flujoNetoInicial;
  }

  obtenerFNu(): number {
    return this.desviacionFlujoNeto;
  }

  obtenerTrema(): number {
    return this.tasaTREMA;
  }
}
