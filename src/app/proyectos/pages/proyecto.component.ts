import { Component, inject } from "@angular/core";
import { Proyecto } from "../interfaces/proyecto";
import { CommonModule } from "@angular/common";
import { ProyectoService } from '../services/proyecto.service';
import { Router } from '@angular/router';
import { AuthService } from "../../auth/services/auth.service";

@Component({
    selector: 'app-proyecto',
    templateUrl:'./proyecto.component.html',
    imports: [
        CommonModule
    ],
})

export default class ProyectoComponent {
    
    proyectos: Proyecto[] = []; // Lista de proyectos
    proyectoSeleccionado: Proyecto | null = null; // Proyecto actualmente seleccionado
    private ProyectoService = inject( ProyectoService ); 
     
    private authservice = inject(AuthService); // Servicio de autenticación
    private route = inject(Router) // Rutas de la aplicación

    ngOnInit(): void {
         const userid=localStorage.getItem('userId') || '0';
         this.ProyectoService.findAll(userid).subscribe( (proyectos: Proyecto[]) => {
            this.proyectos = proyectos;
            //console.log("Proyectos cargados:", this.proyectos);
        });
    }

    seleccionarProyecto(proyecto: Proyecto): void {
        this.proyectoSeleccionado = proyecto;
        console.log("Proyecto seleccionado:", proyecto);
    }

    eliminarProyecto(id: string): void {
        this.proyectos = this.proyectos.filter(proyecto => proyecto.id !== id);
        console.log("Proyecto eliminado:", id);
    }

    dibujar(proyecto: Proyecto): void {
        localStorage.setItem('proyectoId', proyecto.sala!);
        localStorage.setItem('pId', proyecto.id!);
        this.route.navigate(['/pizarraflutter',proyecto.id]); 
    }

    create(){
        
        this.route.navigate(['/createproyecto']);
    }

    delete(proyecto: Proyecto): void {
        this.ProyectoService.delete(proyecto.id!).subscribe(() => {
            this.proyectos = this.proyectos.filter(p => p.id !== proyecto.id);
            console.log("Proyecto eliminado:", proyecto.id);
        });
    }

    cerrarSesion() {
  // Tu lógica de cierre de sesión aquí
  // Por ejemplo:
  this.authservice.logout();
  this.route.navigate(['/login']);
  alert('Sesión cerrada');
}


}