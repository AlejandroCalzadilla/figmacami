export interface GeneratedComponent {
    html: string;
    css: string;
    ts: string;
    service?:string; 
    interface?:string;
    nombre: string;
    nombreClaseComponent: string;
    ruta: { path: string; component: string };
    links?: string[];
    nombre_archivo_ts: string;
    nombre_archivo_css: string;
    nombre_archivo_html: string;
    nombre_Clase_Service:string;

    nombre_archivo_service:string;
    nombre_archivo_interface?:string;
    componente:boolean
    ruta_componente:string;

    form?:string;
     
  }