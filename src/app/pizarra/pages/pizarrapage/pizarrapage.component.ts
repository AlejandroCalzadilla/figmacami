import { AfterViewInit, Component, inject } from '@angular/core';
import grapesjs from 'grapesjs';
import presetWebpage from 'grapesjs-preset-webpage';
import { addFormsBlocks } from '../../components/bloques/formularios';
import { addCrudsBlocks } from '../../components/bloques/cruds';
import { addComponentesBlocks } from '../../components/bloques/components';
import { CommonModule } from '@angular/common';
import { io } from 'socket.io-client';
import { ProyectoService } from '../../../proyectos/services/proyecto.service';
import { ActivatedRoute } from '@angular/router';
import { Proyecto } from '../../../proyectos/interfaces/proyecto';
import { FormGroup } from '@angular/forms';
@Component({
  selector: 'app-pizarrapage',
  imports: [CommonModule],
  templateUrl: './pizarrapage.component.html',
  styleUrl: './pizarrapage.component.css'
})
export class PizarrapageComponent  {
  editor: any;
  private pages: string[] = ['<p>Page 1</p>'];
  private pagescss: string[] = ['<style>body{background-color: #fff;}</style>'];
  private currentPage: number = 0;
  private socket: any;
  private roomId: string = 'default-room';
  private lastSentState: string = ''; // Para comparar y solo enviar cuando haya cambios reales
  private isEditing: boolean = false; // Para detectar ediciones activas
  private mouseMovementTimer: any = null;
  private proyectoService = inject(ProyectoService);
  private id!: string;
  private proyecto!: Proyecto;
  private route = inject(ActivatedRoute);


  ngOnInit(): void {
    // Suscribirse a los parámetros de la ruta
    this.route.params.subscribe(params => {
      this.id = params['id']; // Capturar el valor del parámetro 'id'

      console.log('ID recibido:', this.id);
      this.proyectoService.findById(this.id).subscribe(
        resp => {
          if (Array.isArray(resp) && resp.length > 0) {
            this.proyecto = resp[0]; // Asignar el primer elemento del array
            this.roomId = this.proyecto.sala; // Cambia esto según tu lógica 
            this.initializeEditor();
          } else {
            console.error("El servidor devolvió un array vacío o un formato inesperado:", resp);
          }
        },
        err => {
          console.error("Error al recuperar los datos del proyecto:", err);
        }
      );
    });


  }


  private initializeEditor(): void {
    try {
      console.log('Inicializando GrapesJS...');
      this.editor = grapesjs.init({
        container: '#gjs',
        height: '100%',
        width: '100%',
        plugins: ['presetWebpage', 'gjsBasicBlocks'],
        storageManager: false,
        fromElement: false,
      });
  
      if (this.proyecto.data) {
        try {
          // Primer parseo: convierte el string JSON externo en un objeto
          const outerData = JSON.parse(this.proyecto.data);
      
          // Segundo parseo: convierte el string JSON interno en un objeto
          const parsedData = JSON.parse(outerData.data);
      
          console.log('Datos del proyecto parseados:', parsedData);
      
          // Extrae los html y css
          const pages = [];
          const pagescss = [];
      
          for (const key in parsedData) {
            if (key.includes('_html')) {
              console.log('HTML encontrado:', key);
              pages.push(parsedData[key]);
            }
            if (key.includes('_css')) {
              console.log('CSS encontrado:', key);
              pagescss.push(parsedData[key]);
            }
          }
      
          this.pages = pages;
          this.pagescss = pagescss;
      
          // Cargamos la primera página si hay alguna
          if (this.pages.length > 0) {
            this.editor.setComponents(this.pages[0]);
            this.editor.setStyle(this.pagescss[0]);
          }
      
          console.log('Páginas cargadas:', this.pages);
        } catch (error) {
          console.error('Error al parsear los datos del proyecto:', error);
        }
      }
      
  
      this.initializeSocketConnection();
  
      const debouncedSendEditorState = this.debounce(() => {
        this.sendEditorState();
      }, 2000);
  
      this.editor.on('component:update', () => {
        debouncedSendEditorState();
      });
  
      this.editor.on('change:changesCount', () => {
        debouncedSendEditorState();
      });
  
      this.botonguardar();
      this.botonExportar();
      this.updatePagination();
      addFormsBlocks(this.editor);
      addCrudsBlocks(this.editor);
      addComponentesBlocks(this.editor);
    } catch (error) {
      console.error('Error al inicializar GrapesJS:', error);
    }
  }


