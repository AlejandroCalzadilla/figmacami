import { Injectable } from '@angular/core';
import Konva from 'konva';

@Injectable({
    providedIn: 'root',
})
export class DrawingService {
    private transformer!: Konva.Transformer;
    private currentTextarea: HTMLTextAreaElement | null = null;
    private currentTextNode: Konva.Text | null = null;
    private currentLayer: Konva.Layer | null = null;
    private outsideClickHandler: ((e: Event) => void) | null = null;

    // Método para limpiar cualquier textarea activo
    cleanupTextarea(): void {
        if (this.currentTextarea && document.body.contains(this.currentTextarea)) {
            try {
                document.body.removeChild(this.currentTextarea);
            } catch (e) {
                console.warn('Error al eliminar textarea:', e);
            }
        }
        
        if (this.outsideClickHandler) {
            window.removeEventListener('click', this.outsideClickHandler);
            this.outsideClickHandler = null;
        }
        
        if (this.currentTextNode && this.currentLayer) {
            this.currentTextNode.show();
            this.currentLayer.draw();
        }
        
        this.currentTextarea = null;
        this.currentTextNode = null;
        this.currentLayer = null;
    }


    setupStageEvents(
        stage: Konva.Stage,
        layer: Konva.Layer,
        transformer: Konva.Transformer,
        getTool: () => string,
        getColor: () => string,
        getStrokeWidth: () => number,
        setSelectedShape: (shape: Konva.Shape | Konva.Image | null) => void,
        getSelectedShape: () => Konva.Shape | Konva.Image | null
      ): void {
        let isDrawing = false;
        let currentLine: Konva.Line | null = null;
    
        stage.on('click tap', (e) => {
          if (getTool() !== 'select') return;
    
          if (e.target === stage) {
            transformer.nodes([]);
            setSelectedShape(null);
            return;
          }
    
          const clickedOnTransformer = e.target.getParent()?.className === 'Transformer';
          if (clickedOnTransformer) return;
    
          if (e.target instanceof Konva.Shape || e.target instanceof Konva.Image) {
            setSelectedShape(e.target);
            transformer.nodes([e.target]);
          } else {
            transformer.nodes([]);
            setSelectedShape(null);
          }
        });
    
        stage.on('mousedown touchstart', (e) => {
          if (getTool() !== 'pencil') return;
    
          isDrawing = true;
          const pos = stage.getPointerPosition();
          if (pos) {
            currentLine = new Konva.Line({
              points: [pos.x, pos.y],
              stroke: getColor(),
              strokeWidth: getStrokeWidth(),
              lineCap: 'round',
              lineJoin: 'round',
              name: 'shape',
              draggable: true,
            });
            layer.add(currentLine);
          }
        });
    
        stage.on('mousemove touchmove', (e) => {
          if (!isDrawing || getTool() !== 'pencil') return;
    
          e.evt.preventDefault();
          const pos = stage.getPointerPosition();
          if (pos && currentLine) {
            const newPoints = currentLine.points().concat([pos.x, pos.y]);
            currentLine.points(newPoints);
            layer.batchDraw();
          }
        });
    
        stage.on('mouseup touchend', () => {
          if (getTool() === 'pencil') {
            isDrawing = false;
          }
        });
      }

   




    selectTool(tool: string, stage: Konva.Stage, transformer: Konva.Transformer): void {
        // Limpiar cualquier textarea activo al cambiar de herramienta
        this.cleanupTextarea();
        
        // Cambiar el cursor del stage según la herramienta
        switch (tool) {
            case 'select':
                stage.container().style.cursor = 'default';
                break;
            case 'pencil':
                stage.container().style.cursor = 'crosshair';
                break;
            default:
                stage.container().style.cursor = 'pointer';
        }

        // Desactivar el transformador si cambiamos de herramienta
        if (tool !== 'select') {
            transformer.nodes([]);
        }
    }

    selectColor(color: string, selectedShape: Konva.Shape | null, layer: Konva.Layer): void {
        if (selectedShape) {
            selectedShape.stroke(color);

            // Si no es una línea o flecha, actualizamos el relleno también
            if (selectedShape.getClassName() !== 'Line' && selectedShape.getClassName() !== 'Arrow') {
                if (selectedShape.fill() !== 'transparent') {
                    selectedShape.fill(color);
                }
            }

            layer.batchDraw();
        }
    }

    setTransformer(transformer: Konva.Transformer): void {
        // Limpiar cualquier textarea activo al cambiar de transformador
        this.cleanupTextarea();
        this.transformer = transformer;
    }

