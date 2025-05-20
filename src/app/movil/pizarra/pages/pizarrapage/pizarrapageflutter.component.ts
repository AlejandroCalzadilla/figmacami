import {  Component, inject } from '@angular/core';
import grapesjs from 'grapesjs';
import presetWebpage from 'grapesjs-preset-webpage';
import { addFormsBlocks } from '../../components/bloques/formularios';
import { addCrudsBlocks } from '../../components/bloques/cruds';
import { addComponentesBlocks } from '../../components/bloques/components';
import { CommonModule } from '@angular/common';
import { io } from 'socket.io-client';
import { ProyectoService } from './../../../../proyectos/services/proyecto.service';
import { ActivatedRoute } from '@angular/router';
import { Proyecto } from '../../../../proyectos/interfaces/proyecto';
import { ExportarPizarraServiceFlutter } from '../../services/exportar_pizarra.service';
import { PageContent } from '../../interfaces/pagecontent';
import { addFlutterLayoutComponents } from '../../components/flutter/layouts';
import { addFlutterWidgetComponents } from '../../components/flutter/widgets';
import { addFlutterInputComponents } from '../../components/flutter/inputs';
import { addFlutterNavigationComponents } from '../../components/flutter/navigation';
import { addFlutterMaterialComponents } from '../../components/flutter/material';
import { GeminiService } from '../../../../services/gemini.service';
@Component({
  selector: 'app-pizarrapageflutter',
  imports: [CommonModule],
  templateUrl: './pizarrapageflutter.component.html',
  styleUrl: './pizarrapageflutter.component.css'
})
export class PizarraFlutterpageComponent  {
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
  private exportarpizaarraservice=inject(ExportarPizarraServiceFlutter);
  private geminiService = inject(GeminiService);
  

