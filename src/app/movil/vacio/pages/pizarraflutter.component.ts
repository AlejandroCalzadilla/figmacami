import { Component } from "@angular/core";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeneradorCodeService, FlutterComponent } from '../services/generadorcode.service';

@Component({
  selector: "app-pizarraflutter",
  templateUrl: "./pizarraflutter.component.html",
  styleUrls: ["./pizarraflutter.component.css"],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class PizarraFlutterManualComponent {
  // Lista de componentes agregados al canvas
  components: FlutterComponent[] = [];
  // Componente actualmente seleccionado para edición
  selectedComponent: FlutterComponent | null = null;
  // Estado para mostrar/ocultar el panel de código
  showCode = false;
  // Código Dart generado a partir de la estructura visual
  generatedCode = '';
  // Tipo de componente que se está arrastrando (drag & drop)
  draggedComponent: string | null = null;
  // Elemento padre donde se va a soltar el componente
  dropTarget: FlutterComponent | null = null;

  constructor(private generadorCodeService: GeneradorCodeService) {
    // Inicializa el canvas con algunos componentes de ejemplo
    this.addComponent('Text');
    this.addComponent('ElevatedButton');
    this.generateCode();
  }

  /**
   * Inicia el arrastre de un componente desde la barra lateral
   * @param event Evento de drag
   * @param componentType Tipo de componente a arrastrar
   */
  dragStart(event: DragEvent, componentType: string) {
    this.draggedComponent = componentType;
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', componentType);
    }
  }

  /**
   * Permite el arrastre sobre la zona de drop
   */
  onDragOver(event: DragEvent, parentComponent?: FlutterComponent) {
    event.preventDefault();
    event.stopPropagation();
    (event.target as HTMLElement).classList.add('drag-over');
    this.dropTarget = parentComponent || null;
  }

  /**
   * Quita el estilo de arrastre al salir de la zona de drop
   */
  onDragLeave(event: DragEvent) {
    event.stopPropagation();
    (event.target as HTMLElement).classList.remove('drag-over');
  }

  /**
   * Maneja el drop de un componente en el canvas principal
   */
  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    (event.target as HTMLElement).classList.remove('drag-over');
    
    if (this.draggedComponent) {
      this.addComponent(this.draggedComponent);
      this.draggedComponent = null;
      this.dropTarget = null;
    }
  }

  /**
   * Maneja el drop de un componente dentro de un layout (Column/Row) o Container
   */
  onDropInLayout(event: DragEvent, parentComponent: FlutterComponent) {
    event.preventDefault();
    event.stopPropagation();
    (event.target as HTMLElement).classList.remove('drag-over');
    if (!this.draggedComponent) return;
    if (parentComponent.type === 'Column' || parentComponent.type === 'Row') {
      this.addComponentToParent(this.draggedComponent, parentComponent);
    } else if (parentComponent.type === 'Container' && !parentComponent.child) {
      const id = Date.now() + Math.random();
      let component: FlutterComponent = {
        id,
        type: this.draggedComponent,
        properties: {}
      };
      this.setDefaultProperties(component, this.draggedComponent);
      parentComponent.child = component;
      this.generateCode();
    }
    this.draggedComponent = null;
    this.dropTarget = null;
  }

  /**
   * Agrega un nuevo componente visual al canvas
   * @param type Tipo de componente Flutter
   */
  addComponent(type: string) {
    const id = Date.now() + Math.random();
    let component: FlutterComponent = {
      id,
      type,
      properties: {}
    };
    
    // Propiedades por defecto según el tipo
    this.setDefaultProperties(component, type);
    
    this.components.push(component);
    this.generateCode();
  }

  /**
   * Agrega un componente como hijo de otro componente (para layouts)
   */
  addComponentToParent(type: string, parent: FlutterComponent) {
    if (parent.type !== 'Column' && parent.type !== 'Row') {
      return;
    }

    const id = Date.now() + Math.random();
    let component: FlutterComponent = {
      id,
      type,
      properties: {}
    };
    
    // Propiedades por defecto según el tipo
    this.setDefaultProperties(component, type);
    
    // Inicializar children si no existe
    if (!parent.children) {
      parent.children = [];
    }
    
    parent.children.push(component);
    this.generateCode();
  }

  /**
   * Establece las propiedades por defecto de un componente
   */
  private setDefaultProperties(component: FlutterComponent, type: string) {
    switch (type) {
      case 'Text':
        component.properties = {
          text: 'Texto de ejemplo',
          fontSize: 16,
          color: '#000000',
          fontWeight: 'normal'
        };
        break;
      case 'Container':
        component.properties = {
          width: 200,
          height: 100,
          color: '#e3f2fd',
          padding: 16,
          borderRadius: 8
        };
        break;
      case 'ElevatedButton':
        component.properties = {
          text: 'Botón',
          backgroundColor: '#2196f3',
          textColor: '#ffffff'
        };
        break;
      case 'Image':
        component.properties = {
          src: '',
          width: 150,
          height: 100
        };
        break;
      case 'TextField':
        component.properties = {
          placeholder: 'Ingresa texto aquí...'
        };
        break;
      case 'Column':
        component.children = [];
        component.properties = {
          mainAxisAlignment: 'start',
          crossAxisAlignment: 'center'
        };
        break;
      case 'Row':
        component.children = [];
        component.properties = {
          mainAxisAlignment: 'start',
          crossAxisAlignment: 'center'
        };
        break;
    }
  }

  /**
   * Selecciona un componente para mostrar sus propiedades
   */
  selectComponent(component: FlutterComponent, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.selectedComponent = component;
  }

  /**
   * Elimina un componente del canvas o de un layout padre
   */
  deleteComponent(id: number, parentComponent?: FlutterComponent) {
    if (parentComponent && parentComponent.children) {
      // Eliminar de un layout padre
      parentComponent.children = parentComponent.children.filter(c => c.id !== id);
    } else {
      // Eliminar del canvas principal
      this.components = this.components.filter(c => c.id !== id);
      // También buscar en todos los children de los componentes
      this.removeFromAllChildren(id, this.components);
    }
    
    if (this.selectedComponent && this.selectedComponent.id === id) {
      this.selectedComponent = null;
    }
    this.generateCode();
  }

  /**
   * Busca y elimina un componente de todos los children recursivamente
   */
  private removeFromAllChildren(id: number, components: FlutterComponent[]) {
    components.forEach(component => {
      if (component.children) {
        component.children = component.children.filter(c => c.id !== id);
        this.removeFromAllChildren(id, component.children);
      }
    });
  }

  /**
   * Encuentra un componente por ID en toda la estructura
   */
  findComponentById(id: number, components: FlutterComponent[] = this.components): FlutterComponent | null {
    for (const component of components) {
      if (component.id === id) {
        return component;
      }
      if (component.children) {
        const found = this.findComponentById(id, component.children);
        if (found) return found;
      }
    }
    return null;
  }

   getFlexAlignment(alignment: string): string {
    switch (alignment) {
      case 'start': return 'flex-start';
      case 'center': return 'center';
      case 'end': return 'flex-end';
      case 'spaceAround': return 'space-around';
      case 'spaceBetween': return 'space-between';
      case 'spaceEvenly': return 'space-evenly';
      case 'stretch': return 'stretch';
      default: return 'flex-start';
    }
  }

  /**
   * Verifica si un componente puede recibir children
   */
  canReceiveChildren(component: FlutterComponent): boolean {
    // Column y Row pueden tener varios hijos, Container solo uno
    return component.type === 'Column' || component.type === 'Row' || component.type === 'Container';
  }

  /**
   * Verifica si un Container ya tiene hijo
   */
  canAddChildToContainer(container: FlutterComponent): boolean {
    return container.type === 'Container' && !container.child;
  } 
 



  clearCanvas() {
    this.components = [];
    this.selectedComponent = null;
    this.generateCode();
  }

  toggleCode() {
    this.showCode = !this.showCode;
    if (this.showCode) {
      this.generateCode();
    }
  }

  generateCode() {
    this.generatedCode = this.generadorCodeService.generateCode(this.components);
  }

  trackById(index: number, item: FlutterComponent) {
    return item.id;
  }

  exportCode() {
    this.generateCode();
    const blob = new Blob([this.generatedCode], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flutter_widget.dart';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  /**
   * Traduce alineaciones de Flutter a CSS flexbox
   */
  
}