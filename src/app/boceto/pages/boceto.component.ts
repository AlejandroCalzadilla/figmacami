import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, ElementRef, HostListener, ViewChild, inject } from '@angular/core';
import Konva from 'konva';
import { DrawingService } from '../services/drawing.service';

@Component({
    selector: 'app-boceto',
    templateUrl:'./boceto.component.html',
    
    imports: [
      CommonModule
    ],
})
export class BocetoComponent implements AfterViewInit {
  @ViewChild('konvaContainer') konvaContainer!: ElementRef;
  
  // Propiedades de Konva
  stage!: Konva.Stage;
  layer!: Konva.Layer;
  transformer!: Konva.Transformer;
  
  // Estado de la aplicación
  currentTool: string = 'select';
  currentColor: string = '#3B82F6'; // Azul predeterminado
  currentStrokeWidth: number = 3;
  isDrawing: boolean = false;
  currentLine: Konva.Line | null = null;
  selectedShape: Konva.Shape | null = null;

  drawingService=inject(DrawingService)
  
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
    // Crear el stage de Konva
    this.stage = new Konva.Stage({
      container: this.konvaContainer.nativeElement,
      width: this.konvaContainer.nativeElement.offsetWidth,
      height: this.konvaContainer.nativeElement.offsetHeight,
    });

    // Crear la capa principal
    this.layer = new Konva.Layer();
    this.stage.add(this.layer);

