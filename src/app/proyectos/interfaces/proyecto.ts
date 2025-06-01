import { User } from "../../auth/interfaces/User";
import { ProyectoToUser } from "./proyectotouser";

export enum TipoProyecto {
  
    FLUUTERFIGMA = 'flutterfigma',
}
export interface Proyecto {
    id?: string;
    title: string;
    description: string;
    created?: string
    updated?: string
    tipo: TipoProyecto;
    userid: string;
    data: string;
    sala: string;


}
