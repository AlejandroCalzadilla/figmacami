import { Injectable } from '@angular/core';
import { GeneratedComponent } from '../interfaces/componente_angular';
import { CrudValidado } from '../interfaces/crud.interface';

@Injectable({
  providedIn: 'root'
})
export class ExportadorCrudService {


   propiedades!:string;

  generarComponentesCrud(crud: CrudValidado): GeneratedComponent[] {
    try {
      const componentes: GeneratedComponent[] = [];
      //console.log(crud.nombre, " el nombre del crud base ")
      const nombreBase = crud.nombre;

      // Generar componente Create
      if (crud.formCreate) {
        const createComponent = this.generarComponenteCreate(crud.formCreate, nombreBase);
        componentes.push(createComponent);
      }

      // Generar componente Edit
      /*  if (crud.formEdit) {
         const editComponent = this.generarComponenteEdit(crud.formEdit, nombreBase);
         console.log('componente edit', editComponent);
         componentes.push(editComponent);
       } */

      // Generar componente Lista
      if (crud.indexTable) {
        const listComponent = this.generarComponenteLista(crud.indexTable, nombreBase);
        componentes.push(listComponent);
      } 

      // Generar componente Ver
      /*  if (crud.showRegister) {
         console.log('componente view', crud.showRegister);
         const viewComponent = this.generarComponenteVer(crud.showRegister, nombreBase);
         componentes.push(viewComponent);
       } */
      console.log('componentes', componentes);
      return componentes;
    } catch (error) {
      console.error('Error al generar componentes CRUD:', error);
      return [];
    }
  }

  private generarComponenteCreate(formData: { html: string; css: string }, nombreBase: string): GeneratedComponent {
    const nombreComponente = `${nombreBase}`;
    const parser = new DOMParser();
    const doc = parser.parseFromString(formData.html, 'text/html');
    const form = doc.querySelector('form');

    if (!form) {
      throw new Error('No se encontró un formulario en el HTML proporcionado');
    }

    const inputs = form.querySelectorAll('input, select, textarea');
    const propiedades = Array.from(inputs)
    .map(input => {
      const name = input.getAttribute('name') || input.getAttribute('id') || '';
      const type = input.getAttribute('type') || 'string';
      return { name, type };
    })
    .filter((input, index, self) => 
      input.name && self.findIndex(i => i.name === input.name) === index // Filtrar duplicados
    )
    .map(input => `  ${input.name}: ${this.getTipoTypeScript(input.type)};`)
    .join('\n');

    const interfaz = this.generarInterfaz(nombreBase, propiedades);
    const componente = this.generarComponenteFormReactivo(form, nombreComponente, inputs, false);
    const data: string = this.transformarHtmlAReactivo(formData.html)
    .replace(/\[formgroup\]/g, '[formGroup]'); 
    
    const servicio = this.generarServicio(nombreBase);
   
    return {
      html: data,
      css: formData.css,
      ts: componente,
      service: servicio,
      interface: interfaz,
      nombre: nombreComponente,
      nombreClaseComponent: `${nombreBase}CreateComponent`,
      ruta: { path: `create_${nombreBase}`, component: `${nombreBase}CreateComponent` },
      nombre_archivo_ts: `${nombreComponente}_create.component.ts`,
      nombre_archivo_css: `${nombreComponente}_create.component.css`,
      nombre_archivo_html: `${nombreComponente}_create.component.html`,
      nombre_Clase_Service: `${nombreBase}Service`,
      nombre_archivo_service: `${nombreBase}.service.ts`,
      nombre_archivo_interface: `${nombreBase}.interface.ts`,
      componente: true,
      form: 'create',
      //import { crud_1CreateComponent } from './crud_1/components/crud_1_create/crud_1_create.component';
      ruta_componente: `./${nombreBase}/components/${nombreBase}_create/${nombreBase}_create.component`
    };
  }






















