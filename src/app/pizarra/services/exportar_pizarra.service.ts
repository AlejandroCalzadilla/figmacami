import { inject, Injectable } from '@angular/core';
import { PageContent } from '../interfaces/pagecontent';
import { generateMenuComponent } from '../../services/componentes_export/menu_random_component';
import { generateRandomComponent } from '../../services/componentes_export/random_component';
import { addLinksToMenu, assignLinksToMenuComponent } from '../../services/componentes_export/añadir_links_menus';
import { ExportadorService } from '../../services/exportador.service';
import { GeneratedComponent } from '../interfaces/componente_angular';
import { CrudValidado } from '../interfaces/crud.interface';
import { ExportadorCrudService } from '../../services/exportador_crud.service';

interface Crud {
  formCreate: { html: string; css: string } | null;
  formEdit: { html: string; css: string } | null;
  showRegister: { html: string; css: string } | null;
  indexTable: { html: string; css: string } | null;
  pageNumber: number;
}

@Injectable({
  providedIn: 'root',
})
export class ExportarPizarraService {
  private exportadorangular = inject(ExportadorService);
  private exportadorCrud = inject(ExportadorCrudService);
  // Contadores de componentes por tipo
  formcreate: { count: number; pages: number[] } = { count: 0, pages: [] };
  formedit: { count: number; pages: number[] } = { count: 0, pages: [] };
  navbar: { count: number; pages: number[] } = { count: 0, pages: [] };
  aside: { count: number; pages: number[] } = { count: 0, pages: [] };
  showregister: { count: number; pages: number[] } = { count: 0, pages: [] };
  index_o_table: { count: number; pages: number[] } = { count: 0, pages: [] };
  pagina_nomal: { count: number; pages: number[] } = { count: 0, pages: [] };

  contenidot(contenido: PageContent[], totalpages: number): void {
    //console.log('Contenido recibido:', contenido);

    // Procesar cada página
    for (let i = 0; i < totalpages; i++) {
      const pageContent = contenido[i];
      if (pageContent) {
        this.buscarBloquesPagina(pageContent.html, pageContent.css, i + 1);
      }
    }

    // Procesar CRUDs si existen
    if (this.formcreate.count > 0 && this.formedit.count > 0 && this.showregister.count > 0 && this.index_o_table.count > 0) {
      const cruds = this.agruparYValidarCruds(contenido);
      this.procesarCruds(cruds);
    }

    // Procesar componentes no CRUD
    this.procesarComponentesNoCrud(contenido, totalpages);
  }

  private async procesarComponentesNoCrud(contenido: PageContent[], totalpages: number): Promise<void> {
    const componentes: GeneratedComponent[] = [];
     
    if (this.navbar.count === 0 && this.aside.count === 0) {
      if (this.formcreate.count === 0 && this.formedit.count === 0 && 
          this.showregister.count === 0 && this.index_o_table.count === 0) {
        const menu = generateMenuComponent();
        const links: string[] = [];

        for (let i = 0; i < totalpages; i++) {
          const pageContent = contenido[i];
          if (pageContent) {
            const componente = generateRandomComponent(pageContent.html, pageContent.css, i + 1);
            componentes.push(componente);
            links.push(componente.nombre);
          }
        }

        addLinksToMenu(menu, links);
        const linksfinal = assignLinksToMenuComponent(menu.ts, links);
        menu.ts = linksfinal;
        componentes.push(menu);
      }
      if(this.formcreate.count > 0 && this.formedit.count > 0 && this.showregister.count > 0 && this.index_o_table.count > 0){
        const cruds = this.agruparYValidarCruds(contenido);
        const componentescrud=await this.procesarCruds(cruds);
        await this.delay(8000);
       
        componentes.push(...componentescrud);
        //await this.delay(8000);
      }
    }
    console.log("componentes antes de enviar al otro service",componentes);
    this.exportarComponentes(componentes);
  }


  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  private async procesarCruds(cruds: CrudValidado[]): Promise<GeneratedComponent[]> {
    const promesas = cruds.map(async (crud) => {
     // console.log('Procesando CRUD:', crud);
      return await this.exportadorCrud.generarComponentesCrud(crud);
    });
    
    const resultados = await Promise.all(promesas);
    return resultados.flat();
  }

