import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, ElementRef, HostListener, ViewChild, inject } from '@angular/core';
import Konva from 'konva';
import { DrawingService } from '../services/drawing.service';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-boceto',
  templateUrl: './boceto.component.html',
  imports: [
    CommonModule
  ],
})
export class BocetoComponent implements AfterViewInit {
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
  
  ngAfterViewInit(): void {
    this.initKonva();
  }

  initKonva(): void {
    this.createNewPage();   // Crear el stage de Konva para la primera página
  }

  createNewPage(): void {
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

    // Crear el transformador para redimensionar/rotar formas
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
    
    // Agregar a los arrays
    this.stages.push(stage);
    this.layers.push(layer);
    this.transformers.push(transformer);
    
    // Configurar los eventos del stage
    this.setupStageEvents(stage, layer, transformer);
    
    // Actualizar el nombre de la página
    this.pageNames.push(`Página ${this.pageCount + 1}`);

    // Si es la primera página, mostrarla directamente
    if (this.pageCount === 0) {
      pageContainer.style.display = 'block';
      stage.draw();
      this.drawingService.setTransformer(transformer);
      this.drawingService.enableDoubleClickEdit(stage);
    } else {
      // Si no es la primera página, cambiar a ella
      this.currentPageIndex = this.pageCount;
      this.showCurrentPage();
    }

    // Incrementar el contador de páginas después de la comparación
    this.pageCount++;
    
    // Forzar la detección de cambios después de actualizar pageCount
    setTimeout(() => {
      this.cdr.detectChanges();
    });
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