    // Crear el transformador para redimensionar/rotar formas
    this.transformer = new Konva.Transformer({
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
    this.layer.add(this.transformer);

    // Configurar los eventos del stage
    this.setupStageEvents();
  }

  @HostListener('window:resize')
  onResize(): void {
    if (this.stage) {
      this.stage.width(this.konvaContainer.nativeElement.offsetWidth);
      this.stage.height(this.konvaContainer.nativeElement.offsetHeight);
      this.stage.draw();
    }
  }

  setupStageEvents(): void {
    // Selección de formas
    this.stage.on('click tap', (e) => {
      // Si estamos usando una herramienta que no es "select", ignoramos el evento
      if (this.currentTool !== 'select') {
        return;
      }

      // Verificar si hicimos clic en el stage vacío
      if (e.target === this.stage) {
        this.transformer.nodes([]);
        this.selectedShape = null;
        return;
      }

      // Verificar si hicimos clic en una forma
      const clickedOnTransformer = e.target.getParent()?.className === 'Transformer';
      if (clickedOnTransformer) {
        return;
      }

      // Verificar si la forma es seleccionable
      if (e.target.hasName('shape')) {
        if (e.target instanceof Konva.Shape) {
          this.selectedShape = e.target;
        } else {
          this.selectedShape = null;
        }
        this.transformer.nodes([e.target]);
      } else {
        this.transformer.nodes([]);
        this.selectedShape = null;
      }
    });

    // Eventos para el dibujo a mano alzada
    this.stage.on('mousedown touchstart', (e) => {
      if (this.currentTool !== 'pencil') {
        return;
      }

      this.isDrawing = true;
      const pos = this.stage.getPointerPosition();
      if (pos) {
        this.currentLine = new Konva.Line({
          points: [pos.x, pos.y],
          stroke: this.currentColor,
          strokeWidth: this.currentStrokeWidth,
          lineCap: 'round',
          lineJoin: 'round',
          name: 'shape', // Para poder seleccionarlo después
          draggable: true,
        });
        this.layer.add(this.currentLine);
      }
    });

    this.stage.on('mousemove touchmove', (e) => {
      if (!this.isDrawing || this.currentTool !== 'pencil') {
        return;
      }

      e.evt.preventDefault();
      const pos = this.stage.getPointerPosition();
      if (pos && this.currentLine) {
        const newPoints = this.currentLine.points().concat([pos.x, pos.y]);
        this.currentLine.points(newPoints);
        this.layer.batchDraw();
      }
    });

    this.stage.on('mouseup touchend', () => {
      if (this.currentTool === 'pencil') {
        this.isDrawing = false;
      }
    });
  }

  selectTool(tool: string): void {
    this.currentTool = tool;
    
    // Desactivar el transformador si cambiamos de herramienta
    if (tool !== 'select') {
      this.transformer.nodes([]);
      this.selectedShape = null;
    }
    
    // Cambiar el cursor del stage según la herramienta
    switch (tool) {
      case 'select':
        this.stage.container().style.cursor = 'default';
        break;
      case 'pencil':
        this.stage.container().style.cursor = 'crosshair';
        break;
      default:
        this.stage.container().style.cursor = 'pointer';
    }
  }

  selectColor(color: string): void {
    this.currentColor = color;
    
    // Si hay una forma seleccionada, cambiar su color
    if (this.selectedShape) {
      this.selectedShape.stroke(color);
      if (this.selectedShape.getClassName() !== 'Line' && 
          this.selectedShape.getClassName() !== 'Arrow') {
        // Para formas como círculos y rectángulos, actualizamos el relleno también
        if (this.selectedShape.fill() !== 'transparent') {
          this.selectedShape.fill(color);
        }
      }
      this.layer.batchDraw();
    }
  }

  selectStrokeWidth(width: number): void {
    this.currentStrokeWidth = width;
    
    // Si hay una forma seleccionada, cambiar su grosor
    if (this.selectedShape) {
      this.selectedShape.strokeWidth(width);
      this.layer.batchDraw();
    }
  }



  addRectangle(): void {
    const rect = this.drawingService.createRectangle(this.stage, this.layer, {
      color: this.currentColor,
      strokeWidth: this.currentStrokeWidth,
    });
    this.selectShape(rect);
  }

  addCircle(): void {
    const circle = this.drawingService.createCircle(this.stage, this.layer, {
      color: this.currentColor,
      strokeWidth: this.currentStrokeWidth,
    });
    this.selectShape(circle);
  }

  addArrow(): void {
    const arrow = this.drawingService.createArrow(this.stage, this.layer, {
      color: this.currentColor,
      strokeWidth: this.currentStrokeWidth,
    });
    this.selectShape(arrow);
  }

  addText(): void {
    const textNode = this.drawingService.createText(this.stage, this.layer, {
      color: this.currentColor,
    });
    this.selectShape(textNode);
  }

  selectShape(shape: Konva.Shape): void {
    this.transformer.nodes([shape]);
    this.selectedShape = shape;
    this.currentTool = 'select';
  }

  


  deleteSelected(): void {
    if (this.selectedShape) {
      this.selectedShape.destroy();
      this.transformer.nodes([]);
      this.selectedShape = null;
      this.layer.draw();
    }
  }

  clearCanvas(): void {
    if (confirm('¿Estás seguro de que quieres borrar todo el lienzo?')) {
      // Eliminar todas las formas excepto el transformador
      this.layer.destroyChildren();
      this.layer.add(this.transformer);
      this.transformer.nodes([]);
      this.selectedShape = null;
      this.layer.draw();
    }
  }
  exportImage(): void {
    // Ocultar el transformador temporalmente
    this.transformer.visible(false);
    this.layer.draw();
    
    // Generar imagen del canvas
    const dataURL = this.stage.toDataURL({ pixelRatio: 2 });
    
    // Mostrar el transformador de nuevo
    this.transformer.visible(true);
    this.layer.draw();
    
    // Crear enlace para descarga
    const link = document.createElement('a');
    link.download = 'dibujo-konva.png';
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  isActive(value: string, type: 'tool' | 'color' | 'stroke'): boolean {
    if (type === 'tool') return this.currentTool === value;
    if (type === 'color') return this.currentColor === value;
    if (type === 'stroke') return this.currentStrokeWidth === +value;
    return false;
  }
}









/* addRectangle(): void {
    const rect = new Konva.Rect({
      x: this.stage.width() / 2 - 50,
      y: this.stage.height() / 2 - 30,
      width: 100,
      height: 60,
      stroke: this.currentColor,
      strokeWidth: this.currentStrokeWidth,
      fill: 'transparent',
      name: 'shape',
      draggable: true,
    });
    
    this.layer.add(rect);
    this.layer.draw();
    
    // Seleccionar el rectángulo recién creado
    this.transformer.nodes([rect]);
    this.selectedShape = rect;
    this.selectTool('select');
  }

  addCircle(): void {
    const circle = new Konva.Circle({
      x: this.stage.width() / 2,
      y: this.stage.height() / 2,
      radius: 30,
      stroke: this.currentColor,
      strokeWidth: this.currentStrokeWidth,
      fill: 'transparent',
      name: 'shape',
      draggable: true,
    });

    this.layer.add(circle);
    this.layer.draw();    
    // Seleccionar el círculo recién creado
    this.transformer.nodes([circle]);
    this.selectedShape = circle;
    this.selectTool('select');

  }

  addArrow(): void {
    const arrowLength = 100;
    const startX = this.stage.width() / 2 - arrowLength / 2;
    const startY = this.stage.height() / 2;
    
    const arrow = new Konva.Arrow({
      points: [startX, startY, startX + arrowLength, startY],
      pointerLength: 10,
      pointerWidth: 10,
      stroke: this.currentColor,
      strokeWidth: this.currentStrokeWidth,
      fill: this.currentColor,
      name: 'shape',
      draggable: true,
    });
    
    this.layer.add(arrow);
    this.layer.draw();
    
    // Seleccionar la flecha recién creada
    this.transformer.nodes([arrow]);
    this.selectedShape = arrow;
    this.selectTool('select');
  }

  addText(): void {
    const textNode = new Konva.Text({
      x: this.stage.width() / 2 - 50,
      y: this.stage.height() / 2,
      text: 'Escribe aquí',
      fontSize: 20,
      fontFamily: 'Arial',
      fill: this.currentColor,
      name: 'shape',
      draggable: true,
    });
    
    this.layer.add(textNode);
    this.layer.draw();
    
    // Hacer el texto editable con doble clic
    textNode.on('dblclick', () => {
      // Crear un textarea HTML sobre el texto de Konva
      const textPosition = textNode.absolutePosition();
      
      const textarea = document.createElement('textarea');
      document.body.appendChild(textarea);
      
      textarea.value = textNode.text();
      textarea.style.position = 'absolute';
      textarea.style.top = textPosition.y + 'px';
      textarea.style.left = textPosition.x + 'px';
      textarea.style.width = textNode.width() + 'px';
      textarea.style.height = textNode.height() + 'px';
      textarea.style.fontSize = textNode.fontSize() + 'px';
      textarea.style.border = '1px solid #ccc';
      textarea.style.padding = '0px';
      textarea.style.margin = '0px';
      textarea.style.overflow = 'hidden';
      textarea.style.outline = 'none';
      textarea.style.resize = 'none';
      textarea.style.lineHeight = textNode.lineHeight().toString();
      textarea.style.fontFamily = textNode.fontFamily();
      textarea.style.transformOrigin = 'left top';
      textarea.style.textAlign = textNode.align();
      //textarea.style.color = textNode.fill();

      textarea.focus();
      
      function removeTextarea(this: any) {
        document.body.removeChild(textarea);
        window.removeEventListener('click', handleOutsideClick);
        textNode.show();
        this.transformer.show();
        this.transformer.forceUpdate();
        this.layer.draw();
      }
      
      function handleOutsideClick(this: any, e: any) {
        if (e.target !== textarea) {
          textNode.text(textarea.value);
          removeTextarea.call(this);
        }
      }
      
      textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          textNode.text(textarea.value);
          removeTextarea.call(this);
        }
        if (e.key === 'Escape') {
          removeTextarea.call(this);
        }
      });
      
      textarea.addEventListener('blur', () => {
        textNode.text(textarea.value);
        removeTextarea.call(this);
      });
      
      window.addEventListener('click', handleOutsideClick.bind(this));
      
      textNode.hide();
      this.transformer.hide();
      this.layer.draw();
    });
    
    // Seleccionar el texto recién creado
    this.transformer.nodes([textNode]);
    this.selectedShape = textNode;
    this.selectTool('select');
  }

  
  } */