  private generarComponenteEdit(formData: { html: string; css: string }, nombreBase: string): GeneratedComponent {
    const nombreComponente = `${nombreBase}`;
    //nombre componte = crud_1_edit
    const parser = new DOMParser();


    const doc = parser.parseFromString(formData.html, 'text/html');

    const form = doc.querySelector('form');

    if (!form) {
      throw new Error('No se encontró un formulario en el HTML proporcionado');
    }

    const inputs = form.querySelectorAll('input, select, textarea');
    const componente = this.generarComponenteForm(form, nombreComponente, inputs, true);

    return {
      html: formData.html,
      css: formData.css,
      ts: componente,
      service: '',
      nombre: nombreComponente,
      nombreClaseComponent: `${nombreBase}EditComponent`,
      ruta: { path: `edit/:id`, component: `${nombreBase}EditComponent` },
      nombre_archivo_ts: `${nombreComponente}.component.ts`,//crud_1_edit.componente.ts
      nombre_archivo_css: `${nombreComponente}.component.css`,//crud_1_edit.componente.css
      nombre_archivo_html: `${nombreComponente}.component.html`,//crud_1_edit.componente.html
      nombre_Clase_Service: `${nombreBase}Service`,//crud_1Service
      nombre_archivo_service: `${nombreBase}.service.ts`,//crud_1.service.html 
      componente: true,
      ruta_componente: `/${nombreBase}/edit/:id`
    };
  }

  private generarComponenteLista(tableData: { html: string; css: string }, nombreBase: string): GeneratedComponent {
    
    
    
    const nombreComponente = `${nombreBase}`;
    const parser = new DOMParser();
    let doc = parser.parseFromString(tableData.html, 'text/html');
    const table = doc.querySelector('table');

    if (!table) {
      throw new Error('No se encontró una tabla en el HTML proporcionado');
    }

    const componente = this.generarComponenteListaTS(table, nombreComponente);
    const tablaModificada =this.modificarTablaHtml(table);
    table.outerHTML = tablaModificada;

     const html =doc.body.innerHTML; 
    return {
      html: html,
      css: tableData.css,
      ts: componente,
      nombre: nombreComponente,
      nombreClaseComponent: `${nombreBase}ListComponent`,
      ruta: { path: `index_${nombreBase}`, component: `${nombreBase}ListComponent` },
      nombre_archivo_ts: `${nombreComponente}_page.component.ts`,
      nombre_archivo_css: `${nombreComponente}_page.component.css`,
      nombre_archivo_html: `${nombreComponente}_page.component.html`,
      nombre_Clase_Service: `${nombreBase}Service`,
      nombre_archivo_service: `${nombreBase}.service.ts`,
      nombre_archivo_interface: `${nombreBase}.interface.ts`,
      componente: false,
      ruta_componente: `./${nombreBase}/pages/${nombreBase}_page/${nombreBase}_page.component`
    };
    /**
     * 
     * html: data,
      css: formData.css,
      ts: componente,
      service: servicio,
      interface: interfaz,
      nombre: nombreComponente,
      nombreClaseComponent: `${nombreBase}CreateComponent`,
      ruta: { path: `create_${nombreBase}`, component: `${nombreBase}CreateComponent` },
      nombre_archivo_ts: `${nombreComponente}_create.component.ts`,
      nombre_archivo_css: `${nombreComponente}_create.component.css`,
      nombre_archivo_html: `${nombreComponente}_create.component.html`,
      nombre_Clase_Service: `${nombreBase}Service`,
      nombre_archivo_service: `${nombreBase}.service.ts`,
      nombre_archivo_interface: `${nombreBase}.interface.ts`,
      componente: true,
      form: 'create',
      //import { crud_1CreateComponent } from './crud_1/components/crud_1_create/crud_1_create.component';
      ruta_componente: `./${nombreBase}/components/${nombreBase}_create/${nombreBase}_create.component`
     */
  }

