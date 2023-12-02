import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private datosAlmacenados: any;

  constructor() { }

  // Método para almacenar los datos
  almacenarDatos(datos: any): void {
    this.datosAlmacenados = datos;
  }

  // Método para obtener los datos almacenados
  obtenerDatosAlmacenados(): any {
    return this.datosAlmacenados;
  }
}
