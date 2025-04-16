import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import grapesjs, { Category } from 'grapesjs';
import Studio from '@grapesjs/studio-sdk';



@Component({
  selector: 'app-pizarrapage',
  imports: [],
  templateUrl: './pizarrapage.component.html',
  styleUrl: './pizarrapage.component.css'
})
export  class PizarrapageComponent {

  editor: any;

  constructor() { }

  ngOnInit(): void {
    this.editor = grapesjs.init({
      container: '#gjs', // ID del contenedor donde se renderizará el editor
      height: '100%',
      width: 'auto',
      fromElement: false, // Cambiado a false para usar contenido inicial personalizado
      storageManager: false, // Deshabilitar almacenamiento por ahora
      blockManager: {
        appendTo: '#blocks',
      },
      panels: {
        defaults: [
          {
            id: 'panel-devices',
            el: '.panel__devices',

          },
        ],
      },
      canvas: {
        styles: ['assets/styles/grapes.css']
      },

    

    });

    const blockManager = this.editor.BlockManager;

    blockManager.add('box-block', {
      label: 'Box',
      content:{
        type:"Box",
        components: [],
        atributes:{ class:"box-block"}
      },
      category:"Components", // Categoría del bloque
      // Categoría del bloque
    });
    blockManager.add('text-block', {
      label: 'Text',
      content:{
        type:"Text",
        components: [],
        atributes:{ class:"text-block"}
      },
      category:"Components", // Categoría del bloque
      // Categoría del bloque
    });
  }



}

