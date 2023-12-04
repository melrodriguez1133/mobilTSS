import { Component, OnInit } from '@angular/core';
import * as emailjs from 'emailjs-com';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-soporte-tecnico',
  templateUrl: './soporte-tecnico.component.html',
  styleUrls: ['./soporte-tecnico.component.scss'],
})
export class SoporteTecnicoComponent implements OnInit {

  // Define el formulario
  soporteForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    // Inicializa el formulario con validadores
    this.soporteForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      descripcionProblema: ['', Validators.required],
    });
  }

  ngOnInit() {}

  // Función para enviar el correo electrónico
  enviarSoporte() {
    // Recoge los valores del formulario
    const { nombre, correo, telefono, descripcionProblema } = this.soporteForm.value;

    const templateParams = {
      nombre,
      correo,
      telefono,
      descripcionProblema,
    };

    // Configura EmailJS con tu servicio, plantilla y usuario
    emailjs.init('Cx1HQGqZ4HVexODAy');

    // Enviar el correo electrónico a través de EmailJS
    emailjs.send('service_dkr2fa5', 'template_jyy4v5e', templateParams)
      .then((response) => {
        console.log('Correo electrónico enviado con éxito:', response);
        // Puedes mostrar un mensaje de éxito aquí
      })
      .catch((error) => {
        console.error('Error al enviar el correo electrónico:', error);
        // Puedes mostrar un mensaje de error aquí
      });
  }
}