  private generarComponenteVer(viewData: { html: string; css: string }, nombreBase: string): GeneratedComponent {
    const nombreComponente = `${nombreBase}`;
    const parser = new DOMParser();
    const doc = parser.parseFromString(viewData.html, 'text/html');
    const viewElement = doc.querySelector('div');

    if (!viewElement) {
      throw new Error('No se encontró el elemento de vista en el HTML proporcionado');
    }

    const componente = this.generarComponenteVerTS(viewElement, nombreComponente);
    console.log(viewData.html, 'html de vista')
    return {
      html: viewData.html,
      css: viewData.css,
      ts: componente,
      service: '',
      interface: '',
      nombre: nombreComponente,
      nombreClaseComponent: `${nombreBase}ViewComponent`,
      ruta: { path: `view/:id`, component: `${nombreBase}ViewComponent` },
      nombre_archivo_ts: `${nombreComponente}.component.ts`,
      nombre_archivo_css: `${nombreComponente}.component.css`,
      nombre_archivo_html: `${nombreComponente}.component.html`,
      nombre_Clase_Service: `${nombreBase}Service`,
      nombre_archivo_service: `${nombreBase}.service.ts`,
      nombre_archivo_interface: `${nombreBase}.interface.ts`,
      componente: true,
      ruta_componente: `/${nombreBase}/view/:id`
    };
  }

  private getTipoTypeScript(type: string): string {
    switch (type.toLowerCase()) {
      case 'number':
      case 'range':
        return 'number';
      case 'checkbox':
        return 'boolean';
      case 'date':
        return 'Date';
      default:
        return 'string';
    }
  }

  private generarInterfaz(nombreBase: string, propiedades: string): string {
    return `export interface I${nombreBase} {
    id?: string;
    ${propiedades}
}`;
  }





  private generarComponenteFormReactivo(
    form: HTMLFormElement,
    nombreComponente: string,
    inputs: NodeListOf<Element>,
    isEdit: boolean
  ): string {
    
    const routeParams = isEdit ? `\n  private route = inject(ActivatedRoute);` : '';
    const routeImports = isEdit ? `\nimport { ActivatedRoute } from '@angular/router';` : '';
  
    return `import { Component, OnInit, inject } from '@angular/core';
  import { FormBuilder,ReactiveFormsModule ,FormGroup, FormControl, Validators } from '@angular/forms';
  import { ${nombreComponente}Service } from './../../services/${nombreComponente}.service';
  import { CommonModule } from '@angular/common';
  import { I${nombreComponente} } from './../../interfaces/${nombreComponente}.interface';${routeImports}
  
  @Component({
    selector: 'app-${nombreComponente.toLowerCase()}',
    templateUrl: './${nombreComponente}_create.component.html',
    styleUrls: ['./${nombreComponente}_create.component.css'],
    imports: [ReactiveFormsModule,CommonModule]
  })
  export class ${nombreComponente}${isEdit ? 'Edit' : 'Create'}Component implements OnInit {
    formulario: FormGroup;
    modoEdicion: boolean = ${isEdit};
    ${routeParams}
  

  
    constructor(
      private fb: FormBuilder,
      private ${nombreComponente.toLowerCase()}Service: ${nombreComponente}Service
    ) {
      this.formulario = this.fb.group({
        ${Array.from(inputs)
          .map(input => {
            const name = input.getAttribute('name') || input.getAttribute('id') || '';
            const required = input.hasAttribute('required') ? ', Validators.required' : '';
            return { name, required };
          })
          .filter((input, index, self) => 
            input.name && self.findIndex(i => i.name === input.name) === index // Filtrar duplicados
          )
          .map(input => `      ${input.name}: [''${input.required}]`)
          .join(',\n')}
      });
    }
  
    ngOnInit(): void {
      ${isEdit ? `this.route.params.subscribe(params => {
        const id = params['id'];
        if (id) {
          this.${nombreComponente.toLowerCase()}Service.obtenerPorId(id).subscribe(
            (data: I${nombreComponente}) => {
              this.formulario.patchValue(data);
            }
          );
        }
      });` : ''}
    }
  
    crearoeditar(): void {
      if (this.formulario.valid) {
        const datos: I${nombreComponente} = {
          ...this.formulario.value,
          id: ${isEdit ? 'this.route.snapshot.params["id"]' : 'this.generarId()'}
        };
  
        if (this.modoEdicion) {
          this.${nombreComponente.toLowerCase()}Service.actualizar(datos).subscribe(
            response => {
              console.log('Datos actualizados exitosamente', response);
            },
            error => {
              console.error('Error al actualizar datos', error);
            }
          );
        } else {
          this.${nombreComponente.toLowerCase()}Service.crear(datos).subscribe(
            response => {
              console.log('Datos creados exitosamente', response);
            },
            error => {
              console.error('Error al crear datos', error);
            }
          );
        }
      }
    }
  
    private generarId(): string {
      return Math.random().toString(36).substring(2) + Date.now().toString(36);
    }
  }`;
  }


