import { Routes } from '@angular/router';
import { PizarrapageComponent } from './pizarra/pages/pizarrapage/pizarrapage.component';
import { LoginComponent } from './auth/pages/login/login.component';
import ProyectoComponent from './proyectos/pages/proyecto.component';
import { BocetoComponent } from './boceto/pages/boceto.component';

export const routes: Routes = [
    {
       path: '', redirectTo: 'login', pathMatch: 'full'
    },

    {path: 'login', component: LoginComponent},

    {
        path: 'pizarra/:id',component: PizarrapageComponent
    },

    {
        path:'boceto/:id',component:BocetoComponent
    },

    {
        path: 'proyectos', loadComponent: () => import('./proyectos/pages/proyecto.component')
    },

    {
        path: 'createproyecto', loadComponent: () => import('./proyectos/components/create/proyectocreate.component')
    },

   

    {
 
        path:'register', loadComponent: () => import('./auth/pages/register/register.component')
    },

    {
 
        path:'register2', loadComponent: () => import('./auth/pages/register/register.component')
    },


    {path:'**', redirectTo: 'login', pathMatch: 'full'},




    
];