  private exportarComponentes(componentes: GeneratedComponent[]): void {
    this.exportadorangular.generateProject(componentes);
  }

  private agruparYValidarCruds(contenido: PageContent[]): CrudValidado[] {
    const cruds: Crud[] = [];
    const crudsParciales: { [key: string]: Partial<Crud> } = {};

    contenido.forEach((pageContent, index) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(pageContent.html, 'text/html');
      const css = pageContent.css;

      // Buscar elementos del CRUD en la página actual
      const formCreate = this.buscarFormCreate(doc, css, index + 1);
      const formEdit = this.buscarFormEdit(doc, css, index + 1);
      const showRegister = this.buscarVistaRegistro(doc, css, index + 1);
      const indexTable = this.buscarVistaRegistros(doc, css, index + 1);

      // Agrupar elementos encontrados
      if (formCreate) {
        crudsParciales['formCreate'] = { ...crudsParciales['formCreate'], formCreate, pageNumber: index + 1 };
      }
      if (formEdit) {
        crudsParciales['formEdit'] = { ...crudsParciales['formEdit'], formEdit, pageNumber: index + 1 };
      }
      if (showRegister) {
        crudsParciales['showRegister'] = { ...crudsParciales['showRegister'], showRegister, pageNumber: index + 1 };
      }
      if (indexTable) {
        crudsParciales['indexTable'] = { ...crudsParciales['indexTable'], indexTable, pageNumber: index + 1 };
      }

      // Si todos los elementos del CRUD están presentes, agruparlos como un CRUD completo
      if (
        crudsParciales['formCreate'] &&
        crudsParciales['formEdit'] &&
        crudsParciales['showRegister'] &&
        crudsParciales['indexTable']
      ) {
        const crud: Crud = {
          formCreate: crudsParciales['formCreate'].formCreate!,
          formEdit: crudsParciales['formEdit'].formEdit!,
          showRegister: crudsParciales['showRegister'].showRegister!,
          indexTable: crudsParciales['indexTable'].indexTable!,
          pageNumber: index + 1,
        };

        cruds.push(crud);

        // Limpiar los elementos parciales para el siguiente CRUD
        crudsParciales['formCreate'] = {};
        crudsParciales['formEdit'] = {};
        crudsParciales['showRegister'] = {};
        crudsParciales['indexTable'] = {};
      }
    });

