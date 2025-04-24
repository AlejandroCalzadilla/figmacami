
import { inject, Injectable } from '@angular/core';
import { PageContent } from '../interfaces/pagecontent';
import { generateMenuComponent } from './componentes_export/menu_random_component';
import { generateRandomComponent } from './componentes_export/random_component';
import { addLinksToMenu, assignLinksToMenuComponent } from './componentes_export/añadir_links_menus';
import { ExportadorAngularService } from './exportador_form_create_edit.service';
import { ExportadorService } from '../../exportar/services/exportador.service';
import { GeneratedComponent } from '../interfaces/componente_angular';

@Injectable({
  providedIn: 'root',
})
export class ExportarPizarraService {
  constructor() { }
  formcreate: { count: number; pages: number[] } = { count: 0, pages: [] };
  formedit: { count: number; pages: number[] } = { count: 0, pages: [] };
  navbar: { count: number; pages: number[] } = { count: 0, pages: [] };
  aside: { count: number; pages: number[] } = { count: 0, pages: [] };
  showregister: { 
    count: number; 
    pages: number[],} = { count: 0, pages: [] };
  index_o_table: { count: number; pages: number[] } = { count: 0, pages: [] };

  pagina_nomal: { count: number; pages: number[] } = { count: 0, pages: [] };

  private exportadorangular = inject(ExportadorService);

  contenidot(contenido: PageContent[], totalpages: number): void {
    console.log('Total de páginas:', totalpages);
    console.log('Contenido recibido:', contenido);
   // const resultado: { nav: HTMLElement | null; aside: HTMLElement | null; formCreate: Element | null; formEdit: Element | null; vistaRegistroCrud: Element | null; vistaRegistrosCrud: HTMLTableElement | null; }[] = [];
    for (let i = 0; i < totalpages; i++) {
      const pageContent = contenido[i]; // Obtener el contenido de la página actual
      if (pageContent) {
         this.buscarBloquesPagina(pageContent.html, pageContent.css, i + 1); // Pasar el número de página       
      } else {
        console.warn(`Faltan datos para la página ${i + 1}`);
      }
    }

    const componentes: GeneratedComponent[] = []
    //si no hay menus y solo hay genericos 
    if (this.navbar.count === 0) {
      if (this.aside.count === 0) {
        // Si no hay navbar y aside, y no hay formularios, se genera un menú con los componentes random
        if (this.formcreate.count === 0 && this.formedit.count === 0 && this.showregister.count === 0 && this.index_o_table.count === 0) {
          const menu = generateMenuComponent();
          const links: string[] = []
          for (let i = 0; i < totalpages; i++) {
            if (this.formcreate.count === 0 && this.formedit.count === 0 && this.showregister.count === 0 && this.index_o_table.count === 0) {
              {
                const PageContent = contenido[i]; // Obtener el contenido de la página actual 
                const componente = generateRandomComponent(PageContent.html, PageContent.css, i + 1)
                componentes.push(componente);
                links.push(componente.nombre)
              }
            }
          }
          addLinksToMenu(menu, links)
          const linksfinal = assignLinksToMenuComponent(menu.ts, links)
          menu.ts = linksfinal;
          componentes.push(menu);
          this.exportadorangular.generateProject(componentes);
        }
      }
      if(this.formcreate.count > 0 && this.formedit.count > 0 && this.showregister.count > 0 && this.index_o_table.count > 0){
      }


    }
    if (this.navbar.count === 0) {
      if (this.aside.count === 0) {


      }
    }






  }






  private agruparYValidarCruds(): void {
    const cruds: {
      formCreate: HTMLElement | null;
      formEdit: HTMLElement | null;
      showRegister: HTMLElement | null;
      indexTable: HTMLElement | null;
    }[] = [];
  
    // Obtener todos los elementos relevantes
    const formCreates = Array.from(document.querySelectorAll('form.create'));
    const formEdits = Array.from(document.querySelectorAll('form.edit'));
    const showRegisters = Array.from(document.querySelectorAll('.show'));
    const indexTables = Array.from(document.querySelectorAll('table'));
  
    // Agrupar los elementos en posibles CRUDs
    formCreates.forEach((formCreate) => {
      const relatedCrud = {
        formCreate,
        formEdit: this.buscarRelacionado(formCreate as HTMLElement, formEdits as HTMLElement[]),
        showRegister: this.buscarRelacionado(formCreate, showRegisters),
        indexTable: this.buscarRelacionado(formCreate, indexTables),
      };
  
      cruds.push(relatedCrud);
    });
  
    // Validar cada CRUD
    cruds.forEach((crud, index) => {
      console.log(`Validando CRUD ${index + 1}:`);
      const isValid = this.validarCrud(crud);
      if (isValid) {
        console.log(`CRUD ${index + 1} es válido.`);
      } else {
        console.warn(`CRUD ${index + 1} tiene inconsistencias.`);
      }
    });
  }
  
