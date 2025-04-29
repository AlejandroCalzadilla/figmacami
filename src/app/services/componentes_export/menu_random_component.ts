import { GeneratedComponent } from '../../pizarra/interfaces/componente_angular';

export function generateMenuComponent(): GeneratedComponent {
  const nombre = 'menurandom';
  const nombreClase = 'MenuRandomComponent';
  const nombre_archivo = `${nombre}.component.ts`;
  const nombre_Clase_Service = `MenuRandomService`;

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



 const links: string[] = [];


  const html = `
   <nav class="menu">
  <ul>
    <li *ngFor="let link of link">
      <a class="links" [routerLink]="link">{{ link }}</a>
    </li>
  </ul>
</nav>
  `;

  const css = `
    .menu {
      background-color: #f8f9fa;
      padding: 10px;
      border-radius: 5px;
    }
    .menu ul {
      list-style: none;
      padding: 0;
    }
    .menu li {
      margin: 5px 0;
    }
    .menu a {
      text-decoration: none;
      color: #007bff;
    }
    .menu a:hover {
      text-decoration: underline;
    }
      .links{
      margin: 10px;
    }
  `;

  const ts = `
   
    import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
    import { RouterModule } from '@angular/router';

    @Component({
      selector: 'app-menurandom',
      imports: [RouterModule,CommonModule],
      templateUrl: './menurandom.component.html',
      styleUrls: ['./menurandom.component.css']
    })
    export class MenuRandomComponent {
      link: string[] = [
       "randomPage1",
       "randomPage2",
      "randomPage3"
      ];

      constructor() {}

      setLinks(newLinks: string[]): void {
        this.link = newLinks;
      }
    }
  `;

  const service = `
    import { Injectable } from '@angular/core';
    @Injectable({
      providedIn: 'root',
    })
    export class ${nombre_Clase_Service} {
    constructor() {}
    }

  `

  const ruta = {
    path: '',
    component: nombreClase,
  };

  const rutacomponente= `./${nombre}/pages/${nombre}page/${nombre}.component`;
 const componente=false;
  return {
    html,
    css,
    ts,
    nombre,
    nombreClaseComponent: nombreClase,
    nombre_Clase_Service:nombre_Clase_Service,
    ruta,
    service,
    nombre_archivo_ts: nombre_archivo,
    nombre_archivo_service: nombre_archivo_service,
    nombre_archivo_css: nombre_archivo_css,
    nombre_archivo_html: nombre_archivo_html,
    componente:componente,
    links,
    ruta_componente:rutacomponente,
    
     
  };
}

