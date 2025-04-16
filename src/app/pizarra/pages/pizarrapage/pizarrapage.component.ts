import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import grapesjs from 'grapesjs';
import presetWebpage from 'grapesjs-preset-webpage';
import { addFormsBlocks } from '../../components/bloques/formularios';
import { addCrudsBlocks } from '../../components/bloques/cruds';
import { addComponentesBlocks } from '../../components/bloques/components';


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
      addFormsBlocks(editor);
      addCrudsBlocks(editor);  
      addComponentesBlocks(editor);
      console.log('GrapesJS inicializado con éxito');
    } catch (error) {      console.error('Error al inicializar GrapesJS:', error);
    }
  }

}