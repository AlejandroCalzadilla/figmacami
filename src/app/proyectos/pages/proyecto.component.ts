import { Component, Inject, inject } from "@angular/core";
import { Proyecto, TipoProyecto } from "../interfaces/proyecto";
import { CommonModule } from "@angular/common";
import { ProyectoService } from '../services/proyecto.service';
import { Router } from '@angular/router';

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
     
    private route = inject(Router) // Rutas de la aplicación

    ngOnInit(): void {
         const userid=localStorage.getItem('userId') || '0';
         this.ProyectoService.findAll(userid).subscribe( (proyectos: Proyecto[]) => {
            this.proyectos = proyectos;
            console.log("Proyectos cargados:", this.proyectos);
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
         if( proyecto.tipo === TipoProyecto.BOCETO ){
            this.route.navigate(['/boceto',proyecto.id ]);
         }
         if( proyecto.tipo === TipoProyecto.FIGMA ){
         this.route.navigate(['/pizarra',proyecto.id]); 
        }  
    
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



}