  ngOnInit(): void {
    // Suscribirse a los parámetros de la ruta
    this.route.params.subscribe(params => {
      this.id = params['id']; // Capturar el valor del parámetro 'id'
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
        deviceManager: {
        devices: [
        
          {
            name: 'Desktop',
            width: '1200px',
            widthMedia: '1200px',
          },
          {
            name: 'Tablet landscape',
            width: '1024px',
            widthMedia: '1024px',
          },
          {
            name: 'Tablet',
            width: '768px',
            widthMedia: '992px',
          },
          {
            name: 'Mobile portrait',
            width: '412px',
            widthMedia: '915px',
          },
        ],
      },
        
      });
       // Poner el editor en modo móvil por defecto
    
         this.editor.setDevice('Mobile portrait');

      if (this.proyecto.data) {
        try {
          // Primer parseo: convierte el string JSON externo en un objeto
          const outerData = JSON.parse(this.proyecto.data);
          // Segundo parseo: convierte el string JSON interno en un objeto
          const parsedData = JSON.parse(outerData.data);
          // Extrae los html y css
          const pages = [];
          const pagescss = [];
          for (const key in parsedData) {
            if (key.includes('_html')) {
              pages.push(parsedData[key]);
            }
            if (key.includes('_css')) {
            //  console.log('CSS encontrado:', key);
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
        } catch (error) {
          console.error('Error al parsear los datos del proyecto:', error);
        }
      }
      this.initializeSocketConnection();
      const debouncedSendEditorState = this.debounce(() => {
        this.sendEditorState();
      }, 1500);
      this.editor.on('component:update', () => {
        debouncedSendEditorState();
      });
      this.editor.on('change:changesCount', () => {
        debouncedSendEditorState();
      });
      this.botonguardar();
      this.botonExportar();
      this.updatePagination();

      addFlutterLayoutComponents(this.editor);
      addFlutterWidgetComponents(this.editor);
      addFlutterInputComponents(this.editor);
      addFlutterNavigationComponents(this.editor);
      addFlutterMaterialComponents(this.editor);
      
      
      this.addFlutterMenuPanel(); // <-- Añadir aquí la función del menú Flutter
    /*   addFormsBlocks(this.editor);
      addCrudsBlocks(this.editor);
      addComponentesBlocks(this.editor); */
    } catch (error) {
      console.error('Error al inicializar GrapesJS:', error);
    }
  }

  private botonguardar() {
    this.editor.Panels.addButton('options', {
      id: 'mi-boton-personalizado',
      className: 'fa fa-floppy-disk', // Puedes usar iconos de Font Awesome
      command: 'mi-comando', // El identificador del comando que se ejecutará
      attributes: { title: 'guardar' },
      active: false,
    });
  
    this.editor.Commands.add('mi-comando', {
      run: (editor: any, sender: any) => {
        this.miFuncionPersonalizada();
      },
    });
  }
  
  private miFuncionPersonalizada() {
    // Asegúrate de guardar el contenido actual de la página activa antes de procesar todas las páginas
    this.saveCurrentPage();
  
    // Construir el contenido de todas las páginas
    const allPagesContent = this.pages.map((page, index) => {
      const html = this.pages[index]; // Obtener el HTML almacenado de la página
      const css = this.pagescss[index]; // Obtener el CSS almacenado de la página
      return { [`page${index + 1}_html`]: html, [`page${index + 1}_css`]: css };
    });
  
    // Convierte el contenido a un JSON string
    const jsonData = JSON.stringify(
      allPagesContent.reduce((acc, pageContent) => ({ ...acc, ...pageContent }), {})
    );
  
    // Enviar los datos al servidor
    this.proyectoService.UpdateData(this.id, jsonData).subscribe(
      (resp) => {
        //console.log('Respuesta del servidor en UpdateData:', resp);
      },
      (err) => {
        //console.error('Error al enviar los datos al servidor:', err);
      }
    );
  } 




  


  private botonExportar() {
    this.editor.Panels.addButton('options', {
      id: 'mi-boton-exportar',
      className: 'fa-brands fa-angular',
      command: 'mi-exportar',
      attributes: { title: 'exportar' },
      active: false,
    });
  
    this.editor.Commands.add('mi-exportar', {
      run: (editor: any, sender: any) => {
        this.miFuncionPersonalizada2();
      },
    });
  }
  
  private miFuncionPersonalizada2() {
    const totalPages = this.pages.length;
    const allPagesContent: PageContent[] = [];
  
    for (let i = 0; i < totalPages; i++) {
      // Obtener el contenido directamente de las páginas almacenadas
      const html = this.pages[i];
      const css = this.pagescss[i];
  
      // Agregar el contenido al array
      allPagesContent.push({ html, css });
    }
  
   // console.log('Contenido de todas las páginas como JSON:', allPagesContent);
    this.prueba(allPagesContent, totalPages);
  }

  private prueba(contenido:PageContent[], totalPages: number){
     this.exportarpizaarraservice.contenidot(contenido, totalPages);
  }










  /* sockets ---------*/

  private initializeSocketConnection(): void {
    this.socket = io('http://localhost:3001', {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
      path: '/socket.io',
      transports: ['websocket', 'polling']
    });

    // Unirse a la sala específica
    this.socket.emit('join-room', this.roomId);

    // Manejar reconexión
    this.socket.on('reconnect', () => {
      console.log('Reconectado al servidor');
      this.socket.emit('join-room', this.roomId);
      this.sendEditorState();
    });

    // Manejar actualizaciones del editor
    this.socket.on('editor-update', (data: any) => {
      if (data.roomId === this.roomId && data.pageIndex === this.currentPage) {
        const currentState = this.editor.getHtml() + this.editor.getCss();
        if (currentState !== data.components + data.styles) {
          this.editor.setComponents(data.components);
          this.editor.setStyle(data.styles);
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
  }
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
        this.notifyPageChange();
      }
    };

    nextBtn.onclick = () => {
      if (this.currentPage < this.pages.length - 1) {
        this.saveCurrentPage();
        this.currentPage++;
        this.loadPage(this.currentPage);
        this.updatePagination();
        this.notifyPageChange();
      }
    };

    addBtn.onclick = () => {
      this.saveCurrentPage();
      this.pages.push('<p>Nueva Página</p>');
      this.pagescss.push('<style></style>');
      this.currentPage = this.pages.length - 1;
      this.loadPage(this.currentPage);
      this.updatePagination();
      this.notifyPageChange();
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

  private addFlutterMenuPanel() {
    // Añadir el botón al panel izquierdo (views)
    this.editor.Panels.addButton('views', {
      id: 'open-flutter-menu',
      className: 'fa fa-cubes', // Icono FontAwesome
      attributes: { title: 'Flutter Assistant' },
      command: 'open-flutter-menu',
      togglable: true,
    });

    // Añadir el comando para mostrar/ocultar el panel lateral derecho
    this.editor.Commands.add('open-flutter-menu', {
      run: (editor: any) => {
        let panel = document.getElementById('flutter-menu-panel');
        if (!panel) {
          panel = document.createElement('div');
          panel.id = 'flutter-menu-panel';
          panel.className = 'panel__flutter-menu';
          panel.style.position = 'fixed';
          panel.style.top = '0';
          panel.style.right = '0';
          panel.style.width = '330px';
          panel.style.height = '100vh';

          panel.style.zIndex = '9999';
          panel.style.marginTop = '40px';
          panel.style.background = 'rgb(68,68,68)';
          panel.style.padding = '24px 18px 18px 18px';
          panel.style.borderLeft = '1.5px solid #e0e0e0';
          panel.style.boxShadow = '-2px 0 12px rgba(0,0,0,0.08)';
          panel.style.display = 'flex';
          panel.style.flexDirection = 'column';
          panel.innerHTML = `
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:18px;">
              <span style="font-size:1.4rem;font-weight:600;color:#1976d2;">Flutter Assistant</span>
              <button id="close-flutter-menu-panel" style="margin-left:auto;background:none;border:none;font-size:1.5rem;color:#757575;cursor:pointer;">&times;</button>
            </div>
            <textarea id="flutter-assistant-textarea" placeholder="Escribe tu prompt..." style="color:white; width:100%;min-height:90px;max-height:200px;border-radius:10px;border:1.5px solid #bdbdbd;padding:12px;font-size:1rem;resize:vertical;margin-bottom:18px;"></textarea>
            <div style="display:flex;gap:16px;align-items:center;margin-bottom:18px;">
              <button id="flutter-assistant-audio" title="Enviar audio" style="background:#1976d2;border:none;border-radius:50%;width:48px;height:48px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:1.5rem;cursor:pointer;"><i class="fa fa-microphone"></i></button>
              <button id="flutter-assistant-image" title="Enviar imagen" style="background:#43a047;border:none;border-radius:50%;width:48px;height:48px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:1.5rem;cursor:pointer;"><i class="fa fa-image"></i></button>
            </div>
            <button id="flutter-assistant-send" style="background:#1976d2;color:#fff;border:none;border-radius:8px;padding:10px 18px;font-size:1rem;cursor:pointer;width:100%;font-weight:600;">Enviar</button>
          `;
          document.body.appendChild(panel);
          // Cerrar panel al hacer click en la X
          document.getElementById('close-flutter-menu-panel')?.addEventListener('click', () => {
            panel!.style.display = 'none';
            // Desactivar el botón
            const btn = document.querySelector('[data-id="open-flutter-menu"]');
            if (btn) (btn as HTMLElement).classList.remove('gjs-pn-active');
          });

          
          // Botón Enviar: añade una tarjeta con imagen y texto al lienzo
          const sendBtn = document.getElementById('flutter-assistant-send');
          if (sendBtn) {
            sendBtn.addEventListener('click', async () => {
              const textarea = document.getElementById('flutter-assistant-textarea') as HTMLTextAreaElement;
              if (textarea && textarea.value.trim()) {
                try {
                  const html = await this.geminiService.generacionHtmlFlutter(textarea.value.trim());
                  console.log('HTML generado:', html);
                  this.editor.addComponents(html);
                  textarea.value = '';
                } catch (e) {
                  alert('Error generando HTML con GeminiService');
                }
              }
            });
          }
          // Botón Enviar audio (grabación en directo)
          const audioBtn = document.getElementById('flutter-assistant-audio');
          if (audioBtn) {
            let mediaRecorder: MediaRecorder | null = null;
            let audioChunks: BlobPart[] = [];
            let isRecording = false;
          
            audioBtn.addEventListener('click', async () => {
              const btn = audioBtn as HTMLButtonElement;
              if (!isRecording) {
                // Iniciar grabación
                try {
                  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                  mediaRecorder = new MediaRecorder(stream);
                  audioChunks = [];
                  mediaRecorder.ondataavailable = (e) => {
                    if (e.data.size > 0) audioChunks.push(e.data);
                  };
                  mediaRecorder.onstop = async () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                    // Convertir Blob a File
                    const audioFile = new File([audioBlob], 'grabacion.webm', { type: 'audio/webm' });
                    // Mostrar spinner/cargando
                    (audioBtn as HTMLButtonElement).disabled = true;
                    (audioBtn as HTMLButtonElement).innerHTML = `<i class="fa fa-spinner fa-spin"></i>`;
                    try {
                      const html = await this.geminiService.audioAHtmlFlutter(audioFile);
                      this.editor.addComponents(html);
                    } catch (e) {
                      alert('Error procesando el audio con GeminiService');
                    } finally {
                      (audioBtn as HTMLButtonElement).disabled = false;
                      (audioBtn as HTMLButtonElement).innerHTML = '<i class="fa fa-microphone"></i>';
                      (audioBtn as HTMLButtonElement).style.background = '#1976d2';
                      (audioBtn as HTMLButtonElement).title = 'Enviar audio';
                    }
                  };
                  mediaRecorder.start();
                  isRecording = true;
                  (audioBtn as HTMLButtonElement).style.background = '#d32f2f'; // Cambia color para indicar grabando
                  (audioBtn as HTMLButtonElement).title = 'Detener grabación';
                } catch (err) {
                  alert('No se pudo acceder al micrófono.');
                }
              } else {
                // Detener grabación
                if (mediaRecorder && mediaRecorder.state !== 'inactive') {
                  mediaRecorder.stop();
                }
                isRecording = false;
              }
            });
          }
          // Botón Enviar imagen
          const imageBtn = document.getElementById('flutter-assistant-image');
          if (imageBtn) {
            imageBtn.addEventListener('click', () => {
              // Crear input file oculto
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*';
              input.style.display = 'none';
              input.addEventListener('change', (event: any) => {
                const file = event.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (e: any) => {
                    const imgHtml = `<img src='${e.target.result}' alt='Imagen subida' style='max-width:100%;border-radius:8px;margin:12px auto;display:block;'>`;
                    this.editor.addComponents(imgHtml);
                  };
                  reader.readAsDataURL(file);
                }
              });
              document.body.appendChild(input);
              input.click();
              setTimeout(() => document.body.removeChild(input), 1000);
            });
          }
        }
        panel.style.display = 'flex';
      },
      stop: (editor: any) => {
        const panel = document.getElementById('flutter-menu-panel');
        if (panel) panel.style.display = 'none';
      },
    });
  }

}

