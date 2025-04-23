import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, ElementRef, HostListener, ViewChild, inject } from '@angular/core';
import Konva from 'konva';
import { DrawingService } from '../services/drawing.service';
import { ChangeDetectorRef } from '@angular/core';
import { ProyectoService } from '../../proyectos/services/proyecto.service';
import { Proyecto } from "../../proyectos/interfaces/proyecto";
import { routes } from '../../app.routes';
import { ActivatedRoute } from "@angular/router";
import { KonvaArrowAttrs, KonvaCircleAttrs, KonvaNode, KonvaRectAttrs } from "../interfaces/bloques";
@Component({
  selector: 'app-boceto',
  templateUrl: './boceto.component.html',
  imports: [
    CommonModule
  ],
})
export class BocetoComponent  {
  @ViewChild('konvaContainer') konvaContainer!: ElementRef;
  constructor(private cdr: ChangeDetectorRef) {}
  // Propiedades de Konva
  stages: Konva.Stage[] = [];
  layers: Konva.Layer[] = [];
  transformers: Konva.Transformer[] = [];
  currentTool: string = 'select'; // Estado de la aplicación
  currentColor: string = '#3B82F6'; // Azul predeterminado
  currentStrokeWidth: number = 3;
  isDrawing: boolean = false;
  currentLine: Konva.Line | null = null;
  selectedShape: Konva.Shape| Konva.Image | null = null;
  drawingService = inject(DrawingService);
  
  // Gestión de páginas
  currentPageIndex: number = 0;
  pageCount: number = 0;
  pageNames: string[] = ['Página 1'];

  proyectoService= inject( ProyectoService );
  id: string = ''; // ID del proyecto
  route = inject(ActivatedRoute);
  proyecto!:Proyecto;
  roomId: string = ''; // ID de la sala
  // Colores disponibles
  colors: string[] = [
    '#EF4444', // Rojo
    '#F59E0B', // Ámbar
    '#10B981', // Esmeralda
    '#3B82F6', // Azul
    '#8B5CF6', // Violeta
    '#EC4899', // Rosa
    '#000000', // Negro
    '#6B7280', // Gris
  ];

  // Grosores de línea disponibles
  strokeWidths: number[] = [1, 3, 5, 8];
  
  ngOnInit(): void {
    // Suscribirse a los parámetros de la ruta
    this.route.params.subscribe(params => {
      this.id = params['id'];
      console.log('ID recibido:', this.id);
      this.loadProjectData();
    });
  }

  private loadProjectData(): void {
    this.proyectoService.findById(this.id).subscribe(
      resp => {
        if (Array.isArray(resp) && resp.length > 0) {
          this.proyecto = resp[0];
          this.roomId = this.proyecto.sala;

          // Guardar los datos para cargarlos después de que el view esté listo
          if (this.proyecto.data) {
            this.savedData = JSON.parse(this.proyecto.data);
            console.log('Datos recibidos:', this.savedData);
            // Inicializar Konva después de cargar los datos
            this.initializeKonva();
          } else {
            console.log('No hay datos en el proyecto, creando página vacía');
            this.initializeKonva();
          }
        } else {
          console.error("El servidor devolvió un array vacío o un formato inesperado:", resp);
          this.initializeKonva();
        }
      },
      err => {
        console.error("Error al recuperar los datos del proyecto:", err);
        this.initializeKonva();
      }
    );
  }

  private initializeKonva(): void {
    if (this.savedData) {
      console.log('Inicializando Konva con datos guardados:', this.savedData);
      Object.keys(this.savedData).forEach(key => {
        this.createNewPage2(this.savedData[key]);
      });
    } else {
      this.createNewPage2();
    }
  }

 
  private savedData: any = null;

  guardar(): void {
    // Crear un objeto para almacenar los datos de todas las páginas
    const allPagesContent: { [key: string]: any } = {};
  
    // Iterar sobre los stages y exportar su contenido
    this.stages.forEach((stage, index) => {
      const pageKey = `page${index + 1}`;
      
      // Obtener todos los nodos de la capa actual
      const layer = this.layers[index];
      const nodes = layer.children;
      
      // Crear un array con los datos de cada nodo
      const nodesData = nodes.map(node => {
        // Excluir el transformador de los datos guardados
        if (node instanceof Konva.Transformer) {
          return null;
        }
        return node.toObject();
      }).filter(node => node !== null);
      
      allPagesContent[pageKey] = nodesData;
    });
    const jsonData = JSON.stringify(allPagesContent);
    console.log('Contenido de todas las páginas:', jsonData);
    this.proyectoService.UpdateData(this.id, jsonData).subscribe(
      (resp) => {
        console.log('Datos guardados exitosamente:', resp);
      },
      (err) => {
        console.error('Error al guardar los datos:', err);
      }
    );
  }