  private botonguardar(){
    this.editor.Panels.addButton('options', {
      id: 'mi-boton-personalizado',
      className: 'fa fa-floppy-disk', // Puedes usar iconos de Font Awesome
      command: 'mi-comando', // El identificador del comando que se ejecutará
      attributes: { title: 'guardar' },
      active: false
    });
    this.editor.Commands.add('mi-comando', {
      run: function(editor:any, sender:any) {
        // Tu función personalizada aquí
       // console.log('Botón personalizado clickeado');
        // Llama a la función que deseas ejecutar
        miFuncionPersonalizada();
      }
    });
    const miFuncionPersonalizada = () => {
      // Implementa aquí la lógica que deseas ejecutar
      const allPagesContent = this.pages.map((page, index) => {
        const html = this.editor.getHtml(); // Obtiene el HTML actual del editor
        const css = this.editor.getCss();  // Obtiene el CSS actual del editor
        return { [`page${index + 1}_html`]: html, [`page${index + 1}_css`]: css };
      });
    
      // Convierte el contenido a un JSON string
      const jsonData = JSON.stringify(
        allPagesContent.reduce((acc, pageContent) => ({ ...acc, ...pageContent }), {})
      );
      console.log('Contenido de todas las páginas como JSON:', jsonData);
      console.log(this.id, 'esta el id en esta parte?');  
    };
  } 


  private botonExportar(){
   
    this.editor.Panels.addButton('options', {
      id: 'mi-boton-exportar',
      className: 'fa-brands fa-angular', // Puedes usar iconos de Font Awesome
      command: 'mi-exportar', // El identificador del comando que se ejecutará
      attributes: { title: 'exportar' },
      active: false
    });
    this.editor.Commands.add('mi-exportar', {
      run: function(editor:any, sender:any) {
        // Tu función personalizada aquí
       // console.log('Botón personalizado clickeado');
        // Llama a la función que deseas ejecutar
        miFuncionPersonalizada();
      }
    });

    const miFuncionPersonalizada = () => {
      // Implementa aquí la lógica que deseas ejecutar
      const allPagesContent = this.pages.map((page, index) => {
        const html = this.editor.getHtml(); // Obtiene el HTML actual del editor
        const css = this.editor.getCss();  // Obtiene el CSS actual del editor
        return { [`page${index + 1}_html`]: html, [`page${index + 1}_css`]: css };
      });
    

      console.log('Contenido de todas las páginas como JSON:', allPagesContent);
      //console.log('Css de la pagina ', allPagesContent);
      
      // Convierte el contenido a un JSON string
      const jsonData = JSON.stringify(
        allPagesContent.reduce((acc, pageContent) => ({ ...acc, ...pageContent }), {})
      );
    
      
      console.log(this.id, 'esta el id en esta parte?');  
      // Llama al servicio para enviar los datos al servidor
      this.proyectoService.UpdateData(this.id, jsonData).subscribe(
        (resp) => {
          console.log('Respuesta del servidor en UpdateData:', resp);
        },
        (err) => {
          console.error('Error al enviar los datos al servidor:', err);
        }
      );
    };


  }


  private initializeSocketConnection(): void {
    this.socket = io('http://localhost:3000'); // Cambia la URL según tu servidor
    //this.socket.emit('join-room', this.roomId);
    this.socket.on('editor-update', (data: any) => {
      //console.log('Datos recibidos desde el servidor:', data);
      if (data.pageIndex === this.currentPage) {
        this.editor.setComponents(data.components);
        this.editor.setStyle(data.styles);
      }
    });
  }


  private debounceTimer: any = 500;

