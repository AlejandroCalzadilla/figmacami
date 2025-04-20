import { User } from "../../auth/login/interfaces/User";
import { ProyectoToUser } from "./proyectotouser";

export enum TipoProyecto {
    BOCETO = 'boceto',
    FIGMA = 'figma'
}
export interface Proyecto {
    id: string;
    title: string;
    description: string;
    created: string
    updated: string
    tipo: TipoProyecto;
    userid: string;
    data: string;
    sala: string;


}