  private transformarHtmlAReactivo(html: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const form = doc.querySelector('form');
  
    if (!form) {
      throw new Error('No se encontró un formulario en el HTML proporcionado');
    }
  
    // Transformar los inputs, selects y textareas
    Array.from(form.querySelectorAll('input, select, textarea')).forEach(input => {
      const name = input.getAttribute('name') || input.getAttribute('id');
      if (name) {
        // Agregar formControlName al input
        input.setAttribute('formControlName', name);
      }
    });
  
    // Editar los labels existentes
    Array.from(form.querySelectorAll('label')).forEach(label => {
      const forAttr = label.getAttribute('for');
      const labelId = label.getAttribute('id'); // Mantener el id del label
      if (forAttr) {
        const associatedInput = form.querySelector(`[id="${forAttr}"], [name="${forAttr}"]`);
        if (associatedInput) {
          label.setAttribute('for', associatedInput.getAttribute('id') || associatedInput.getAttribute('name') || '');
        }
      }
      // Si el label tiene un id, asegurarse de que no se pierda
      if (labelId) {
        label.setAttribute('id', labelId);
      }
    });
  
    // Construir el HTML del formulario como un string
    const formHtml = `
      <form [formGroup]="formulario" (ngSubmit)="crearoeditar()">
        ${form.innerHTML}
        
      </form>
    `;
  
    // Reemplazar el formulario en el documento original
    doc.body.innerHTML = doc.body.innerHTML.replace(form.outerHTML, formHtml);
  
    // Devolver el HTML completo
    return doc.body.innerHTML.trim();
  }





