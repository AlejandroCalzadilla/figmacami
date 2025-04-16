import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import grapesjs from 'grapesjs';
import presetWebpage from 'grapesjs-preset-webpage';


@Component({
  selector: 'app-pizarrapage',
  imports: [],
  templateUrl: './pizarrapage.component.html',
  styleUrl: './pizarrapage.component.css'
})
export class PizarrapageComponent implements AfterViewInit {
  editor: any;
  ngAfterViewInit(): void {
    try {
      console.log('Inicializando GrapesJS...');
      const editor =grapesjs.init({
        container: '#gjs',
        height: '100%',
        width: '100%',
        plugins: ['presetWebpage','gjsBasicBlocks'],
        storageManager: { type: 'none' },
         // Desactiva almacenamiento para evitar errores
        
      });
      editor.BlockManager.add('custom-table', {
        label: 'Tabla Personalizada',
        category: 'Componentes',
        
        content: `
          <table style="width: 250px; border-collapse: collapse; border: 2px solid #333;">
            <thead>
              <tr>
                <th style="border: 1px solid #333; padding: 8px; background-color: #f0f0f0;">Encabezado 1</th>
                <th style="border: 1px solid #333; padding: 8px; background-color: #f0f0f0;">Encabezado 2</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="border: 1px solid #333; padding: 8px;">Celda 1</td>
                <td style="border: 1px solid #333; padding: 8px;">Celda 2</td>
              </tr>
            </tbody>
          </table>
        `,
        attributes: { class: 'fa fa-table' }
      });

      editor.BlockManager.add('custom-navar', {
        label: 'Navbar',
        content: `
          <nav style="background-color: #333; color: white; padding: 10px;">
            <a href="#" style="color: white; margin-right: 10px;">Home</a>
            <a href="#" style="color: white; margin-right: 10px;">About</a>
            <a href="#" style="color: white;">Contact</a>
          </nav>
        `,
        category: 'Basic',
        attributes: { class: 'fa fa-bars' }
      });

      editor.BlockManager.add('custom-heading', {
        label: 'Título Personalizado',
        category: 'Basic',
        content: '<h1 style="color: #2c3e50; font-family: Arial, sans-serif;">Título Principal</h1>',
        attributes: { class: 'fa fa-header' }
      });




      editor.BlockManager.add('form-text', {
        label: 'Campo de Texto',
        category: 'Formularios',
        content: `
          <div style="margin-bottom: 10px;">
            <label for="text-input" style="display: block; margin-bottom: 5px;">Texto:</label>
            <input type="text" id="text-input" name="text-input" style="width: 10%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
          </div>
        `,
        attributes: { class: 'fa fa-font' }
      });
      
      editor.BlockManager.add('form-email', {
        label: 'Correo Electrónico',
        category: 'Formularios',
        content: `
          <div style="margin-bottom: 10px;">
            <label for="email-input" style="display: block; margin-bottom: 5px;">Correo Electrónico:</label>
            <input type="email" id="email-input" name="email-input" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
          </div>
        `,
        attributes: { class: 'fa fa-envelope' }
      });
      
      editor.BlockManager.add('form-password', {
        label: 'Contraseña',
        category: 'Formularios',
        content: `
          <div style="margin-bottom: 10px;">
            <label for="password-input" style="display: block; margin-bottom: 5px;">Contraseña:</label>
            <input type="password" id="password-input" name="password-input" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
          </div>
        `,
        attributes: { class: 'fa fa-lock' }
      });
      
      editor.BlockManager.add('form-select', {
        label: 'Selector',
        category: 'Formularios',
        content: `
          <div style="margin-bottom: 10px;">
            <label for="select-input" style="display: block; margin-bottom: 5px;">Selecciona una opción:</label>
            <select id="select-input" name="select-input" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
              <option value="option1">Opción 1</option>
              <option value="option2">Opción 2</option>
              <option value="option3">Opción 3</option>
            </select>
          </div>
        `,
        attributes: { class: 'fa fa-list' }
      });
      
      editor.BlockManager.add('form-checkbox', {
        label: 'Casilla de Verificación',
        category: 'Formularios',
        content: `
          <div style="margin-bottom: 10px;">
            <label style="display: block; margin-bottom: 5px;">Selecciona una opción:</label>
            <label><input type="checkbox" name="checkbox1" value="option1"> Opción 1</label><br>
            <label><input type="checkbox" name="checkbox2" value="option2"> Opción 2</label>
          </div>
        `,
        attributes: { class: 'fa fa-check-square' }
      });
      
      editor.BlockManager.add('form-radio', {
        label: 'Botón de Radio',
        category: 'Formularios',
        content: `
          <div style="margin-bottom: 10px;">
            <label style="display: block; margin-bottom: 5px;">Selecciona una opción:</label>
            <label><input type="radio" name="radio-group" value="option1"> Opción 1</label><br>
            <label><input type="radio" name="radio-group" value="option2"> Opción 2</label>
          </div>
        `,
        attributes: { class: 'fa fa-circle' }
      });
      
      editor.BlockManager.add('form-button', {
        label: 'Botón',
        category: 'Formularios',
        content: `
          <button type="button" style="padding: 10px 20px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Botón
          </button>
        `,
        attributes: { class: 'fa fa-stop' }
      });


      editor.BlockManager.add('form-date', {
        label: 'Campo de Fecha',
        category: 'Formularios',
        content: `
          <div style="margin-bottom: 10px;">
            <label for="date-input" style="display: block; margin-bottom: 5px;">Fecha:</label>
            <input type="date" id="date-input" name="date-input" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
          </div>
        `,
        attributes: { class: 'fa fa-calendar' }
      });

      editor.BlockManager.add('form-container', {
        label: 'Contenedor de Formulario',
        category: 'Formularios',
        content: `
          <div style="padding: 20px; border: 2px dashed #ccc; background-color: #f9f9f9; border-radius: 8px;">
            <h3 style="margin-bottom: 15px; text-align: center; color: #333;">Contenedor de Formulario</h3>
            <div style="min-height: 100px; border: 1px dashed #ddd; padding: 10px; background-color: #fff;">
              <!-- Aquí se pueden arrastrar los campos de formulario -->
            </div>
          </div>
        `,
        attributes: { class: 'fa fa-square' }
      });


      editor.BlockManager.add('form-category', {
        label: 'Create Form',
        category: 'Cruds',
        content: `
          <form style="padding: 20px; border: 1px solid #ccc; background-color: #f9f9f9;">
            <h3 style="margin-bottom: 15px;">Formulario</h3>
            <div style="margin-bottom: 10px;">
              <label for="name" style="display: block; margin-bottom: 5px;">Nombre:</label>
              <input type="text" id="name" name="name" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
            </div>
            <div style="margin-bottom: 10px;">
              <label for="email" style="display: block; margin-bottom: 5px;">Correo Electrónico:</label>
              <input type="email" id="email" name="email" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
            </div>
            <div style="margin-bottom: 10px;">
              <label for="password" style="display: block; margin-bottom: 5px;">Contraseña:</label>
              <input type="password" id="password" name="password" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
            </div>
            <div style="margin-bottom: 10px;">
              <label for="gender" style="display: block; margin-bottom: 5px;">Género:</label>
              <select id="gender" name="gender" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                <option value="male">Masculino</option>
                <option value="female">Femenino</option>
                <option value="other">Otro</option>
              </select>
            </div>
            <div style="margin-bottom: 10px;">
              <label style="display: block; margin-bottom: 5px;">Preferencias:</label>
              <label><input type="checkbox" name="preference" value="news"> Recibir noticias</label><br>
              <label><input type="checkbox" name="preference" value="updates"> Recibir actualizaciones</label>
            </div>
            <div style="margin-bottom: 10px;">
              <label style="display: block; margin-bottom: 5px;">Estado Civil:</label>
              <label><input type="radio" name="marital_status" value="single"> Soltero</label><br>
              <label><input type="radio" name="marital_status" value="married"> Casado</label>
            </div>
            <div style="margin-bottom: 10px;">
              <label for="message" style="display: block; margin-bottom: 5px;">Mensaje:</label>
              <textarea id="message" name="message" rows="4" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"></textarea>
            </div>
            <button type="submit" style="padding: 10px 20px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Enviar</button>
          </form>
        `,
        attributes: { class: 'fa fa-wpforms' }
      });
      
      console.log('GrapesJS inicializado con éxito');
    } catch (error) {      console.error('Error al inicializar GrapesJS:', error);
    }
  }

}