  createNewPage2(data?: string): void {
    if (!this.konvaContainer?.nativeElement) {
      console.error('El contenedor de Konva no está disponible');
      return;
    }

    const container = this.konvaContainer.nativeElement;
    
    // Crear un contenedor específico para esta página
    const pageContainer = document.createElement('div');
    pageContainer.style.position = 'absolute';
    pageContainer.style.width = '100%';
    pageContainer.style.height = '100%';
    pageContainer.style.display = 'none';
    container.appendChild(pageContainer);

    // Crear el stage de Konva
    const stage = new Konva.Stage({
      container: pageContainer,
      width: container.offsetWidth,
      height: container.offsetHeight,
    });

    const layer = new Konva.Layer();
    stage.add(layer);
    const transformer = new Konva.Transformer({
      nodes: [],
      rotateEnabled: true,
      enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      borderStroke: '#2D9CDB',
      anchorStroke: '#2D9CDB',
      anchorFill: '#FFFFFF',
      anchorSize: 8,
      borderStrokeWidth: 1,
      padding: 5,
    });
    layer.add(transformer);
    
    /* if (typeof data !== 'string') {
      console.error('El valor de data no es un string JSON:', data);
      return;
    } */
    if (data) {
      try {
        const parsedData = JSON.parse(data); // Parsear el JSON
        console.log('Datos parseados para esta página:', parsedData);
    
        // Verificar si parsedData es un objeto
        if (typeof parsedData === 'object' && parsedData !== null) {
          Object.keys(parsedData).forEach((pageKey) => {
            const pageData = parsedData[pageKey];
            if (Array.isArray(pageData)) {
              console.log(`Procesando ${pageKey} con ${pageData.length} nodos...`);
              pageData.forEach((nodeData: KonvaNode) => {
                try {
                  switch (nodeData.className) {
                    case 'Rect':
                      const rectAttrs = nodeData.attrs as KonvaRectAttrs;
                      const rect = new Konva.Rect(rectAttrs);
                      layer.add(rect);
                      break;
    
                case 'Circle':
                  const circleAttrs = nodeData.attrs as KonvaCircleAttrs;
                  const circle = new Konva.Circle(circleAttrs);
                  layer.add(circle);
                  break;
    
                case 'Arrow':
                  const arrowAttrs = nodeData.attrs as KonvaArrowAttrs;
                  const arrow = new Konva.Arrow(arrowAttrs);
                  layer.add(arrow);
                  break;
    
                case 'Text':
                  const textAttrs = nodeData.attrs as Konva.TextConfig;
                  const text = new Konva.Text(textAttrs);
                  layer.add(text);
                  break;
    
                    default:
                      console.warn('Tipo de nodo desconocido:', nodeData.className);
                  }
                } catch (nodeError) {
                  console.error('Error al crear nodo individual:', nodeError);
                }
              });
              layer.draw();
            } else {
              console.warn(`Los datos de ${pageKey} no son un array:`, pageData);
            }
          });
        } else {
          console.warn('Los datos no tienen el formato esperado (objeto con páginas):', parsedData);
        }
      } catch (error) {
        console.error('Error al parsear los datos del stage:', error);
      }
    }
    
    this.stages.push(stage);
    this.layers.push(layer);
    this.transformers.push(transformer);
    this.setupStageEvents(stage, layer, transformer);
    this.pageNames.push(`Página ${this.pageCount + 1}`);
    this.pageCount++;

    // Mostrar la página actual
    this.showCurrentPage();
  }



  

  

