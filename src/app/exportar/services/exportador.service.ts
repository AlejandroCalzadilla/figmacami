import { Injectable } from "@angular/core";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { packageJson } from "./archivos_angular/package_json";
import { angularJson } from "./archivos_angular/angular_json";
import { stylesCss } from "./archivos_angular/src_styles_css";
import { environmentProdTs } from "./archivos_angular/src_enviroments_enviromentprod";
import { mainTs } from "./archivos_angular/src_main_ts";
import { tsconfigJson } from "./archivos_angular/tsconfigJson";
import { indexHtml } from "./archivos_angular/src_index_html";
import { tsconfigAppJson } from "./archivos_angular/tsconfigAppJson";
import { tsconfigSpecJson } from "./archivos_angular/tsconfigSpecJson";
import { readmeMd } from "./archivos_angular/readmeMd";
import { appComponentCss } from "./archivos_angular/src_app_appComponentCss";
import { appComponentHtml } from "./archivos_angular/src_app_appComponentHtml";
import { environmentTs } from "./archivos_angular/src_enviroments_enviroment";
import { appComponentTs } from "./archivos_angular/src_app_appComponentTs";
import { appConfigTs } from "./archivos_angular/src_app_appConfig";
import { addRouteToAppRoutesTs, appRoutesTs } from "./archivos_angular/src_app_routes";
import { sidebarTs } from "./commponente/component_ts";
import { sidebarHtml } from "./commponente/component_html";
import { sidebarCss } from "./commponente/component_style";
import { ComponenteTs } from "../interfaces/componente_ts";
import { ComponenteHtml } from "../interfaces/componente_html";
import { ComponenteCss } from "../interfaces/componente_css";

@Injectable({
  providedIn: 'root'
})
export class ExportadorService {

  constructor() {}
 
  //para llamar a aumentar rutas 
  //private a=addRouteToAppRoutesTs("sdasd","adsds");

  async generateProjectWithSidebar(url:string ,componente_ts:ComponenteTs, componente_html:ComponenteHtml, componente_css:ComponenteCss) {
    try {
      const zip = new JSZip();

      // Crear la estructura básica del proyecto Angular
      this.createBasicAngularStructure(zip);

      // Agregar el componente Sidebar al proyecto
      //const componentFolder = zip.folder(`src/app/components/sidebar`);
      const componentFolder = zip.folder(url);

      // Archivo TypeScript
     // componentFolder?.file('sidebar.component.ts', sidebarTs);
        componentFolder?.file(`${componente_ts.nombre}.component.ts`, componente_ts.contenido);

      
      // Archivo HTML
      componentFolder?.file(`${componente_ts.nombre}.component.html`, componente_html.contenido);

      // Archivo CSS    
      componentFolder?.file(`${componente_ts.nombre}.component.css`, componente_css.contenido);

      addRouteToAppRoutesTs(componente_ts.nombre,componente_ts.nombreClase);
      
      // Generar el archivo ZIP
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, 'generico-with-sidebar.zip');  
      return true;

    } 
    catch (error) 
    {
      console.error('Error al generar el proyecto:', error);
      return false;
    }
  }

  // Función para crear la estructura básica de un proyecto Angular
  private createBasicAngularStructure(zip: JSZip) {
    // Crear la estructura de carpetas
    zip.folder('src');
    zip.folder('src/app');
    zip.folder('src/app/components');
    zip.folder('src/assets');
    zip.folder('src/environments');

    
    /* archivos base de un proyecto angular */
    
    // Archivo app.component.ts
    zip.file('src/app/app.component.ts', appComponentTs);

    // Archivo app.component.html
  
    zip.file('src/app/app.component.html', appComponentHtml);

    // Archivo app.component.css   
    zip.file('src/app/app.component.css', appComponentCss); 

    // Archivo app.config.ts
    zip.file('src/app/app.config.ts',appConfigTs)
    
    // Archivo routes.ts
    zip.file('src/app/app.routes.ts', appRoutesTs); // Aquí se agrega la ruta al archivo app.routes.ts

    
    // Archivo main.ts
    zip.file('src/main.ts', mainTs);

    // Archivo app.component.css
    zip.file('src/index.html', indexHtml); 
    
    // Archivo styles.css
    zip.file('src/styles.css', stylesCss);
    
    // Archivo environment.ts
    zip.file('src/environments/environment.ts', environmentTs);

    // Archivo environment.prod.ts
    zip.file('src/environments/environment.prod.ts', environmentProdTs);

    // Archivo angular.json
    zip.file('angular.json', angularJson);

    // Archivo package.json
    zip.file('package.json', packageJson);

    // Archivo tsconfig.json
    zip.file('tsconfig.json', tsconfigJson);

    // Archivo tsconfig.app.json
    zip.file('tsconfig.app.json', tsconfigAppJson);

    // Archivo tsconfig.spec.json
    zip.file('tsconfig.spec.json', tsconfigSpecJson);

    // Archivo README.md
    zip.file('README.md', readmeMd);
  }

// Ejemplo de uso

}