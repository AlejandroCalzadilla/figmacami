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
import { files, GeminiService } from '../../services/gemini.service';
import { ExportadorFlutterService } from '../../services/exportador_flutter.service';
import { addFlutterMenuPanel } from '../../components/flutter/flutter-menu-panel.util';
import { IframeDataService } from '../../services/iframe-data.service';
import { GistService } from '../../services/gist.service';
import { environment } from '../../../../../environments/environment.prod';
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
              name: 'Mobile portrait',
              width: '393px',
              widthMedia: '393px',

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
      //this.botonExportar();
      this.botonExportarFlutter();
      this.updatePagination();

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
    this.proyectoService.UpdateData(this.id, jsonData)

  }

  private botonExportarFlutter() {
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
    this.saveCurrentPage(); // <-- Guarda la página actual antes de exportar
    const totalPages = this.pages.length;
    const allPagesContent: PageContent[] = [];
    for (let i = 0; i < totalPages; i++) {
      const html = this.pages[i];
      const css = this.pagescss[i];
      allPagesContent.push({ html, css });
    }

    // MODAL para elegir opción
    const existingModal = document.getElementById('modal-flutter-export');
    if (existingModal) existingModal.remove();
    const modal = document.createElement('div');
    modal.id = 'modal-flutter-export';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.background = 'rgba(0,0,0,0.35)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '99999';
    modal.innerHTML = `
      <div style="background:#fff;padding:32px 28px;border-radius:14px;box-shadow:0 4px 24px rgba(0,0,0,0.18);min-width:320px;max-width:90vw;text-align:center;">
        <h2 style="margin-bottom:18px;font-size:1.3rem;color:#1976d2;">¿Cómo deseas exportar?</h2>
        <button id="btn-exportar-flutter" style="background:#1976d2;color:#fff;padding:10px 18px;border:none;border-radius:8px;font-size:1rem;margin-bottom:12px;cursor:pointer;width:100%;font-weight:600;">Exportar como Flutter</button>
        <button id="btn-otra-opcion-flutter" style="background:#757575;color:#fff;padding:10px 18px;border:none;border-radius:8px;font-size:1rem;cursor:pointer;width:100%;font-weight:600;">Otra opción</button>
        <br><button id="btn-cerrar-modal-flutter" style="margin-top:18px;background:none;border:none;color:#1976d2;font-size:1.1rem;cursor:pointer;">Cancelar</button>
      </div>
    `;
    document.body.appendChild(modal);
    // Botón Exportar como Flutter
    document.getElementById('btn-exportar-flutter')?.addEventListener('click', () => {
      modal.remove();
      this.pruebaq(allPagesContent, totalPages);
    });
    // Botón Otra opción
    document.getElementById('btn-otra-opcion-flutter')?.addEventListener('click', () => {
      modal.remove();
      this.otraOpcionFlutter(allPagesContent, totalPages);
    });
    // Botón Cancelar
    document.getElementById('btn-cerrar-modal-flutter')?.addEventListener('click', () => {
      modal.remove();
    });
  }

  private showLoadingModal(message: string) {
    let modal = document.getElementById('loading-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'loading-modal';
      modal.style.position = 'fixed';
      modal.style.top = '0';
      modal.style.left = '0';
      modal.style.width = '100vw';
      modal.style.height = '100vh';
      modal.style.background = 'rgba(0,0,0,0.35)';
      modal.style.display = 'flex';
      modal.style.alignItems = 'center';
      modal.style.justifyContent = 'center';
      modal.style.zIndex = '99999';
      modal.innerHTML = `<div style="background:#fff;padding:32px 28px;border-radius:14px;box-shadow:0 4px 24px rgba(0,0,0,0.18);min-width:320px;max-width:90vw;text-align:center;">
        <h2 id="loading-modal-message" style="margin-bottom:18px;font-size:1.3rem;color:#1976d2;">${message}</h2>
        <div class="spinner" style="margin: 24px auto 0; width: 48px; height: 48px; border: 6px solid #1976d2; border-top: 6px solid #e3e3e3; border-radius: 50%; animation: spin 1s linear infinite;"></div>
        <style>@keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }</style>
      </div>`;
      document.body.appendChild(modal);
    } else {
      const msg = document.getElementById('loading-modal-message');
      if (msg) msg.textContent = message;
      modal.style.display = 'flex';
    }
  }

  private hideLoadingModal() {
    const modal = document.getElementById('loading-modal');
    if (modal) modal.remove();
  }

  private async otraOpcionFlutter(contenido: PageContent[], totalPages: number) {
    // Paso 1: Mostrar modal con spinner y mensaje inicial
    this.showLoadingModal('<span id="step-gemini">1. Generando código Flutter... <span id="check-gemini"></span></span><br><span id="step-gist">2. Subiendo a Gist... <span id="check-gist"></span></span>');
    let componentes: files[] = [];
    // Paso 2: Generar código con Gemini
    for (let i = 0; i < totalPages; i++) {
      const html = contenido[i].html;
      const css = contenido[i].css;
      try {
        componentes.push(await this.geminiService.textoAHtmlFlutter(html, css));
      } catch (e) {
        console.error(`Error procesando página ${i + 1} con GeminiService:`, e);
      }
    }
    // Palomita para Gemini
    const checkGemini = document.getElementById('check-gemini');
    if (checkGemini) {
      checkGemini.innerHTML = '<span style="color:green;font-size:1.3em;">✔️</span>';
    }
    // Spinner en Gist
    const checkGist = document.getElementById('check-gist');
    if (checkGist) {
      checkGist.innerHTML = '<span class="spinner" style="margin-left:8px; width: 18px; height: 18px; border: 3px solid #1976d2; border-top: 3px solid #e3e3e3; border-radius: 50%; display:inline-block; animation: spin 1s linear infinite; vertical-align:middle;"></span>';
    }
    // Validación
    const valid = componentes.every(
      c => c && typeof c.classname === 'string' && typeof c.content === 'string'
    );
    if (!valid) {
      this.hideLoadingModal();
      console.error('Error: Algún componente no tiene la estructura correcta:', componentes);
      alert('Error: Algún componente generado no tiene la estructura correcta. Revisa la consola para más detalles.');
      return;
    }
    // Generar el main.dart que use el primer componente generado
    let mainCode = `import 'package:flutter/material.dart';\n\n`;
    const cleanComponentes = componentes.map(c => ({
      ...c,
      content: c.content.replace(/import\s+['"]package:flutter\/material\.dart['"];?\s*/g, '')
    }));
    mainCode += cleanComponentes.map(c => c.content).join('\n\n');
    const widgetNames = cleanComponentes.map(c => c.classname || 'MyWidget');
    mainCode += `\n\nvoid main() {\n  runApp(const MyApp());\n}\n\n`;
    mainCode += `class MyApp extends StatelessWidget {\n  const MyApp({super.key});\n\n  @override\n  Widget build(BuildContext context) {\n    return MaterialApp(\n      title: 'Navigation Demo',\n      theme: ThemeData(primarySwatch: Colors.blue),\n      home: const MyHomePage(),\n    );\n  }\n}\n\n`;
    mainCode += `class MyHomePage extends StatelessWidget {\n  const MyHomePage({super.key});\n\n  @override\n  Widget build(BuildContext context) {\n    return Scaffold(\n      appBar: AppBar(\n        title: const Text('Navigation Demo'),\n      ),\n      body: Center(\n        child: Column(\n          mainAxisAlignment: MainAxisAlignment.center,\n          children: <Widget>[\n`;
    widgetNames.forEach((name, i) => {
      mainCode += `            ElevatedButton(\n              onPressed: () {\n                Navigator.push(\n                  context,\n                  MaterialPageRoute(builder: (context) => const ${name}()),\n                );\n              },\n              child: const Text('Go to ${name}'),\n            ),\n            const SizedBox(height: 20),\n`;
    });
    mainCode += `          ],\n        ),\n      ),\n    );\n  }\n}\n`;
    const token = environment.githubToken;
    // Paso 3: Subir a Gist
    this.gistService.createGistFlutterCode(token, mainCode, 'Código Flutter generado desde la pizarra').subscribe({
      next: (response: any) => {
        // Palomita para Gist
        const checkGist2 = document.getElementById('check-gist');
        if (checkGist2) {
          checkGist2.innerHTML = '<span style="color:green;font-size:1.3em;">✔️</span>';
        }
        // Mostrar botón para ir a ejecutar web
        const gistId = response.id;
        const modal = document.getElementById('loading-modal');
        if (modal) {
          const msg = document.getElementById('loading-modal-message');
          if (msg) {
            msg.innerHTML = `<span id='step-gemini'>1. Generando código Flutter... <span style='color:green;font-size:1.3em;'>✔️</span></span><br><span id='step-gist'>2. Subiendo a Gist... <span style='color:green;font-size:1.3em;'>✔️</span></span><br><br><button id='btn-ir-ejecutarweb' style='margin-top:18px;background:#1976d2;color:#fff;padding:10px 18px;border:none;border-radius:8px;font-size:1rem;cursor:pointer;font-weight:600;'>Ir a ejecutar web</button>`;
          }
          setTimeout(() => {
            const btn = document.getElementById('btn-ir-ejecutarweb');
            if (btn) {
              btn.onclick = () => {
                this.hideLoadingModal();
                this.iframeDataService.setGistId(gistId);
                this.routes.navigate(['/ejecutarweb'], { queryParams: { gist: gistId } });
              };
            }
          }, 100);
        }
      },
      error: (err: any) => {
        this.hideLoadingModal();
        console.error('Error al crear el Gist:', err);
        alert('Error al crear el Gist. Revisa la consola.');
      }
    });
  }



  private async pruebaq(contenido: PageContent[], totalPages: number) {
    // Procesar todas las páginas y enviar cada una a Gemini
    console.log('Contenido de todas las páginas:', contenido);
    let componentes: files[] = [];
    for (let i = 0; i < totalPages; i++) {
      const html = contenido[i].html;
      const css = contenido[i].css;
      try {
        componentes.push(await this.geminiService.textoAHtmlFlutter(html, css));
      } catch (e) {
        console.error(`Error procesando página ${i + 1} con GeminiService:`, e);
      }
    }
    const valid = componentes.every(
      c => c && typeof c.classname === 'string' && typeof c.content === 'string'
    );
    if (!valid) {
      console.error('Error: Algún componente no tiene la estructura correcta:', componentes);
      alert('Error: Algún componente generado no tiene la estructura correcta. Revisa la consola para más detalles.');
      return;
    }
    this.exportarFlutterService.crearArchivosYDescargarZipFlutter(componentes);
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

}

