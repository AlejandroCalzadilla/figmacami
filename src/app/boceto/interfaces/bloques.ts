// Interfaz base para los atributos comunes de los nodos
export interface KonvaNodeAttrs {
    x: number;
    y: number;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
  }
  
  // Interfaz para un rectángulo
 export interface KonvaRectAttrs extends KonvaNodeAttrs {
    width: number;
    height: number;
  }
  
  // Interfaz para un círculo
export  interface KonvaCircleAttrs extends KonvaNodeAttrs {
    radius: number;
  }
  
  // Interfaz para una flecha
export  interface KonvaArrowAttrs extends KonvaNodeAttrs {
    points: number[];
    pointerLength?: number;
    pointerWidth?: number;
  }
  
  // Interfaz genérica para un nodo de Konva
export  interface KonvaNode {
    attrs: KonvaNodeAttrs | KonvaRectAttrs | KonvaCircleAttrs | KonvaArrowAttrs;
    className: 'Rect' | 'Circle' | 'Arrow' | 'Text';
  }