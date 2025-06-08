import { Component, inject } from '@angular/core';
import grapesjs from 'grapesjs';
import { CommonModule } from '@angular/common';
import { io } from 'socket.io-client';
import { ProyectoService } from './../../../../proyectos/services/proyecto.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Proyecto } from '../../../../proyectos/interfaces/proyecto';
import { PageContent } from '../../interfaces/pagecontent';
import { addFlutterLayoutComponents } from '../../components/flutter/layouts';
import { addFlutterWidgetComponents } from '../../components/flutter/widgets';
import { addFlutterInputComponents } from '../../components/flutter/inputs';
import { addFlutterNavigationComponents } from '../../components/flutter/navigation';
import { addFlutterMaterialComponents } from '../../components/flutter/material';
import { GeminiService } from '../../services/gemini.service';
import { ExportadorFlutterService } from '../../services/exportador_flutter.service';
import { addFlutterMenuPanel } from '../../components/flutter/flutter-menu-panel.util';
import { IframeDataService } from '../../services/iframe-data.service';
import { GistService } from '../../services/gist.service';

import { exportarFlutterModal, showLoadingModal, hideLoadingModal, exportarFlutterWeb, exportarFlutterZip } from '../../components/flutter/exportar-flutter.util';
@Component({
  selector: 'app-pizarrapageflutter',
  imports: [CommonModule],
  templateUrl: './pizarrapageflutter.component.html',
  styleUrl: './pizarrapageflutter.component.css'
})
export class PizarraFlutterpageComponent {
  editor: any;
  private pages: string[] = ['<p>Page 1</p>'];
  private pagescss: string[] = ['<style>body{background-color: #fff;}</style>'];
  private currentPage: number = 0;
  private socket: any;
  private roomId: string = 'default-room';
  private lastSentState: string = ''; // Para comparar y solo enviar cuando haya cambios reales
  private proyectoService = inject(ProyectoService);
  private id!: string;
  private proyecto!: Proyecto;
  private route = inject(ActivatedRoute);
  private exportarFlutterService = inject(ExportadorFlutterService);
  private geminiService = inject(GeminiService);

  private iframeDataService = inject(IframeDataService);

  private routes = inject(Router)
  private gistService = inject(GistService)

  private lastReceivedTimestamp: number = 0;
  private lastSentTimestamp: number = 0;