    createRectangle(stage: Konva.Stage, layer: Konva.Layer, options: { color: string; strokeWidth: number }): Konva.Rect {
        const rect = new Konva.Rect({
            x: stage.width() / 2 - 50,
            y: stage.height() / 2 - 30,
            width: 200,
            height: 40,
            stroke: options.color,
            strokeWidth: options.strokeWidth,
            fill: 'transparent',
            name: 'shape',
            draggable: true,
        });

        layer.add(rect);
        layer.draw();
        return rect;
    }

    createCircle(stage: Konva.Stage, layer: Konva.Layer, options: { color: string; strokeWidth: number }): Konva.Circle {
        const circle = new Konva.Circle({
            x: stage.width() / 2,
            y: stage.height() / 2,
            radius: 30,
            stroke: options.color,
            strokeWidth: options.strokeWidth,
            fill: 'transparent',
            name: 'shape',
            draggable: true,
        });

        layer.add(circle);
        layer.draw();
        return circle;
    }

    createArrow(stage: Konva.Stage, layer: Konva.Layer, options: { color: string; strokeWidth: number }): Konva.Arrow {
        const arrowLength = 100;
        const startX = stage.width() / 2 - arrowLength / 2;
        const startY = stage.height() / 2;

        const arrow = new Konva.Arrow({
            points: [startX, startY, startX + arrowLength, startY],
            pointerLength: 10,
            pointerWidth: 10,
            stroke: options.color,
            strokeWidth: options.strokeWidth,
            fill: options.color,
            name: 'shape',
            draggable: true,
        });

        layer.add(arrow);
        layer.draw();
        return arrow;
    }

    createText(stage: Konva.Stage, layer: Konva.Layer, options: { color: string }): Konva.Text {
        // Limpiar cualquier textarea activo antes de crear uno nuevo
        this.cleanupTextarea();
        
        const textNode = new Konva.Text({
            x: stage.width() / 2 - 50,
            y: stage.height() / 2,
            text: 'text',
            fontSize: 20,
            fontFamily: 'Arial',
            fill: options.color,
            name: 'shape',
            draggable: true,
        });

        layer.add(textNode);
        layer.draw();

        textNode.on('dblclick dbltap', () => {
            // Limpiar cualquier textarea activo antes de crear uno nuevo
            this.cleanupTextarea();
            
            const textPosition = textNode.absolutePosition();
            const containerRect = stage.container().getBoundingClientRect();

            const textarea = document.createElement('textarea');
            document.body.appendChild(textarea);
            textarea.value = textNode.text();
            textarea.style.position = 'absolute';
            textarea.style.top = `${containerRect.top + textPosition.y}px`;
            textarea.style.left = `${containerRect.left + textPosition.x}px`;
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
            textarea.style.background = 'none';
            textarea.focus();

            // Guardar referencias para limpieza posterior
            this.currentTextarea = textarea;
            this.currentTextNode = textNode;
            this.currentLayer = layer;

            const removeTextarea = () => {
                if (document.body.contains(textarea)) {
                    document.body.removeChild(textarea);
                }
                textNode.show();
                layer.draw();
                
                // Limpiar referencias
                this.currentTextarea = null;
                this.currentTextNode = null;
                this.currentLayer = null;
            };

            const handleOutsideClick = (e: Event) => {
                if (e.target !== textarea) {
                    textNode.text(textarea.value);
                    removeTextarea();
                }
            };

            // Guardar referencia al handler para poder eliminarlo después
            this.outsideClickHandler = handleOutsideClick;

            textarea.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    textNode.text(textarea.value);
                    removeTextarea();
                    e.preventDefault();
                }
                if (e.key === 'Escape') {
                    removeTextarea();
                }
            });

            textarea.addEventListener('blur', () => {
                textNode.text(textarea.value);
                removeTextarea();
            });

            // Evita que el primer click dispare el cierre
            setTimeout(() => {
                window.addEventListener('click', handleOutsideClick);
            });