  private generarComponenteForm(form: HTMLFormElement, nombreComponente: string, inputs: NodeListOf<Element>, isEdit: boolean): string {
    const propiedades = Array.from(inputs)
  .map(input => {
    const name = input.getAttribute('name') || input.getAttribute('id') || '';
    return { name };
  })
  .filter((input, index, self) => 
    input.name && self.findIndex(i => i.name === input.name) === index // Filtrar duplicados
  )
  .map(input => `  ${input.name}: FormControl = new FormControl('');`)
  .join('\n');
   

    const routeParams = isEdit ? `\n  private route = inject(ActivatedRoute);` : '';
    const routeImports = isEdit ? `\nimport { ActivatedRoute } from '@angular/router';` : '';

    return `import { Component, OnInit, Input, inject } from '@angular/core';
             import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
              import { ${nombreComponente}Service } from './../../services/${nombreComponente}.service';
            import { I${nombreComponente} } from './../../interfaces/${nombreComponente}.interface';${routeImports}
            import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-${nombreComponente.toLowerCase()}',
  templateUrl:'./${nombreComponente}_create.component.html',
  styleUrls: ['./${nombreComponente}_create.component.css']
})


export class ${nombreComponente}${isEdit ? 'Edit' : 'Create'}Component implements OnInit {
  formulario: FormGroup;
  modoEdicion: boolean = ${isEdit};${routeParams}

${propiedades}

  constructor(
    private fb: FormBuilder,
    private ${nombreComponente.toLowerCase()}Service: ${nombreComponente}Service
  ) {
    this.formulario = this.fb.group({
   ${Array.from(inputs).map(input => {
      const name = input.getAttribute('name') || input.getAttribute('id') || '';
      return `      ${name}: [''${input.hasAttribute('required') ? ', Validators.required' : ''}]`;
    }).join(',\n')}
    });
  }

  ngOnInit(): void {
    ${isEdit ? `this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.${nombreComponente.toLowerCase()}Service.obtenerPorId(id).subscribe(
          (data: I${nombreComponente}) => {
            this.formulario.patchValue(data);
          }
        );
      }
    });` : ''}
  }

  onSubmit(): void {
    if (this.formulario.valid) {
      const datos: I${nombreComponente} = {
        ...this.formulario.value,
        id: ${isEdit ? 'this.route.snapshot.params["id"]' : 'this.generarId()'}
      };

      if (this.modoEdicion) {
        this.${nombreComponente.toLowerCase()}Service.actualizar(datos).subscribe(
          response => {
            console.log('Datos actualizados exitosamente', response);
          },
          error => {
            console.error('Error al actualizar datos', error);
          }
        );
      } else {
        this.${nombreComponente.toLowerCase()}Service.crear(datos).subscribe(
          response => {
            console.log('Datos creados exitosamente', response);
          },
          error => {
            console.error('Error al crear datos', error);
          }
        );
      }
    }
  }

  private generarId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}`;
  }




















  private generarComponenteListaTS(table: HTMLTableElement, nombreComponente: string): string {
    const nombreBase = nombreComponente;
    return `import { Component, OnInit } from '@angular/core';
import { ${nombreBase}Service } from './../../services/${nombreBase.toLowerCase()}.service';
import { I${nombreBase} } from './../../interfaces/${nombreBase.toLowerCase()}.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-${nombreComponente.toLowerCase()}_page',
  templateUrl: './${nombreComponente.toLowerCase()}_page.component.html',
  styleUrls: ['./${nombreComponente.toLowerCase()}_page.component.css']
})
export class ${nombreBase}ListComponent implements OnInit {
  registros: I${nombreBase}[] = [];

  constructor(
    private ${nombreBase.toLowerCase()}Service: ${nombreBase}Service,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarRegistros();
  }

  cargarRegistros(): void {
    this.${nombreBase.toLowerCase()}Service.obtenerTodos().subscribe(
      (data: I${nombreBase}[]) => {
        this.registros = data;
      },
      error => {
        console.error('Error al cargar registros', error);
      }
    );
  }

  verRegistro(id: string): void {
    this.router.navigate(['/${nombreBase.toLowerCase()}/view', id]);
  }

  editarRegistro(id: string): void {
    this.router.navigate(['/${nombreBase.toLowerCase()}/edit', id]);
  }

  eliminarRegistro(id: string): void {
    if (confirm('¿Está seguro de eliminar este registro?')) {
      this.${nombreBase.toLowerCase()}Service.eliminar(id).subscribe(
        () => {
          this.cargarRegistros();
        },
        error => {
          console.error('Error al eliminar registro', error);
        }
      );
    }
  }

  crearNuevo(): void {
    this.router.navigate(['create_/${nombreBase.toLowerCase()}']);
  }
}`;
  }

  private modificarTablaHtml(table: HTMLTableElement): string {
    // Obtener los encabezados de la tabla
    const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent?.trim() || '');
  
    // Mantener los atributos originales de la tabla y sus elementos
    const tableAttributes = Array.from(table.attributes)
      .map(attr => `${attr.name}="${attr.value}"`)
      .join(' ');
  
    // Generar el HTML de la tabla con *ngFor
    return `
      <button (click)="crear()">Crear</button>
      <table ${tableAttributes}>
        <thead>
          <tr>
            ${headers.map(header => `<th>${header}</th>`).join('')}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let registro of registros">
            ${headers.map(header => `<td>{{ registro.${this.camelCase(header)} }}</td>`).join('')}
            <td>
              <button (click)="verRegistro(registro.id)">Ver</button>
              <button (click)="editarRegistro(registro.id)">Editar</button>
              <button (click)="eliminarRegistro(registro.id)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    `;
  }

  private camelCase(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase());
  }


















  private generarComponenteVerTS(viewElement: HTMLElement, nombreComponente: string): string {
    const nombreBase = nombreComponente.split('_')[0];
    return `import { Component, OnInit } from '@angular/core';
import { ${nombreBase}Service } from './${nombreBase.toLowerCase()}.service';
import { I${nombreBase} } from './${nombreBase.toLowerCase()}.interface';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-${nombreComponente.toLowerCase()}',
  templateUrl: './${nombreComponente.toLowerCase()}.component.html',
  styleUrls: ['./${nombreComponente.toLowerCase()}.component.css']
})
export class ${nombreBase}ViewComponent implements OnInit {
  registro: I${nombreBase} | null = null;

  constructor(
    private ${nombreBase.toLowerCase()}Service: ${nombreBase}Service,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.${nombreBase.toLowerCase()}Service.obtenerPorId(id).subscribe(
          (data: I${nombreBase}) => {
            this.registro = data;
          },
          error => {
            console.error('Error al cargar registro', error);
          }
        );
      }
    });
  }

  volver(): void {
    this.router.navigate(['/${nombreBase.toLowerCase()}']);
  }

  editar(): void {
    if (this.registro?.id) {
      this.router.navigate(['/${nombreBase.toLowerCase()}/edit', this.registro.id]);
    }
  }
}`;
  }

  private generarServicio(nombreBase: string): string {
    return `import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { I${nombreBase} } from './../interfaces/${nombreBase.toLowerCase()}.interface';

@Injectable({
  providedIn: 'root'
})
export class ${nombreBase}Service {
  private readonly STORAGE_KEY = '${nombreBase.toLowerCase()}_data';

  constructor() { }

  obtenerTodos(): Observable<I${nombreBase}[]> {
    const datos = localStorage.getItem(this.STORAGE_KEY);
    return of(datos ? JSON.parse(datos) : []);
  }

  obtenerPorId(id: string): Observable<I${nombreBase}> {
    return new Observable(observer => {
      this.obtenerTodos().subscribe(datos => {
        const item = datos.find(d => d.id === id);
        if (item) {
          observer.next(item);
        } else {
          observer.error('No se encontró el elemento');
        }
        observer.complete();
      });
    });
  }

  crear(datos: I${nombreBase}): Observable<I${nombreBase}> {
    return new Observable(observer => {
      this.obtenerTodos().subscribe(items => {
        items.push(datos);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
        observer.next(datos);
        observer.complete();
      });
    });
  }

  actualizar(datos: I${nombreBase}): Observable<I${nombreBase}> {
    return new Observable(observer => {
      this.obtenerTodos().subscribe(items => {
        const index = items.findIndex(item => item.id === datos.id);
        if (index !== -1) {
          items[index] = datos;
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
          observer.next(datos);
        } else {
          observer.error('No se encontró el elemento a actualizar');
        }
        observer.complete();
      });
    });
  }

  eliminar(id: string): Observable<void> {
    return new Observable(observer => {
      this.obtenerTodos().subscribe(items => {
        const nuevosItems = items.filter(item => item.id !== id);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(nuevosItems));
        observer.next();
        observer.complete();
      });
    });
  }
}`;
  }
} 