  showCurrentPage(): void {
    this.drawingService.cleanupTextarea();

    // Ocultar todos los contenedores primero
    this.stages.forEach((stage, index) => {
      const container = stage.container();
      if (index === this.currentPageIndex) {
        container.style.display = 'block';
        stage.draw();
      } else {
        container.style.display = 'none';
      }
    });

    // Actualizar el transformador actual
    if (this.transformers[this.currentPageIndex]) {
      this.drawingService.setTransformer(this.transformers[this.currentPageIndex]);
      this.drawingService.enableDoubleClickEdit(this.stages[this.currentPageIndex]);
    }

    // Limpiar el estado de selección
    this.selectedShape = null;
    this.currentTool = 'select';

    // Forzar la detección de cambios en el siguiente ciclo
    setTimeout(() => {
      this.cdr.detectChanges();
    });
  }

  nextPage(): void {
    if (this.currentPageIndex < this.pageCount - 1) {
      this.currentPageIndex++;
      this.showCurrentPage();
    }
  }

  previousPage(): void {
    if (this.currentPageIndex > 0) {
      this.currentPageIndex--;
      this.showCurrentPage();
    }
  }

  goToPage(index: number): void {
    if (index >= 0 && index < this.pageCount) {
      this.currentPageIndex = index;
      this.showCurrentPage();
    }
  }

  deleteCurrentPage(): void {
    if (this.pageCount > 1) {
      // Obtener el stage y el contenedor a eliminar
      const stageToDelete = this.stages[this.currentPageIndex];
      const containerToDelete = stageToDelete.container();

      // Eliminar el stage y limpiar recursos
      stageToDelete.destroy();
      if (containerToDelete && containerToDelete.parentNode) {
        containerToDelete.parentNode.removeChild(containerToDelete);
      }

      // Eliminar referencias
      this.stages.splice(this.currentPageIndex, 1);
      this.layers.splice(this.currentPageIndex, 1);
      this.transformers.splice(this.currentPageIndex, 1);
      this.pageNames.splice(this.currentPageIndex, 1);
      this.pageCount--;

      // Ajustar el índice si es necesario
      if (this.currentPageIndex >= this.pageCount) {
        this.currentPageIndex = this.pageCount - 1;
      }

      // Limpiar el estado actual
      this.selectedShape = null;
      this.currentTool = 'select';

      // Mostrar la página actual y actualizar el transformador
      const currentStage = this.stages[this.currentPageIndex];
      const currentTransformer = this.transformers[this.currentPageIndex];
      
      if (currentStage && currentTransformer) {
        currentStage.container().style.display = 'block';
        currentStage.draw();
        this.drawingService.setTransformer(currentTransformer);
        this.drawingService.enableDoubleClickEdit(currentStage);
      }

      // Forzar la detección de cambios en el siguiente ciclo
      setTimeout(() => {
        this.cdr.detectChanges();
      });
    }
  }

  renamePage(index: number, newName: string): void {
    if (index >= 0 && index < this.pageCount) {
      this.pageNames[index] = newName;
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    this.stages.forEach(stage => {
      if (stage) {
        stage.width(this.konvaContainer.nativeElement.offsetWidth);
        stage.height(this.konvaContainer.nativeElement.offsetHeight);
        stage.draw();
      }
    });
  }

  setupStageEvents(stage: Konva.Stage, layer: Konva.Layer, transformer: Konva.Transformer): void {
    this.drawingService.setupStageEvents(
      stage,
      layer,
      transformer,
      () => this.currentTool, // getTool
      () => this.currentColor, // getColor
      () => this.currentStrokeWidth, // getStrokeWidth
      (shape) => this.selectedShape = shape, // setSelectedShape
      () => this.selectedShape // getSelectedShape
    );
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.drawingService.importImageToCanvas(this.stages[this.currentPageIndex], this.layers[this.currentPageIndex], file);
    }
  }

  updateShapeSize(width: number, height: number): void {
    if (this.selectedShape) {
      this.selectedShape.width(width);
      this.selectedShape.height(height);
      this.layers[this.currentPageIndex].batchDraw();
    }
  }

  selectTool(tool: string): void {
    this.currentTool = tool;
    const stage = this.stages[this.currentPageIndex];
    const transformer = this.transformers[this.currentPageIndex];
    
    if (stage && transformer) {
      this.drawingService.selectTool(tool, stage, transformer);
    }
  
    if (tool !== 'select') {
      this.selectedShape = null;
    }
  }

