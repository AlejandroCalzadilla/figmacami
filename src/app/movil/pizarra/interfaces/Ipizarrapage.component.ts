export interface IpizarrapageComponent {


    /**
     *  metodo para guardar el contenido de la pizarra
     *  usa la funcion privada GuardarDiagrama para guardar el diagrama
     *  en el servidor y luego actualiza el estado del componente
     */
     botonguardar(): void;
}