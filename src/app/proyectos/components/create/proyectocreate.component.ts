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
    tipo: TipoProyecto.BOCETO,
    userid: this.userID(),
    data: '{}',
    sala: this.generateRandomString(),
  };

  tiposProyecto = Object.values(TipoProyecto); // Para usar en el select del formulario
  proyectoService= inject( ProyectoService );
 
  router = inject( Router );


  onSubmit(): void {
    
      console.log('Formulario enviado:', this.proyecto); 
    this.proyectoService.create(this.proyecto).subscribe(
      
        (response) => {   

        console.log('Proyecto creado:', response);
        if(this.proyecto.tipo === TipoProyecto.BOCETO ){
            // Aquí puedes redirigir al usuario a la página de boceto
            console.log('Redirigiendo a la página de boceto...');
             this.router.navigate(['/boceto',response.id ]);   
        }
           else if(this.proyecto.tipo === TipoProyecto.FIGMA ){
            // Aquí puedes redirigir al usuario a la página de figma
            console.log('Redirigiendo a la página de figma...');
             this.router.navigate(['/pizarra',response.id ]);
           }  
        // Aquí puedes redirigir al usuario o mostrar un mensaje de éxito
      },
      (error) => {
        console.error('Error al crear el proyecto:', error);
        // Aquí puedes mostrar un mensaje de error al usuario
      }
    );
    // Aquí puedes agregar la lógica para enviar el proyecto al backend
  }

  private userID() :string {
    //const user = JSON.parse(localStorage.getItem('userId') || '{}');

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