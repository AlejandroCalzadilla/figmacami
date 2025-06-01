import { Component, inject } from "@angular/core";
import { Proyecto, TipoProyecto } from "../../interfaces/proyecto";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ProyectoService } from "../../services/proyecto.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-proyectocreate',
  templateUrl: './proyectocreate.component.html',
  imports: [
    CommonModule,
    FormsModule
  ]
})
export default class ProyectocreateComponent {
  proyecto: Proyecto = {
    title: '',
    description: '',
    tipo: TipoProyecto.FLUUTERFIGMA,
    userid: this.userID(),
    data: '{}',
    sala: this.generateRandomString(),
  };

  tiposProyecto = Object.values(TipoProyecto);
  proyectoService= inject( ProyectoService );
 
  router = inject( Router );


  onSubmit(): void {
      this.proyectoService.create(this.proyecto).subscribe(    
        (response) => {   
              this.router.navigate(['/pizarraflutter',response.id ]);    
      },
      (error) => {
        console.error('Error al crear el proyecto:', error);
      }
    );
  }

  private userID() :string {
    return localStorage.getItem('userId') || '';
  } 

  private generateRandomString(length: number = 8): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }
}