import { AfterViewInit, Component, inject } from '@angular/core';
import grapesjs from 'grapesjs';
import presetWebpage from 'grapesjs-preset-webpage';
import { addFormsBlocks } from '../../components/bloques/formularios';
import { addCrudsBlocks } from '../../components/bloques/cruds';
import { addComponentesBlocks } from '../../components/bloques/components';
import { CommonModule } from '@angular/common';
import { io } from 'socket.io-client';
import * as pako from 'pako';
import { PaginationService } from '../../services/pagination.service';
@Component({
  selector: 'app-pizarrapage',
  imports: [CommonModule],
  templateUrl: './pizarrapage.component.html',
  styleUrl: './pizarrapage.component.css'
})
export class PizarrapageComponent implements AfterViewInit {
  editor: any;
  private pages: string[] = ['<p>Page 1</p>'];
  private pagescss: string[] = ['<style>body{background-color: #fff;}</style>'];
  private currentPage: number = 0;
  private socket: any;
  private roomId: string = 'default-room';
  private paginationService= inject(PaginationService);
  private lastSentState: string = ''; // Para comparar y solo enviar cuando haya cambios reales
  private isEditing: boolean = false; // Para detectar ediciones activas
  private mouseMovementTimer: any = null;
  
   
  ngAfterViewInit(): void {
    try {
      console.log('Inicializando GrapesJS...');
      this.editor =grapesjs.init({
        container: '#gjs',
        height: '100%',
        width: '100%',
        plugins: ['presetWebpage','gjsBasicBlocks'],
        storageManager: false,
        fromElement: false,
         //  Desactiva almacenamiento para evitar errores
        
      });
      // Inicializar el cliente StompJS
      this.initializeSocketConnection();

      const debouncedSendEditorState = this.debounce(() => {
        this.sendEditorState();
      }, 2000);
      // Escuchar cambios en tiempo real en el editor
       this.editor.on('component:update', () => {
        debouncedSendEditorState();
      }); 

       this.editor.on('change:changesCount', () => {
        debouncedSendEditorState();
      });  
      
      this.updatePagination();
      addFormsBlocks(this.editor);
      addCrudsBlocks(this.editor);  
      addComponentesBlocks(this.editor);
      //console.log('GrapesJS inicializado con éxito');
    } catch (error) {      console.error('Error al inicializar GrapesJS:', error);
    }
  }



private   initializeSocketConnection(): void {
  this.socket = io('http://localhost:3000'); // Cambia la URL según tu servidor
  // Unirse a una sala
  this.socket.emit('join-room', this.roomId);
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
      console.log('Estado enviado al servidor.');
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



 /*private  sendEditorState(): void {
  const changes = {
    roomId: this.roomId,
    pageIndex: this.currentPage,
    components: this.editor.getHtml(), // Solo los componentes actuales
    styles: this.editor.getCss(), // Solo los estilos actuales
  };
  this.socket.emit('editor-update', changes);
 }  */
 


/* private sendEditorState(): void {
  // Obtener el estado actual
  const currentState = {
    components: this.editor.getHtml(),
    styles: this.editor.getCss()
  };
  
  const stateString = JSON.stringify(currentState);
  
  // Solo enviar si el estado ha cambiado realmente
  if (stateString !== this.lastSentState) {
    const changes = {
      roomId: this.roomId,
      pageIndex: this.currentPage,
      components: currentState.components,
      styles: currentState.styles,
    };
    
    // Guardar el último estado enviado para comparación
    this.lastSentState = stateString;
    
    // Comprimir los datos antes de enviar
    const compressedState = pako.deflate(JSON.stringify(changes));
    console.log('Estado comprimido:', compressedState);
    this.socket.emit('editor-update', compressedState);
  }
} */


















/*
 private async sendEditorState(): Promise<void> {
   const state = {
    roomId: this.roomId,
    pageIndex: this.currentPage,
    components: this.editor.getHtml(),
    styles: this.editor.getCss(),
  };

  await this.socket.emit('editor-update', state); // Enviar el estado al servidor
  console.log('Estado enviado al servidor:', state);
}  */
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
  this.pages[this.currentPage] = this.editor.getHtml() ;
  this.pagescss[this.currentPage] = this.editor.getCss() ;
}


private loadPage(pageIndex: number): void {
  const page = this.pages[pageIndex];
  if (page) {
    const estilosycss={
      styles: this.pagescss[pageIndex],
      components: this.pages[pageIndex]
    }
    this.editor.setComponents(estilosycss)
  }
} 

// Métodos para manejar páginas
 
}