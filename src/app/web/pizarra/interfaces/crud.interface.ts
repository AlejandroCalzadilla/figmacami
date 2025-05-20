export interface Crud {
  formCreate: { html: string; css: string } | null;
  formEdit: { html: string; css: string } | null;
  showRegister: { html: string; css: string } | null;
  indexTable: { html: string; css: string } | null;
  pageNumber: number;
}

export interface CrudValidado extends Crud {
  isValid: boolean;
  nombre: string;
} 