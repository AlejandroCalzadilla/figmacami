import { Component } from '@angular/core';
import { ExportadorAngularService } from '../services/exportador_form.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exportador',
  templateUrl: './exportador.component.html',
  imports:[
    FormsModule,
    CommonModule
  ]
 // styleUrls: ['./exportador.component.css']
})
export default class ExportadorComponent {
  htmlInput: string = '';
  nombreComponente: string = '';
  resultado: { componente: string, servicio: string, interfaz: string } | null = null;
  error: string = '';

  constructor(private exportadorService: ExportadorAngularService) { }

  exportar() {
    try {
      if (!this.htmlInput.trim()) {
        this.error = 'Por favor ingrese el código HTML';
        return;
      }

      if (!this.nombreComponente.trim()) {
        this.error = 'Por favor ingrese el nombre del componente';
        return;
      }

      this.resultado = this.exportadorService.transformarHTMLaComponente(
        this.htmlInput,
        this.nombreComponente
      );
      console.log(this.resultado)
      this.error = '';
    } catch (err) {
      this.error = 'Error al procesar el HTML: ' + (err as Error).message;
      this.resultado = null;
    }
  }

  descargarArchivo(contenido: string, nombre: string) {
    const blob = new Blob([contenido], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombre;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  descargarTodo() {
    if (this.resultado) {
      this.descargarArchivo(
        this.resultado.componente,
        `${this.nombreComponente.toLowerCase()}.component.ts`
      );
      this.descargarArchivo(
        this.resultado.servicio,
        `${this.nombreComponente.toLowerCase()}.service.ts`
      );
      this.descargarArchivo(
        this.resultado.interfaz,
        `${this.nombreComponente.toLowerCase()}.interface.ts`
      );
    }
  }
}