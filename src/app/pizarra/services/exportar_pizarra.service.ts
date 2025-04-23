

import { Injectable } from '@angular/core';
import { PageContent } from '../interfaces/pagecontent';

@Injectable({
  providedIn: 'root',
})
export class ExportarPizarraService {
  constructor() {}


  contenido(contenido: PageContent[], totalpages: number): void {
    console.log('Total de páginas:', totalpages);
    console.log('Contenido recibido:', contenido);
  
    for (let i = 0; i < totalpages; i++) {
      const pageContent = contenido[i]; // Obtener el contenido de la página actual
  
      if (pageContent) {

         this.buscarFormCreate(pageContent.html);
        /* console.log(`Página ${i + 1}:`);
        console.log(`HTML:`, pageContent.html);
        console.log(`CSS:`, pageContent.css); */
      } else {
        console.warn(`Faltan datos para la página ${i + 1}`);
      }
    }
  }


  buscarFormCreate(htmlString:string){
  
    const parser = new DOMParser();
const doc = parser.parseFromString(htmlString, 'text/html');

// Buscar el formulario
const form = doc.querySelector('form');

if (form) {
  // Buscar el botón dentro del formulario que tenga como texto "crear"
  const button = Array.from(form.querySelectorAll('button')).find(
    (btn) => btn.textContent?.trim().toLowerCase() === 'crear'
  );

  if (button) {
    console.log('Se encontró un formulario con un botón que tiene el texto "crear".');
    
  } else {
    console.warn('Se encontró un formulario, pero no tiene un botón con el texto "crear".');
  }
} else {
  console.warn('No se encontró un formulario en el HTML proporcionado.');
}

  }


}