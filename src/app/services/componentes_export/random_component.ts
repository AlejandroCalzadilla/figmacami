import { GeneratedComponent } from "../../pizarra/interfaces/componente_angular";

export function generateRandomComponent(html_contenido: string, css_contenido: string, pageNumber: number): GeneratedComponent
   {
    const nombre = `randomPage${pageNumber}`;
    const nombreClase = `RandomPage${pageNumber}Component`;
    const nombre_archivo = `${nombre}.component.ts`;
    const nombre_Clase_Service = `RandomPage$${pageNumber}Service`;

    const nombre_archivo_ts = `${nombre}.component.ts`; 
    const nombre_archivo_service = `${nombre}.service.ts`;
    const nombre_archivo_css = `${nombre}.component.css`;
    const nombre_archivo_html = `${nombre}.component.html`;

  
    const url_pages = `src/app/ ${nombre}/pages`;
    const url_components = `src/app/${nombre}/components`;
    const url_services = `src/app/${nombre}/services`;
    const url_interfaces = `src/app/${nombre}/interfaces`;
    const url_css = `src/app/${nombre}/css`;
    const url_ts = `src/app/${nombre}/ts`;
    const url_service = `src/app/${nombre}/services`;
    const url_html = `src/app/${nombre}/html`;


    const ts = `
      import { Component } from '@angular/core';
  
      @Component({
        selector: 'app-${nombre}',
        standalone: true,
        templateUrl: './${nombre}.component.html',
        styleUrls: ['./${nombre}.component.css']
      })
      export class ${nombreClase} {}
    `;
    const service= `
      import { Injectable } from '@angular/core';
import { GeneratedComponent } from '../../interfaces/componente_angular';
      @Injectable({
        providedIn:'root'  
      )}

   export class ${nombre_Clase_Service} {
      constructor() {}
      }  

      `
      const css=`
       ${css_contenido}
      `
      const html = `
       
      ${html_contenido}
       
      `
      const ruta ={
        path: nombre,
        component: nombreClase,
      }

    const componente=false;
    const ruta_componente=`./${nombre}/pages/${nombre}page/${nombre}.component`;
    return {
      html,
      css,
      ts,
      ruta,
      nombre,
      nombreClaseComponent: nombreClase,
      service,
      nombre_archivo_ts: nombre_archivo,
      nombre_archivo_css: nombre_archivo_css,
      nombre_archivo_html: nombre_archivo_html,
      nombre_Clase_Service:nombre_Clase_Service,
      nombre_archivo_service:nombre_archivo_service,
      componente:componente,
      ruta_componente:ruta_componente,
    };
  }