    // Validar cada CRUD encontrado
    return cruds.map((crud, index) => ({
      ...crud,
      isValid: this.validarCrud(crud),
      nombre: `crud_${index + 1}`,
    }));
  }

  private buscarFormCreate(doc: Document, css: string, pageNumber: number): { html: string; css: string } | null {
    const form = doc.querySelector('form');
    if (!form) return null;

    const button = Array.from(form.querySelectorAll('button')).find(
      btn => btn.textContent?.trim().toLowerCase() === 'crear'
    );

    if (!button) {
      //console.warn(`Página ${pageNumber}: Se encontró un formulario, pero no tiene un botón con el texto "crear".`);
      return null;
    }

   // console.log('form create encontrado', pageNumber);
    return { html: doc.body.innerHTML, css };
  }

  private buscarFormEdit(doc: Document, css: string, pageNumber: number): { html: string; css: string } | null {
    const form = doc.querySelector('form');
    if (!form) return null;

    const button = Array.from(form.querySelectorAll('button')).find(
      btn => btn.textContent?.trim().toLowerCase() === 'editar'
    );

    if (!button) {
    //  console.warn(`Página ${pageNumber}: Se encontró un formulario, pero no tiene un botón con el texto "editar".`);
      return null;
    }

    //console.log('form edit encontrado', pageNumber);
    return { html: doc.body.innerHTML, css };
  }

  private buscarVistaRegistro(doc: Document, css: string, pageNumber: number): { html: string; css: string } | null {
    const vistaRegistroElement = Array.from(doc.querySelectorAll('div')).find((el) => {
      const volverButton = Array.from(el.querySelectorAll('button')).find(
        (btn) => btn.textContent?.trim().toLowerCase() === 'volver'
      );
      return !!volverButton;
    });

    if (!vistaRegistroElement) {
      //console.warn(`Página ${pageNumber}: No se encontró un elemento que contenga un botón con el texto "Volver".`);
      return null;
    }

    //console.log('Vista REGISTRO encontrada en la página', pageNumber);
    return { html: doc.body.innerHTML, css };
  }

  private buscarVistaRegistros(doc: Document, css: string, pageNumber: number): { html: string; css: string } | null {
    const vistaRegistroElement = Array.from(doc.querySelectorAll('div')).find((el) => {
      const table = el.querySelector('table');
      if (!table) return false;

      const tdWithButtons = Array.from(table.querySelectorAll('td')).find((td) => {
        const buttons = Array.from(td.querySelectorAll('button'));
        const buttonTexts = buttons.map((btn) => btn.textContent?.trim().toLowerCase());
        return (
          buttonTexts.includes('ver') &&
          buttonTexts.includes('editar') &&
          buttonTexts.includes('eliminar')
        );
      });

      return !!tdWithButtons;
    });

    if (!vistaRegistroElement) {
     // console.warn(`Página ${pageNumber}: No se encontró un elemento que contenga una tabla con los botones "ver", "editar" y "borrar".`);
      return null;
    }

    //console.log('Vista de registros encontrada en la página', pageNumber);
    return { html: doc.body.innerHTML, css };
  }

  private validarCrud(crud: Crud): boolean {
    if (!crud.formCreate || !crud.formEdit || !crud.showRegister || !crud.indexTable) {
      return false;
    }

    const parser = new DOMParser();
    const createDoc = parser.parseFromString(crud.formCreate.html, 'text/html');
    const editDoc = parser.parseFromString(crud.formEdit.html, 'text/html');
    const showDoc = parser.parseFromString(crud.showRegister.html, 'text/html');
    const indexDoc = parser.parseFromString(crud.indexTable.html, 'text/html');

    const createLabels = this.extraerLabels(createDoc);
    const editLabels = this.extraerLabels(editDoc);
    const showLabels = this.extraerLabels(showDoc, 'strong');
    const tableHeaders = this.extraerLabels(indexDoc, 'th');

    return this.coincidenCampos(createLabels, editLabels) &&
           this.coincidenCampos(createLabels, showLabels) &&
           this.coincidenCampos(createLabels, tableHeaders);
  }

  private extraerLabels(doc: Document, selector: string = 'label'): string[] {
    return Array.from(doc.querySelectorAll(selector))
      .map(el => el.textContent?.trim().toLowerCase() || '')
      .filter(text => text.length > 0);
  }

  private coincidenCampos(labels1: string[], labels2: string[]): boolean {
    const intersection = labels1.filter(label => labels2.includes(label));
    return intersection.length >= Math.min(labels1.length, labels2.length) * 0.8;
  }

  private buscarBloquesPagina(htmlString: string, cssString: string, pageNumber: number): void {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    const elementos = {
      nav: doc.querySelector('nav'),
      aside: doc.querySelector('aside'),
      formCreate: this.buscarFormCreate(doc, cssString, pageNumber),
      formEdit: this.buscarFormEdit(doc, cssString, pageNumber),
      vistaRegistro: this.buscarVistaRegistro(doc, cssString, pageNumber),
      vistaRegistros: this.buscarVistaRegistros(doc, cssString, pageNumber)
    };

    let isPageCategorized = false;

    if (elementos.formCreate) {
      this.formcreate.count++;
      this.formcreate.pages.push(pageNumber);
      isPageCategorized = true;
    }
    if (elementos.formEdit) {
      this.formedit.count++;
      this.formedit.pages.push(pageNumber);
      isPageCategorized = true;
    }
    if (elementos.nav) {
      this.navbar.count++;
      this.navbar.pages.push(pageNumber);
      isPageCategorized = true;
    }
    if (elementos.aside) {
      this.aside.count++;
      this.aside.pages.push(pageNumber);
      isPageCategorized = true;
    }
    if (elementos.vistaRegistro) {
      this.showregister.count++;
      this.showregister.pages.push(pageNumber);
      isPageCategorized = true;
    }
    if (elementos.vistaRegistros) {
      this.index_o_table.count++;
      this.index_o_table.pages.push(pageNumber);
      isPageCategorized = true;
    }

    if (!isPageCategorized) {
      this.pagina_nomal.count++;
      this.pagina_nomal.pages.push(pageNumber);
     // console.log(`Página ${pageNumber}: Clasificada como página normal.`);
    }
  }
}