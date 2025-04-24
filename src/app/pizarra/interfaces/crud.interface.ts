export interface Crud {
  formCreate: HTMLElement | null;
  formEdit: HTMLElement | null;
  showRegister: HTMLElement | null;
  indexTable: HTMLElement | null;
  pageNumber: number;
}

export interface CrudValidado extends Crud {
  isValid: boolean;
  nombre: string;
} 