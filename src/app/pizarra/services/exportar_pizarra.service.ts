

import { inject, Injectable } from '@angular/core';
import { PageContent } from '../interfaces/pagecontent';
import { generateMenuComponent } from './componentes_export/menu_random_component';
import { generateRandomComponent } from './componentes_export/random_component';
import { addLinksToMenu } from './componentes_export/añadir_links_menus';
import { ExportadorAngularService } from '../../exportar/services/exportador_form.service';
import { ExportadorService } from '../../exportar/services/exportador.service';
import { GeneratedComponent } from '../interfaces/componente_angular';

@Injectable({
  providedIn: 'root',
})
export class ExportarPizarraService {
  constructor() {}

  
  formcreate: { count: number; pages: number[] } = { count: 0, pages: [] };
  formedit: { count: number; pages: number[] } = { count: 0, pages: [] };
  navbar: { count: number; pages: number[] } = { count: 0, pages: [] };
  aside: { count: number; pages: number[] } = { count: 0, pages: [] };
  showregister: { count: number; pages: number[] } = { count: 0, pages: [] };
  index_o_table: { count: number; pages: number[] } = { count: 0, pages: [] };

  pagina_nomal: { count: number; pages: number[] } = { count: 0, pages: [] };

  private exportadorangular=inject(ExportadorService);

  contenidot(contenido: PageContent[], totalpages: number): void {
    console.log('Total de páginas:', totalpages);
    console.log('Contenido recibido:', contenido);
    const resultado: { nav: HTMLElement | null; aside: HTMLElement | null; formCreate: Element | null; formEdit: Element | null; show: Element | null; table: HTMLTableElement | null; }[] = [];
    for (let i = 0; i < totalpages; i++) {
      const pageContent = contenido[i]; // Obtener el contenido de la página actual
      if (pageContent) {
        resultado[i]= this.buscarBloquesPagina(pageContent.html,pageContent.css, i + 1); // Pasar el número de página       
      } else {
        console.warn(`Faltan datos para la página ${i + 1}`);
      }
    }
 
     const componentes:GeneratedComponent[]=[]   
    if (this.navbar.count === 0) {
      if (this.aside.count === 0) {
        const menu=generateMenuComponent();
        const links:string[]=[] 
        for (let i = 0; i < totalpages; i++) {
         if(this.formcreate.count===0 && this.formedit.count===0 && this.showregister.count===0 && this.index_o_table.count===0){ {
          const PageContent = contenido[i]; // Obtener el contenido de la página actual 
          const componente=generateRandomComponent(PageContent.html,PageContent.css,i+1)
          componentes.push(componente);        
          links.push(componente.nombre)
          //addLinksToMenu(menu,)  
        }

         
         
        }
        addLinksToMenu(menu,links)
        componentes.push(menu);
      }
    
    } 
    }       
   
    

    


  }

  private buscarBloquesPagina(htmlString: string,cssString:string, pageNumber: number) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const nav = doc.querySelector('nav');
    const aside = doc.querySelector('aside');
    const formCreate = doc.querySelector('form.create');
    const formEdit = doc.querySelector('form.edit');
    const show = doc.querySelector('.show');
    const table = doc.querySelector('table');

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
    if (show) {
      this.showregister.count++;
      this.showregister.pages.push(pageNumber);
      isPageCategorized = true;
    }
    if (table) {
      this.index_o_table.count++;
      this.index_o_table.pages.push(pageNumber);
      isPageCategorized = true;
    }
  
    // Si la página no encaja en ninguna categoría, clasificarla como "normal"
    if (!isPageCategorized) {
      this.pagina_nomal.count++;
      this.pagina_nomal.pages.push(pageNumber);
      console.log(`Página ${pageNumber}: Clasificada como página normal.`);
    }

    return { nav, aside, formCreate, formEdit, show, table };
  }


   createComponents(pagenumber:number, htmlString: string, cssString: string) {
    
    const formCreate = this.formcreate.count ;
    const formEdit = this.formedit.count;
    const nav = this.navbar.count;
    const aside = this.aside.count;
    const show = this.showregister.count;
    const table = this.index_o_table.count;
    const pageNormal=this.pagina_nomal.count;
    const pageNumber = pagenumber; // Número de página actual
    const menu=0;

    // Lógica principal
    if (this.navbar.count === 0) {
      if (this.aside.count === 0) { 
        const menuComponent = generateMenuComponent();
        console.log('Componente generado:', menuComponent);
        if (formCreate===0  &&  formEdit===0 &&  show===0 && !table) {
          const randomComponent = generateRandomComponent(htmlString,cssString,pageNumber); // Generar un componente random
          addLinksToMenu(menuComponent,[randomComponent.nombre]); // Agregar links al componente menú     
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



   






  private buscarFormCreatet(htmlString: string, pageNumber: number): void {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    const form = doc.querySelector('form.create');

    if (form) {
      const button = Array.from(form.querySelectorAll('button')).find(
        (btn) => btn.textContent?.trim().toLowerCase() === 'crear'
      );

      if (button) {
        console.log(`Página ${pageNumber}: Se encontró un formulario con un botón que tiene el texto "crear".`);
      } else {
        console.warn(`Página ${pageNumber}: Se encontró un formulario, pero no tiene un botón con el texto "crear".`);
      }
    } else {
      console.warn(`Página ${pageNumber}: No se encontró un formulario "create" en el HTML proporcionado.`);
    }
  }

  private buscarFormEditt(htmlString: string, pageNumber: number): void {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    const form = doc.querySelector('form.edit');

    if (form) {
      const button = Array.from(form.querySelectorAll('button')).find(
        (btn) => btn.textContent?.trim().toLowerCase() === 'editar'
      );

      if (button) {
        console.log(`Página ${pageNumber}: Se encontró un formulario con un botón que tiene el texto "editar".`);
      } else {
        console.warn(`Página ${pageNumber}: Se encontró un formulario, pero no tiene un botón con el texto "editar".`);
      }
    } else {
      console.warn(`Página ${pageNumber}: No se encontró un formulario "edit" en el HTML proporcionado.`);
    }
  }





























  contenido(contenido: PageContent[], totalpages: number): void {
    console.log('Total de páginas:', totalpages);
    console.log('Contenido recibido:', contenido);
  
    for (let i = 0; i < totalpages; i++) {
      const pageContent = contenido[i]; // Obtener el contenido de la página actual
  
      if (pageContent) {

         this.buscarFormCreate(pageContent.html);
        /* console.log(`Página ${i + 1}:`);
        console.log(`HTML:`, pageContent.html);
        console.log(`CSS:`, pageContent.css); */
      } else {
        console.warn(`Faltan datos para la página ${i + 1}`);
      }
    }
  }


  buscarFormCreate(htmlString:string){
  
    const parser = new DOMParser();
const doc = parser.parseFromString(htmlString, 'text/html');

// Buscar el formulario
const form = doc.querySelector('form');

if (form) {
  // Buscar el botón dentro del formulario que tenga como texto "crear"
  const button = Array.from(form.querySelectorAll('button')).find(
    (btn) => btn.textContent?.trim().toLowerCase() === 'crear'
  );

  if (button) {
    console.log('Se encontró un formulario con un botón que tiene el texto "crear".');
    
  } else {
    console.warn('Se encontró un formulario, pero no tiene un botón con el texto "crear".');
  }
} else {
  console.warn('No se encontró un formulario en el HTML proporcionado.');
}

  }


}