  private buscarRelacionado(baseElement: HTMLElement, elements: (HTMLElement | Element)[]): HTMLElement | null {
    // Buscar un elemento relacionado basado en los campos o etiquetas
    return elements.find((element) => {
      const baseLabels = Array.from(baseElement.querySelectorAll('label')).map((label) =>
        label.textContent?.trim().toLowerCase()
      );
      const elementLabels = Array.from(element.querySelectorAll('label')).map((label) =>
        label.textContent?.trim().toLowerCase()
      );
  
      // Verificar si hay una intersección significativa entre los labels
      const intersection = baseLabels.filter((label) => elementLabels.includes(label));
      return intersection.length >= Math.min(baseLabels.length, elementLabels.length) * 0.8; // 80% de coincidencia
    }) || null;
  }
  
  private validarCrud(crud: {
    formCreate: HTMLElement | null;
    formEdit: HTMLElement | null;
    showRegister: HTMLElement | null;
    indexTable: HTMLElement | null;
  }): boolean {
    const { formCreate, formEdit, showRegister, indexTable } = crud;
  
    if (!formCreate || !formEdit || !showRegister || !indexTable) {
      console.warn('Faltan elementos en el CRUD.');
      return false;
    }
  
    // Validar que los campos del formCreate coincidan con los del formEdit
    const createLabels = Array.from(formCreate.querySelectorAll('label')).map((label) =>
      label.textContent?.trim().toLowerCase()
    );
    const editLabels = Array.from(formEdit.querySelectorAll('label')).map((label) =>
      label.textContent?.trim().toLowerCase()
    );
  
    const createEditIntersection = createLabels.filter((label) => editLabels.includes(label));
    if (createEditIntersection.length < Math.min(createLabels.length, editLabels.length) * 0.8) {
      console.warn('Los campos del formCreate y formEdit no coinciden suficientemente.');
      return false;
    }
  
    // Validar que los campos del formCreate coincidan con los del showRegister
    const showLabels = Array.from(showRegister.querySelectorAll('strong')).map((strong) =>
      strong.textContent?.trim().toLowerCase()
    );
  
    const createShowIntersection = createLabels.filter((label) => showLabels.includes(label));
    if (createShowIntersection.length < Math.min(createLabels.length, showLabels.length) * 0.8) {
      console.warn('Los campos del formCreate y showRegister no coinciden suficientemente.');
      return false;
    }
  
    // Validar que las columnas de la tabla coincidan con los campos del formCreate
    const tableHeaders = Array.from(indexTable.querySelectorAll('th')).map((th) =>
      th.textContent?.trim().toLowerCase()
    );
  
    const createTableIntersection = createLabels.filter((label) => tableHeaders.includes(label));
    if (createTableIntersection.length < Math.min(createLabels.length, tableHeaders.length) * 0.8) {
      console.warn('Los campos del formCreate y las columnas de la tabla no coinciden suficientemente.');
      return false;
    }

    return true;
  }






  private buscarBloquesPagina(htmlString: string, cssString: string, pageNumber: number) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const nav = doc.querySelector('nav');
    const aside = doc.querySelector('aside');
    const formCreate = doc.querySelector('form.create');
    const formEdit = doc.querySelector('form.edit');
    const vistaRegistroCrud= this.buscarVistaRegistroConVolver(htmlString, pageNumber); // Llamar a la función para buscar vista de registro CRUD
    const vistaRegistrosCrud = this.buscarVistaRegistrosCrud(htmlString, pageNumber); // Llamar a la función para buscar vista de registro CRUD
    // Clasificar elementos
    let isPageCategorized = false; // Variable para verificar si la página fue categorizada