            textNode.hide();
            layer.draw();
        });

        return textNode;
    }

    selectShape(shape: Konva.Shape | Konva.Image, transformer: Konva.Transformer){
        //console.log('Seleccionando forma:', shape);
        transformer.nodes([shape]);  
        return shape;
    }

    deleteSelected(selectedShape: Konva.Shape | Konva.Image |   null, transformer: Konva.Transformer, layer: Konva.Layer): void {
        if (selectedShape) {
            selectedShape.destroy();
            transformer.nodes([]);
            layer.draw();
        }
    }

    deleteSelectedImage(selectedImage: Konva.Image | null, transformer: Konva.Transformer, layer: Konva.Layer): void {
        if (selectedImage && selectedImage instanceof Konva.Image) {
          selectedImage.destroy(); // Eliminar la imagen del lienzo
          transformer.nodes([]); // Limpiar el transformador
          layer.draw(); // Redibujar la capa
        }
    }

    clearCanvas(layer: Konva.Layer, transformer: Konva.Transformer): void {
        if (confirm('¿Estás seguro de que quieres borrar todo el lienzo?')) {
            layer.destroyChildren();
            layer.add(transformer);
            transformer.nodes([]);
            layer.draw();
        }
    }

    exportImage(stage: Konva.Stage, transformer: Konva.Transformer): void {
        // Ocultar el transformador temporalmente
        transformer.visible(false);
        stage.draw();
        // Generar imagen del canvas
        const dataURL = stage.toDataURL({ pixelRatio: 2 });
        // Mostrar el transformador de nuevo
        transformer.visible(true);
        stage.draw();
        // Crear enlace para descarga
        const link = document.createElement('a');
        link.download = 'dibujo-konva.png';
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    importImageToCanvas(stage: Konva.Stage, layer: Konva.Layer, imageFile: File) {
        const reader = new FileReader();
        let konvaImage: Konva.Image | undefined; // Crear una nueva instancia de Konva.Image
        console.log('Importando imagen...');
        const numeroramdom= Math.floor(Math.random() * 1000); // Generar un número aleatorio para el nombre de la imagen
        reader.onload = () => {
            const img = new window.Image();
            img.src = reader.result as string;
            console.log('reader.result', img.src);
            img.onload = () => {
                const defaultWidth = 600; // Ancho por defecto
                const defaultHeight = 400; // Alto por defecto

                 konvaImage = new Konva.Image({
                    image: img,
                    x: stage.width() / 2 - defaultWidth / 2, // Centrar horizontalmente
                    y: stage.height() / 2 - defaultHeight / 2, // Centrar verticalmente
                    width: defaultWidth, // Establecer ancho por defecto
                    height: defaultHeight, // Establecer alto por defecto
                    draggable: true,
                    name: `pimported-image ${numeroramdom}`, // Nombre único para la imagen importada
                });
               
                
                layer.add(konvaImage);
                layer.draw();
                console.log('layer', layer);
            };
        }; 
        reader.readAsDataURL(imageFile);// Retorna la imagen de Konva creada
    }

    isActive(value: string, type: 'tool' | 'color' | 'stroke', currentTool: string, currentColor: string, currentStrokeWidth: number): boolean {
        if (type === 'tool') return currentTool === value;
        if (type === 'color') return currentColor === value;
        if (type === 'stroke') return currentStrokeWidth === +value;
        return false;
    }

    enableDoubleClickEdit(stage: Konva.Stage) {
        stage.on('dblclick dbltap', (e) => {
          const target = e.target;
          if (!target || target === stage) return;
      
          const modal = document.getElementById('dimensionModal') as HTMLDivElement;
          const inputWidth = document.getElementById('inputWidth') as HTMLInputElement;
          const inputHeight = document.getElementById('inputHeight') as HTMLInputElement;
          const btnSave = document.getElementById('saveDims') as HTMLButtonElement;
          const btnCancel = document.getElementById('cancelDims') as HTMLButtonElement;
          const btnDelete = document.getElementById('deleteDims') as HTMLButtonElement; // Botón para eliminar
      
          // Mostrar valores actuales
          inputWidth.value = target.width()?.toString() || '100';
          inputHeight.value = target.height()?.toString() || '100';
      
          modal.style.display = 'block';
      
          const saveHandler = () => {
            let newWidth = parseFloat(inputWidth.value);
            let newHeight = parseFloat(inputHeight.value);
      
            // Limitar las dimensiones
            const maxWidth = 1200;
            const maxHeight = 550;
            const minSize = 10; // Tamaño mínimo permitido
      
            newWidth = Math.max(minSize, Math.min(newWidth, maxWidth));
            newHeight = Math.max(minSize, Math.min(newHeight, maxHeight));
      
            target.width(newWidth);
            target.height(newHeight);
            target.getLayer()?.draw();
            closeModal();
          };
       
           console.log('Elemento seleccionado:', target);
          console.log('Tipo de elemento:', target.getClassName());
          console.log("transformador",this.transformer.nodes()); 
          const deleteHandler = () => {
            target.destroy(); // Eliminar el elemento
            target.getLayer()?.draw(); // Redibujar la capa
            closeModal();
          };
      
          const cancelHandler = () => {
            closeModal();
          };
      
          const closeModal = () => {
            modal.style.display = 'none';
            btnSave.removeEventListener('click', saveHandler);
            btnCancel.removeEventListener('click', cancelHandler);
            btnDelete.removeEventListener('click', deleteHandler);
          };
      
          btnSave.addEventListener('click', saveHandler);
          btnCancel.addEventListener('click', cancelHandler);
          btnDelete.addEventListener('click', deleteHandler); // Agregar evento al botón de eliminar
        });
      }
}