  private sendEditorState(): void {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      const currentHtml = this.editor.getHtml();
      const currentCss = this.editor.getCss();
      const currentState = currentHtml + currentCss;
      // Solo enviar si hay un cambio real
      if (currentState !== this.lastSentState) {
        this.lastSentState = currentState;

        const changes = {
          roomId: this.roomId,
          pageIndex: this.currentPage,
          components: currentHtml,
          styles: currentCss,
        };
        this.socket.emit('editor-update', changes);
       // console.log('Estado enviado al servidor.');
      } else {
      }
    }, 1000); // Espera 1 segundo tras el último cambio antes de enviar
  }

  private debounce(func: Function, wait: number): Function {
    let timeout: any;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }



  getAllPagesContent(): { html: string; css: string }[] {
    const allPagesContent = this.pages.map((page, index) => {
      const html = this.editor.getHtml(); // Obtiene el HTML actual del editor
      const css = this.editor.getCss();  // Obtiene el CSS actual del editor
      return { html, css };
    });
  
   // console.log('Contenido de todas las páginas:', allPagesContent);
    return allPagesContent;
  }

  guardar(): void {
    const allPagesContent = this.getAllPagesContent();
    console.log('Guardando contenido de todas las páginas:', allPagesContent);
  
    // Aquí puedes enviar los datos al backend o realizar otra acción
    // Ejemplo:
    // this.backendService.savePages(allPagesContent).subscribe(response => {
    //   console.log('Contenido guardado exitosamente:', response);
    // });
  }






  private updatePagination(): void {
    const paginationPanel = document.getElementById('pagination-panel');
    if (!paginationPanel) return;

    paginationPanel.innerHTML = `
    <button id="prev-page" title="Página Anterior"><i class="fa fa-chevron-left"></i></button>
    <span>Página ${this.currentPage + 1} de ${this.pages.length}</span>
    <button id="next-page" title="Página Siguiente"><i class="fa fa-chevron-right"></i></button>
    <button id="add-page" title="Nueva Página"><i class="fa fa-plus"></i></button>
  `;

    const prevBtn = document.getElementById('prev-page') as HTMLButtonElement;
    const nextBtn = document.getElementById('next-page') as HTMLButtonElement;
    const addBtn = document.getElementById('add-page') as HTMLButtonElement;

    prevBtn.disabled = this.currentPage === 0;
    nextBtn.disabled = this.currentPage === this.pages.length - 1;

    prevBtn.onclick = () => {
      if (this.currentPage > 0) {
        //this.pages[this.currentPage] = this.editor.getHtml();
        this.saveCurrentPage();
        this.currentPage--;
        // this.editor.setComponents(this.pages[this.currentPage]);
        this.loadPage(this.currentPage); // Carga la página anterior
        //this.editor
        this.updatePagination();
      }
    };

    nextBtn.onclick = () => {
      if (this.currentPage < this.pages.length - 1) {
        // this.pages[this.currentPage] = this.editor.getHtml();
        this.saveCurrentPage();
        this.currentPage++;
        // this.editor.setComponents(this.pages[this.currentPage]);
        this.loadPage(this.currentPage); // Carga la página siguiente
        this.updatePagination();
      }
    };

    addBtn.onclick = () => {

      // this.pages[this.currentPage] = this.editor.getHtml();
      this.saveCurrentPage();
      this.pages.push('<p>Nueva Página</p>');
      this.currentPage = this.pages.length - 1;
      //this.editor.setComponents(this.pages[this.currentPage]);
      this.loadPage(this.currentPage); // Carga la nueva página
      this.updatePagination();
    };
  }

  private saveCurrentPage(): void {
    this.pages[this.currentPage] = this.editor.getHtml();
    this.pagescss[this.currentPage] = this.editor.getCss();
  }


  private loadPage(pageIndex: number): void {
    const page = this.pages[pageIndex];
    if (page) {
      const estilosycss = {
        styles: this.pagescss[pageIndex],
        components: this.pages[pageIndex]
      }
      this.editor.setComponents(estilosycss)
    }
  }
}

