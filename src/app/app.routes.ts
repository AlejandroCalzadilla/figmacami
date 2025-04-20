import { Routes } from '@angular/router';
import { PizarrapageComponent } from './pizarra/pages/pizarrapage/pizarrapage.component';
import { LoginComponent } from './auth/login/pages/login.component';
import ProyectoComponent from './proyectos/pages/proyecto.component';
import { BocetoComponent } from './boceto/pages/boceto.component';

export const routes: Routes = [

    {
        path: '', redirectTo: 'login', pathMatch: 'full'
    },

    {path: 'login', component: LoginComponent},

    {
        path: 'pizarra',component: PizarrapageComponent
    },

    {
        path:'boceto',component:BocetoComponent
    },

    {
        path: 'proyectos', loadComponent: () => import('./proyectos/pages/proyecto.component')
    },

    {path:'**', redirectTo: 'login', pathMatch: 'full'},




    
];
