import { Routes } from '@angular/router';
import { LoginComponent } from './auth/pages/login/login.component';
import { PizarraFlutterpageComponent } from './movil/pizarra/pages/pizarrapage/pizarrapageflutter.component';

export const routes: Routes = [
    {
        path: '', redirectTo: 'login', pathMatch: 'full'
    },

    { path: 'login', component: LoginComponent },


    {
        path: 'pizarraflutter/:id', component: PizarraFlutterpageComponent
    },

    {
        path: 'proyectos', loadComponent: () => import('./proyectos/pages/proyecto.component')
    },

    {
        path: 'createproyecto', loadComponent: () => import('./proyectos/components/create/proyectocreate.component')
    },

    {
        path: 'ejecutarweb', loadComponent: () => import('./movil/pizarra/pages/dartpad/pruebas_web.component')
    },

    {
        path: 'register', loadComponent: () => import('./auth/pages/register/register.component')
    },
  


    {

        path: 'register2', loadComponent: () => import('./auth/pages/register/register.component')
    },


    { path: '**', redirectTo: 'login', pathMatch: 'full' },





];
