export let  appRoutesTs = `
  import { Routes } from '@angular/router';

export const routes: Routes = [];

`


  // Función para agregar una nueva ruta
  export function addRouteToAppRoutesTs(path: string, component: string) {
    // Buscar el array de rutas y agregar la nueva ruta
    const newRoute = `  { path: '${path}', component: ${component} },`;
    appRoutesTs = appRoutesTs.replace(
      'export const routes: Routes = [',
      `export const routes: Routes = [\n${newRoute}`
    );
  }