  selectColor(color: string): void {
    this.currentColor = color;
    this.drawingService.selectColor(color, this.selectedShape, this.layers[this.currentPageIndex]);
  }

  selectStrokeWidth(width: number): void {
    this.currentStrokeWidth = width;
    // Si hay una forma seleccionada, cambiar su grosor
    if (this.selectedShape) {
      this.selectedShape.strokeWidth(width);
      this.layers[this.currentPageIndex].batchDraw();
    }
  }

  addRectangle(): void {
    const stage = this.stages[this.currentPageIndex];
    const layer = this.layers[this.currentPageIndex];
    if (stage && layer) {
      const rect = this.drawingService.createRectangle(stage, layer, {
        color: this.currentColor,
        strokeWidth: this.currentStrokeWidth,
      });
      this.selectShape(rect);
    }
  }

  addCircle(): void {
    const stage = this.stages[this.currentPageIndex];
    const layer = this.layers[this.currentPageIndex];
    if (stage && layer) {
      const circle = this.drawingService.createCircle(stage, layer, {
        color: this.currentColor,
        strokeWidth: this.currentStrokeWidth,
      });
      this.selectShape(circle);
    }
  }

  addArrow(): void {
    const stage = this.stages[this.currentPageIndex];
    const layer = this.layers[this.currentPageIndex];
    if (stage && layer) {
      const arrow = this.drawingService.createArrow(stage, layer, {
        color: this.currentColor,
        strokeWidth: this.currentStrokeWidth,
      });
      this.selectShape(arrow);
    }
  }

  addText(): void {
    const stage = this.stages[this.currentPageIndex];
    const layer = this.layers[this.currentPageIndex];
    if (stage && layer) {
      const textNode = this.drawingService.createText(stage, layer, {
        color: this.currentColor,
      });
      this.selectShape(textNode);
    }
  }

  selectShape(shape: Konva.Shape): void {
    this.selectedShape = this.drawingService.selectShape(shape, this.transformers[this.currentPageIndex]);
    this.currentTool = 'select';
  }

  deleteSelected(): void {
    this.drawingService.deleteSelected(this.selectedShape, this.transformers[this.currentPageIndex], this.layers[this.currentPageIndex]);
    this.selectedShape = null;
  }

  deleteSelectedImage(): void {
    if (this.selectedShape instanceof Konva.Image) {
      this.drawingService.deleteSelectedImage(this.selectedShape, this.transformers[this.currentPageIndex], this.layers[this.currentPageIndex]);
      this.selectedShape = null;
    }
  }

  clearCanvas(): void {
    this.drawingService.clearCanvas(this.layers[this.currentPageIndex], this.transformers[this.currentPageIndex]);
    this.selectedShape = null;
  }

  exportImage(): void {
    // Exportar todas las páginas
    this.stages.forEach((stage, index) => {
      this.drawingService.exportImage(stage, this.transformers[index]);
    });
  }

  isActive(value: string, type: 'tool' | 'color' | 'stroke'): boolean {
    return this.drawingService.isActive(value, type, this.currentTool, this.currentColor, this.currentStrokeWidth);
  }
}





/* if (!data) {
      console.log('Cargando datos manualmente en el lienzo...');
    
      // Crear un rectángulo
      const rect = new Konva.Rect({
        x: 50,
        y: 50,
        width: 100,
        height: 100,
        fill: 'red',
        stroke: 'black',
        strokeWidth: 2,
      });
      layer.add(rect);
    
      // Crear un círculo
      const circle = new Konva.Circle({
        x: 200,
        y: 150,
        radius: 50,
        fill: 'blue',
        stroke: 'black',
        strokeWidth: 2,
      });
      layer.add(circle);
    
      // Crear un texto
      const text = new Konva.Text({
        x: 300,
        y: 100,
        text: 'Hola, Konva!',
        fontSize: 24,
        fontFamily: 'Calibri',
        fill: 'green',
      });
      layer.add(text);
    
      // Crear una flecha
      const arrow = new Konva.Arrow({
        points: [400, 200, 500, 250],
        pointerLength: 10,
        pointerWidth: 10,
        fill: 'yellow',
        stroke: 'black',
        strokeWidth: 2,
      });
      layer.add(arrow);
    
      // Dibujar la capa para reflejar los cambios
      layer.draw();
    } */