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
import { GeneratedComponent } from "../pizarra/interfaces/componente_angular";

@Injectable({
  providedIn: 'root'
})
export class ExportadorService {
  constructor() { }

  appRoutesTs = `
  import { Routes } from '@angular/router';
  export const routes: Routes = [];`

  addRouteToAppRoutesTs(ruta: string, path: string, component: string, ruta_componente: string): string {
    // Crear el import para el componente
    const newImport = `import { ${component} } from '${ruta_componente}';`;
    // Crear la nueva ruta
    const newRoute = `  { path: '${path}', component: ${component} },`;
    // Verificar si el import ya existe para evitar duplicados
    if (!ruta.includes(newImport)) {
      ruta = `${newImport}\n${ruta}`;
    }
    const updatedRoutes = ruta.replace(
      'export const routes: Routes = [',
      `export const routes: Routes = [\n${newRoute}`
    );
    return updatedRoutes;
  }

  async generateProject(componentes: GeneratedComponent[]) {
    try {
      const zip = new JSZip();
      // Crear la estructura básica del proyecto Angular
      console.log("aver componentes", componentes);

      this.createBasicAngularStructure(zip);
      // Iterar sobre los componentes generados y agregar sus archivos
      componentes.forEach((componente) => {
        //carpeta base 
        const componentBaseFolder = zip.folder(`src/app/${componente.nombre}`);
        if (!componentBaseFolder) {
          throw new Error('No se pudo crear la carpeta base del componente');
        }
        // Crear una carpeta page para el componente
        const componentPagesFolder = componentBaseFolder.folder('pages');
        if (!componentPagesFolder) {
          console.warn(`No se pudo crear la carpeta pages  para el componente: ${componente.nombre}`);
          return;
        }
        if (componente.componente == false) {
          const componentPageFolder = componentPagesFolder.folder(`${componente.nombre}_page`);
          if (!componentPageFolder) {
            console.warn(`No se pudo crear la carpeta page  para el componente: ${componente.nombre}`);
            return;
          }
          componentPageFolder.file(componente.nombre_archivo_ts, componente.ts);
          componentPageFolder.file(componente.nombre_archivo_html, componente.html);
          componentPageFolder.file(componente.nombre_archivo_css, componente.css);
        }
        //carpeta components 
        const componentComponentsFolder = componentBaseFolder.folder('components');
        if (!componentComponentsFolder) {
          console.warn(`No se pudo crear la carpeta page  para el componente: ${componente.nombre}`);
          return;
        }
        if (componente.componente == true) {
          let componentComponentFolder;
          if (componente.form !== undefined && componente.form === "create") {
            componentComponentFolder = componentComponentsFolder.folder(`${componente.nombre}_create`);
          }
          else if (componente.form !== undefined && componente.form === "edit") {
            componentComponentFolder = componentComponentsFolder.folder(`${componente.nombre}_edit`);
          }
          if (componente.form !== undefined && componente.form === "view") {
            console.log("esta creando el view ?view")
            componentComponentFolder = componentComponentsFolder.folder(`${componente.nombre}_view`);
          }
          if (!componentComponentFolder) {
            console.warn(`No se pudo crear la carpeta page  para el componente: ${componente.nombre}`);
            return;
          }
          componentComponentFolder.file(componente.nombre_archivo_ts, componente.ts);
          componentComponentFolder.file(componente.nombre_archivo_html, componente.html);
          componentComponentFolder.file(componente.nombre_archivo_css, componente.css);
        }
        //carpeta services 
        if (componente.service !== undefined) {
          const componentServiceFolder = componentBaseFolder.folder(`services`);
          if (!componentServiceFolder) {
            console.warn(`No se pudo crear la carpeta sevice  para el componente: ${componente.nombre}`);
            return;
          }
          componentServiceFolder.file(componente.nombre_archivo_service, componente.service);
        }
        //carpeta interfaces
        const componentInterfacesFolder = componentBaseFolder.folder(`interfaces`);
        if (!componentInterfacesFolder) {
          console.warn(`No se pudo crear la carpeta interfaces  para el componente: ${componente.nombre}`);
          return;
        }
        if (componente.interface !== undefined && componente.nombre_archivo_interface !== undefined) {
          componentInterfacesFolder.file(componente.nombre_archivo_interface!, componente.interface);
          console.log(`Archivos del componente ${componente.nombre} añadidos al ZIP.`);
        }
        this.appRoutesTs = this.addRouteToAppRoutesTs(this.appRoutesTs, componente.ruta.path, componente.nombreClaseComponent, componente.ruta_componente);
      });
      //console.log(this.appRoutesTs, "rutas")
      zip.file('src/app/app.routes.ts', this.appRoutesTs); // Aquí se agrega la ruta al archivo app.routes.ts
      // Generar el archivo ZIP
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, 'generico-with-sidebar.zip');
      return true;
    }
    catch (error) {
      console.error('Error al generar el proyecto:', error);
      return false;
    }
  }

  // Función para crear la estructura básica de un proyecto Angular
  private createBasicAngularStructure(zip: JSZip) {
    // Crear la estructura de carpetas
    zip.folder('src');
    zip.folder('src/app');
    //zip.folder('src/app/components');
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
    zip.file('src/app/app.config.ts', appConfigTs)
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
}