  /**
   * 
   * cundo se inicializa el componente, se suscribe a los parámetros de la ruta
   * 
   */
  ngOnInit(): void {
    // Suscribirse a los parámetros de la ruta
    this.route.params.subscribe(params => {
      this.id = params['id']; // Capturar el valor del parámetro 'id'

      this.proyectoService.findById(this.id).subscribe(
        resp => {
          if (Array.isArray(resp) && resp.length > 0) {
            this.proyecto = resp[0]; // Asignar el primer elemento del array
            this.roomId = this.proyecto.sala; // Cambia esto según tu lógica 
           
            /* inicializa la pizarra */
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


  /**
   * Inicializa el editor (pizarra ) de GrapesJS y configura los componentes y estilos
   */
  private initializeEditor(): void {
    try {
      console.log('Inicializando GrapesJS...');
      /**
       * inicaliza la pizarra con sus atriutos tamañoa ,plugins y el formato mobile portrait
       * 
       */
      this.editor = grapesjs.init({
        container: '#gjs',
        height: '100%',
        width: '100%',
        plugins: ['presetWebpage', 'gjsBasicBlocks', 'grapesjs-plugin-forms'],
        storageManager: false,
        fromElement: false,
        deviceManager: {
          /**
           * configuracion para que sea parecido a un movil
           */
          devices: [
            {
              name: 'Mobile portrait',
              width: '393px',
              widthMedia: '393px',
            },
          ],
        },


      });

      // Poner el editor en modo móvil por defecto
      this.editor.setDevice('Mobile portrait');
      /**
       * 
       * carga los datos del proyecto en la pizarra si que hay algo guardado
       */
      if (this.proyecto.data) {
        try {
          let parsedData: any;
          if (typeof this.proyecto.data === 'string') {
            parsedData = JSON.parse(this.proyecto.data);
          } else {
            parsedData = this.proyecto.data;
          }
          const pages = [];
          const pagescss = [];
          for (const key in parsedData) {
            if (key.includes('_html')) {
              pages.push(parsedData[key]);
            }
            if (key.includes('_css')) {
              pagescss.push(parsedData[key]);
            }
          }
          this.pages = pages;
          this.pagescss = pagescss;
          if (this.pages.length > 0) {
            this.editor.setComponents(this.pages[0]);
            this.editor.setStyle(this.pagescss[0]);
          }
        } catch (error) {
          console.error('Error al parsear los datos del proyecto:', error);
        }
      }
      /* this.initializeSocketConnection();
      const debouncedSendEditorState = this.debounce(() => {
        this.sendEditorState();
      }, 1500);
      this.editor.on('component:update', () => {
        debouncedSendEditorState();
      });
      this.editor.on('change:changesCount', () => {
        debouncedSendEditorState();
      }); */
     
     
     
      /** 
       * botones de la pizarra 
      */

      
      this.botonguardar();
      
      this.botonExportarFlutter();
      /**
       * funciones para la paginacion 
       */
      this.updatePagination();

      /**
       * boton para volver a la lista de proyectos
       */
      this.botonProyectos();
     

      // Cargar los componentes de Flutter
      addFlutterLayoutComponents(this.editor);
      addFlutterWidgetComponents(this.editor);
      addFlutterInputComponents(this.editor);
      addFlutterNavigationComponents(this.editor);
      addFlutterMaterialComponents(this.editor);
      addFlutterMenuPanel(this.editor, this.geminiService); // <-- Ahora importado y llamado aquí
    
    
    } catch (error) {
      console.error('Error al inicializar GrapesJS:', error);
    }
  }

  ngOnDestroy() {
    const panel = document.getElementById('flutter-menu-panel');
    if (panel) panel.remove();
  }



  /** 
   *  ------------------------------GUARDA DIAGRAMA-----------------------------
    * Agrega un botón personalizado al panel de GrapesJS para guardar el diagrama
    * Este botón ejecuta el comando 'mi-comando' que guarda el diagrama actual
  */

  public botonguardar() {
    this.editor.Panels.addButton('options', {
      id: 'mi-boton-personalizado',
      className: 'fa fa-floppy-disk', // Puedes usar iconos de Font Awesome
      command: 'mi-comando', // El identificador del comando que se ejecutará
      attributes: { title: 'guardar' },
      active: false,
    });

    this.editor.Commands.add('mi-comando', {
      run: (editor: any, sender: any) => {
        this.GuardarDiagrama();
      },
    });
  }



  private GuardarDiagrama() {
    this.saveCurrentPage();
    const allPagesContent = this.pages.map((page, index) => {
      const html = this.pages[index];
      const css = this.pagescss[index];
      return { [`page${index + 1}_html`]: html, [`page${index + 1}_css`]: css };
    });
    // Junta todo en un solo objeto
    const dataObject = allPagesContent.reduce((acc, pageContent) => ({ ...acc, ...pageContent }), {});
    // ENVÍA EL OBJETO, NO EL STRING
    this.proyectoService.UpdateData(this.id, dataObject).subscribe({
      next: res => console.log('Guardado OK', res),
      error: err => console.error('Error al guardar', err)
    });
  }

//--------------------------------------



















  /**
   * ------------------------------------VUELVE A PROYECTOS --------------------
   * Agrega un botón personalizado al panel de GrapesJS para navegar a la página de proyectos
   * Este botón ejecuta el comando 'mi-proyects' que redirige a la página de proyectos
   */

 public botonProyectos() {
    this.editor.Panels.addButton('options', {
      id: 'mi-boton-proyectos',
      className: 'fa-solid fa-house',
      command: 'mi-proyects',
      attributes: { title: 'mi-proyects' },
      active: false,
    });
    this.editor.Commands.add('mi-proyects', {
      run: (editor: any, sender: any) => {
        this.miFuncionHome();
      },
    });
  }
  public miFuncionHome() {
    //this.saveCurrentPage();
    this.routes.navigate(['/proyectos']);
  }








  /**
   * ------------------------------------EXPORTAR A FLUTTER --------------------
   * Agrega un botón personalizado al panel de GrapesJS para exportar el diagrama a Flutter
   * Este botón ejecuta el comando 'mi-exportar-flutter' que maneja la exportación
   */

  public botonExportarFlutter() {
    this.editor.Panels.addButton('options', {
      id: 'mi-boton-exportar-flutter',
      className: 'fa-brands fa-flutter',
      command: 'mi-exportar-flutter',
      attributes: { title: 'exportar-flutter' },
      active: false,
    });
    this.editor.Commands.add('mi-exportar-flutter', {
      run: (editor: any, sender: any) => {
        this.miFuncionPersonalizada3();
      },
    });
  }




  private miFuncionPersonalizada3() {
    //guarda 
    this.saveCurrentPage();

    const totalPages = this.pages.length;
    const allPagesContent: PageContent[] = [];
    for (let i = 0; i < totalPages; i++) {
      const html = this.pages[i];
      const css = this.pagescss[i];
      allPagesContent.push({ html, css });
    }
    exportarFlutterModal(
      allPagesContent,
      totalPages,
      //el cliente elije exportar zip
      this.exportarPorZip.bind(this),
      //cliente elije exportar web , por dartpad
      this.exportarWeb.bind(this)
    );
  }

  private showLoadingModal = showLoadingModal;
  private hideLoadingModal = hideLoadingModal;






  /**
   * Exporta el contenido de la pizarra a Flutter Web o Zip
   * @param contenido - Contenido de las páginas
   * @param totalPages - Número total de páginas
   */ 
  private async exportarWeb(contenido: PageContent[], totalPages: number) {
    await exportarFlutterWeb(
      contenido,
      totalPages,
      this.geminiService,
      this.gistService,
      this.iframeDataService,
      this.routes,
      this.showLoadingModal,
      this.hideLoadingModal
    );
  }


  /**
   * Exporta el contenido de la pizarra a un archivo Zip
   * @param contenido - Contenido de las páginas
   * @param totalPages - Número total de páginas
   */
  private async exportarPorZip(contenido: PageContent[], totalPages: number) {
    await exportarFlutterZip(
      contenido,
      totalPages,
      this.geminiService,
      this.exportarFlutterService
    );
  }

//-----------------------------------------------------



  /* sockets ---------*/

  /* private initializeSocketConnection(): void {
    this.socket = io('http://localhost:3001', {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
      path: '/socket.io',
      transports: ['websocket', 'polling']
    });
    this.socket.emit('join-room', this.roomId);
    this.socket.on('reconnect', () => {
      console.log('Reconectado al servidor');
      this.socket.emit('join-room', this.roomId);
      this.sendEditorState();
    });
    this.socket.on('editor-update', (data: any) => {
  if (data.roomId === this.roomId && data.pageIndex === this.currentPage) {
    // Solo aplicar si el cambio remoto es más reciente
    if (!this.lastReceivedTimestamp || data.timestamp > this.lastReceivedTimestamp) {
      const currentState = this.editor.getHtml() + this.editor.getCss();
      if (currentState !== data.components + data.styles) {
        this.editor.setComponents(data.components);
        this.editor.setStyle(data.styles);
        this.lastReceivedTimestamp = data.timestamp;
      }
    }
  }
});

    // Manejar cambios de página de otros usuarios
    this.socket.on('page-change', (data: any) => {
      if (data.roomId === this.roomId) {
        this.currentPage = data.pageIndex;
        this.loadPage(this.currentPage);
        this.updatePagination();
      }
    });

    // Manejar errores de conexión
    this.socket.on('connect_error', (error: any) => {
      console.error('Error de conexión:', error);
    });
  }

  private debounceTimer: any = 1500;



  private sendEditorState(): void {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      const currentHtml = this.editor.getHtml();
      const currentCss = this.editor.getCss();
      const currentState = currentHtml + currentCss;

      if (currentState !== this.lastSentState) {
  this.lastSentState = currentState;
  const changes = {
    roomId: this.roomId,
    pageIndex: this.currentPage,
    components: currentHtml,
    styles: currentCss,
    timestamp: Date.now()
  };
  this.lastSentTimestamp = changes.timestamp;
  this.socket.emit('editor-update', changes);
}
    }, 1000);
  }

  // Método para notificar cambios de página
  private notifyPageChange(): void {
    this.socket.emit('page-change', {
      roomId: this.roomId,
      pageIndex: this.currentPage
    });
  }

  private debounce(func: Function, wait: number): Function {
    let timeout: any;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  } */
  /* sockets----------------------------- */










  /* paginado */
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
        this.saveCurrentPage();
        this.currentPage--;
        this.loadPage(this.currentPage);
        this.updatePagination();
        //this.notifyPageChange();
      }
    };

    nextBtn.onclick = () => {
      if (this.currentPage < this.pages.length - 1) {
        this.saveCurrentPage();
        this.currentPage++;
        this.loadPage(this.currentPage);
        this.updatePagination();
        // this.notifyPageChange();
      }
    };

    addBtn.onclick = () => {
      this.saveCurrentPage();
      this.pages.push('<p>Nueva Página</p>');
      this.pagescss.push('<style></style>');
      this.currentPage = this.pages.length - 1;
      this.loadPage(this.currentPage);
      this.updatePagination();
      //this.notifyPageChange();
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