    // Clasificar elementos
    if (formCreate) {
      this.formcreate.count++;
      this.formcreate.pages.push(pageNumber);
      this.buscarFormCreatet(htmlString, pageNumber);
      isPageCategorized = true;
    }
    if (formEdit) {
      this.formedit.count++;
      this.formedit.pages.push(pageNumber);
      this.buscarFormEditt(htmlString, pageNumber);
      isPageCategorized = true;
    }
    if (nav) {
      this.navbar.count++;
      this.navbar.pages.push(pageNumber);
      isPageCategorized = true;
    }
    if (aside) {
      this.aside.count++;
      this.aside.pages.push(pageNumber);
      isPageCategorized = true;
    }
    if (vistaRegistroCrud) {
      this.showregister.count++;
      this.showregister.pages.push(pageNumber);
      isPageCategorized = true;
    }
  
    if(vistaRegistrosCrud) {
      this.showregister.count++;
      this.showregister.pages.push(pageNumber);
      isPageCategorized = true;
    }

    // Si la página no encaja en ninguna categoría, clasificarla como "normal"
    if (!isPageCategorized) {
      this.pagina_nomal.count++;
      this.pagina_nomal.pages.push(pageNumber);
      console.log(`Página ${pageNumber}: Clasificada como página normal.`);
    }
   // return { nav, aside, formCreate, formEdit, vistaRegistroCrud, vistaRegistrosCrud };
  }

 
  private buscarVistaRegistrosCrud(htmlString: string, pageNumber: number): boolean {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
  
    // Buscar un elemento con id que contenga "vistaregistro"
    const vistaRegistroElement = Array.from(doc.querySelectorAll('[id]')).find((el) =>
      el.id.includes('vistaregistros')
    );
  
    if (!vistaRegistroElement) {
      console.warn(`Página ${pageNumber}: No se encontró un elemento con id que contenga "vistaregistro".`);
      return false;
    }
  
    // Verificar que contenga una tabla
    const table = vistaRegistroElement.querySelector('table');
    if (!table) {
      console.warn(`Página ${pageNumber}: El elemento con id "vistaregistro" no contiene una tabla.`);
      return false;
    }
  
    // Verificar que haya un <td> con tres botones: "ver", "editar", "borrar"
    const tdWithButtons = Array.from(table.querySelectorAll('td')).find((td) => {
      const buttons = Array.from(td.querySelectorAll('button'));
      const buttonTexts = buttons.map((btn) => btn.textContent?.trim().toLowerCase());
      return (
        buttonTexts.includes('ver') &&
        buttonTexts.includes('editar') &&
        buttonTexts.includes('borrar')
      );
    });
  
    if (!tdWithButtons) {
      console.warn(`Página ${pageNumber}: No se encontró un <td> con los botones "ver", "editar" y "borrar".`);
      return false;
    }
  
    // Verificar que haya un botón con el texto "crear" dentro del elemento con id "vistaregistro"
    const createButton = vistaRegistroElement.querySelector('button');
    if (!createButton || createButton.textContent?.trim().toLowerCase() !== 'crear') {
      console.warn(`Página ${pageNumber}: No se encontró un botón con el texto "crear" dentro del elemento con id "vistaregistro".`);
      return false;
    }
  
    console.log(`Página ${pageNumber}: Se detectó correctamente una vista de registro.`);
    return true;
  }


  private buscarFormCreatet(htmlString: string, pageNumber: number): boolean {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    const form = doc.querySelector('form');

    if (form) {
      const button = Array.from(form.querySelectorAll('button')).find(
        (btn) => btn.textContent?.trim().toLowerCase() === 'crear'
      ); 
      if (button) {
        //console.log(`Página ${pageNumber}: Se encontró un formulario con un botón que tiene el texto "crear".`);
        return true; // Se encontró un formulario con un botón que tiene el texto "crear"
       } else {
        console.warn(`Página ${pageNumber}: Se encontró un formulario, pero no tiene un botón con el texto "crear".`);
      
           return false; // Se encontró un formulario, pero no tiene un botón con el texto "crear"
      }
    } else {
      console.warn(`Página ${pageNumber}: No se encontró un formulario "create" en el HTML proporcionado.`);
      return false; // No se encontró un formulario "create"
    }
  }

  private buscarFormEditt(htmlString: string, pageNumber: number): boolean {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    const form = doc.querySelector('form.edit');

    if (form) {
      const button = Array.from(form.querySelectorAll('button')).find(
        (btn) => btn.textContent?.trim().toLowerCase() === 'editar'
      );

      if (button) {
        
        console.log(`Página ${pageNumber}: Se encontró un formulario con un botón que tiene el texto "editar".`);
        return true; // Se encontró un formulario con un botón que tiene el texto "editar"
      } else {
        console.warn(`Página ${pageNumber}: Se encontró un formulario, pero no tiene un botón con el texto "editar".`);
        return false; // Se encontró un formulario, pero no tiene un botón con el texto "editar"
      }
    } else {

      console.warn(`Página ${pageNumber}: No se encontró un formulario "edit" en el HTML proporcionado.`);
      return false; // No se encontró un formulario "edit"
    }
  }



  private buscarVistaRegistroConVolver(htmlString: string, pageNumber: number): boolean {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
  
    // Buscar un elemento con id que contenga "vistaregistro"
    const vistaRegistroElement = Array.from(doc.querySelectorAll('[id]')).find((el) =>
      el.id.includes('vistaregistro')
    );
  
    if (!vistaRegistroElement) {
      console.warn(`Página ${pageNumber}: No se encontró un elemento con id que contenga "vistaregistro".`);
      return false;
    }
  
    // Verificar que contenga un botón con el texto "Volver"
    const volverButton = Array.from(vistaRegistroElement.querySelectorAll('button')).find(
      (btn) => btn.textContent?.trim().toLowerCase() === 'volver'
    );
  
    if (!volverButton) {
      console.warn(`Página ${pageNumber}: No se encontró un botón con el texto "Volver" dentro del elemento con id "vistaregistro".`);
      return false;
    }
  
    console.log(`Página ${pageNumber}: Se detectó correctamente una vista de registro con un botón "Volver".`);
    return true;
  }

















  createComponents(pagenumber: number, htmlString: string, cssString: string) {

    const formCreate = this.formcreate.count;
    const formEdit = this.formedit.count;
    const nav = this.navbar.count;
    const aside = this.aside.count;
    const show = this.showregister.count;
    const table = this.index_o_table.count;
    const pageNormal = this.pagina_nomal.count;
    const pageNumber = pagenumber; // Número de página actual
    const menu = 0;

    if (this.navbar.count === 0) {
      if (this.aside.count === 0) {
        const menuComponent = generateMenuComponent();
        console.log('Componente generado:', menuComponent);
        if (formCreate === 0 && formEdit === 0 && show === 0 && !table) {
          const randomComponent = generateRandomComponent(htmlString, cssString, pageNumber); // Generar un componente random
          addLinksToMenu(menuComponent, [randomComponent.nombre]); // Agregar links al componente menú     
          //const componentes[]
          //this.exportadorangular.generateProjectWithSidebar()  
          console.log(`Página ${pageNumber}: No hay elementos válidos. Crear un componente random.`);
        }
        else if (formCreate && show) {
          console.log(`Página ${pageNumber}: Hay formCreate y show. Crear un CRUD.`);
        }

      }
      else {
        console.log(`Página ${pageNumber}: No hay nav, pero hay aside. Crear un sidebar con links.`);

        if (!formCreate && !formEdit && !show) {
          console.log(`Página ${pageNumber}: No hay elementos válidos. Crear un componente random y añadir link al sidebar.`);
        } else if (formEdit && !formCreate && !show) {
          console.log(`Página ${pageNumber}: Solo hay formEdit. Generar un link random en el sidebar.`);
        } else if (show && !formCreate) {
          console.log(`Página ${pageNumber}: Solo hay show. Crear un componente random.`);
        } else if (formCreate && show) {
          console.log(`Página ${pageNumber}: Hay formCreate y show. Crear un CRUD y agregar al sidebar.`);
        }
      }
    } else {
      if (!aside) {
        console.log(`Página ${pageNumber}: Hay nav pero no aside. Crear un sidebar vacío con links principales.`);
      } else {
        console.log(`Página ${pageNumber}: Hay nav y aside. Crear doble link.`);
      }
    }
  }










  































}