import { Injectable } from '@angular/core';
import { GeneratedComponent } from '../interfaces/componente_angular';
import { CrudValidado } from '../interfaces/crud.interface';

@Injectable({
  providedIn: 'root'
})
export class ExportadorCrudService {
  generarComponentesCrud(crud: CrudValidado): GeneratedComponent[] {
    try {
      const componentes: GeneratedComponent[] = [];
      const nombreBase = crud.nombre;

    // Generar componente Create
    if (crud.formCreate) {
      const createComponent = this.generarComponenteCreate(crud.formCreate, nombreBase);
      console.log('componente create', createComponent);
      componentes.push(createComponent);
    }

    // Generar componente Edit
    if (crud.formEdit) {
      const editComponent = this.generarComponenteEdit(crud.formEdit, nombreBase);
      console.log('componente edit', editComponent);
      componentes.push(editComponent);
    }

    // Generar componente Lista
    if (crud.indexTable) {
      const listComponent = this.generarComponenteLista(crud.indexTable, nombreBase);
      console.log('componente edit', listComponent);
     
      componentes.push(listComponent);
    }

    // Generar componente Ver
    if (crud.showRegister) {
      console.log('componente view', crud.showRegister);
      const viewComponent = this.generarComponenteVer(crud.showRegister, nombreBase);
      componentes.push(viewComponent);
    }
    console.log('componentes', componentes);
    return componentes;
    } catch (error) {
      console.error('Error al generar componentes CRUD:', error);
      return [];
    }
  }

  private generarComponenteCreate(formData: { html: string; css: string }, nombreBase: string): GeneratedComponent {
    const nombreComponente = `${nombreBase}_create`;
    const parser = new DOMParser();
    const doc = parser.parseFromString(formData.html, 'text/html');
    const form = doc.querySelector('form');
    
    if (!form) {
      throw new Error('No se encontró un formulario en el HTML proporcionado');
    }

    const inputs = form.querySelectorAll('input, select, textarea');
    const propiedades = Array.from(inputs).map(input => {
      const name = input.getAttribute('name') || input.getAttribute('id') || '';
      const type = input.getAttribute('type') || 'string';
      return `  ${name}: ${this.getTipoTypeScript(type)};`;
    }).join('\n');

    const interfaz = this.generarInterfaz(nombreBase, propiedades);
    const componente = this.generarComponenteForm(form, nombreComponente, inputs, false);
    const servicio = this.generarServicio(nombreBase);

    return {
      html: formData.html,
      css: formData.css,
      ts: componente,
      service: servicio,
      interface: interfaz,
      nombre: nombreComponente,
      nombreClaseComponent: `${nombreBase}CreateComponent`,
      ruta: { path: `create`, component: `${nombreBase}CreateComponent` },
      nombre_archivo_ts: `${nombreComponente}.component.ts`,
      nombre_archivo_css: `${nombreComponente}.component.css`,
      nombre_archivo_html: `${nombreComponente}.component.html`,
      nombre_Clase_Service: `${nombreBase}Service`,
      nombre_archivo_service: `${nombreBase}.service.ts`,
      nombre_archivo_interface: `${nombreBase}.interface.ts`,
      componente: true,
      ruta_componente: `/${nombreBase}/create`
    };
  }

  private generarComponenteEdit(formData: { html: string; css: string }, nombreBase: string): GeneratedComponent {
    const nombreComponente = `${nombreBase}_edit`;
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
      interface: '',
      nombre: nombreComponente,
      nombreClaseComponent: `${nombreBase}EditComponent`,
      ruta: { path: `edit/:id`, component: `${nombreBase}EditComponent` },
      nombre_archivo_ts: `${nombreComponente}.component.ts`,
      nombre_archivo_css: `${nombreComponente}.component.css`,
      nombre_archivo_html: `${nombreComponente}.component.html`,
      nombre_Clase_Service: `${nombreBase}Service`,
      nombre_archivo_service: `${nombreBase}.service.ts`,
      nombre_archivo_interface: `${nombreBase}.interface.ts`,
      componente: true,
      ruta_componente: `/${nombreBase}/edit/:id`
    };
  }

  private generarComponenteLista(tableData: { html: string; css: string }, nombreBase: string): GeneratedComponent {
    const nombreComponente = `${nombreBase}_list`;
    const parser = new DOMParser();
    const doc = parser.parseFromString(tableData.html, 'text/html');
    const table = doc.querySelector('table');
    
    if (!table) {
      throw new Error('No se encontró una tabla en el HTML proporcionado');
    }

    const componente = this.generarComponenteListaTS(table, nombreComponente);

    return {
      html: tableData.html,
      css: tableData.css,
      ts: componente,
      service: '',
      interface: '',
      nombre: nombreComponente,
      nombreClaseComponent: `${nombreBase}ListComponent`,
      ruta: { path: ``, component: `${nombreBase}ListComponent` },
      nombre_archivo_ts: `${nombreComponente}.component.ts`,
      nombre_archivo_css: `${nombreComponente}.component.css`,
      nombre_archivo_html: `${nombreComponente}.component.html`,
      nombre_Clase_Service: `${nombreBase}Service`,
      nombre_archivo_service: `${nombreBase}.service.ts`,
      nombre_archivo_interface: `${nombreBase}.interface.ts`,
      componente: true,
      ruta_componente: `/${nombreBase}`
    };
  }

  private generarComponenteVer(viewData: { html: string; css: string }, nombreBase: string): GeneratedComponent {
    const nombreComponente = `${nombreBase}_view`;
    const parser = new DOMParser();
    const doc = parser.parseFromString(viewData.html, 'text/html');
    const viewElement = doc.querySelector('div');
    
    if (!viewElement) {
      throw new Error('No se encontró el elemento de vista en el HTML proporcionado');
    }

    const componente = this.generarComponenteVerTS(viewElement, nombreComponente);

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
    switch(type.toLowerCase()) {
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

  private generarComponenteForm(form: HTMLFormElement, nombreComponente: string, inputs: NodeListOf<Element>, isEdit: boolean): string {
    const propiedades = Array.from(inputs).map(input => {
      const name = input.getAttribute('name') || input.getAttribute('id') || '';
      return `  ${name}: FormControl = new FormControl('');`;
    }).join('\n');

    const template = form.outerHTML
      .replace(/ngModel/g, 'formControlName')
      .replace(/\(click\)/g, '(click)');

    const routeParams = isEdit ? `\n  private route = inject(ActivatedRoute);` : '';
    const routeImports = isEdit ? `\nimport { ActivatedRoute } from '@angular/router';` : '';

    return `import { Component, OnInit, Input, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ${nombreComponente.split('_')[0]}Service } from './${nombreComponente.split('_')[0].toLowerCase()}.service';
import { I${nombreComponente.split('_')[0]} } from './${nombreComponente.split('_')[0].toLowerCase()}.interface';${routeImports}

@Component({
  selector: 'app-${nombreComponente.toLowerCase()}',
  template: \`
${template}
  \`,
  styleUrls: ['./${nombreComponente.toLowerCase()}.component.css']
})
export class ${nombreComponente.split('_')[0]}${isEdit ? 'Edit' : 'Create'}Component implements OnInit {
  formulario: FormGroup;
  modoEdicion: boolean = ${isEdit};${routeParams}

${propiedades}

  constructor(
    private fb: FormBuilder,
    private ${nombreComponente.split('_')[0].toLowerCase()}Service: ${nombreComponente.split('_')[0]}Service
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
        this.${nombreComponente.split('_')[0].toLowerCase()}Service.obtenerPorId(id).subscribe(
          (data: I${nombreComponente.split('_')[0]}) => {
            this.formulario.patchValue(data);
          }
        );
      }
    });` : ''}
  }

  onSubmit(): void {
    if (this.formulario.valid) {
      const datos: I${nombreComponente.split('_')[0]} = {
        ...this.formulario.value,
        id: ${isEdit ? 'this.route.snapshot.params["id"]' : 'this.generarId()'}
      };

      if (this.modoEdicion) {
        this.${nombreComponente.split('_')[0].toLowerCase()}Service.actualizar(datos).subscribe(
          response => {
            console.log('Datos actualizados exitosamente', response);
          },
          error => {
            console.error('Error al actualizar datos', error);
          }
        );
      } else {
        this.${nombreComponente.split('_')[0].toLowerCase()}Service.crear(datos).subscribe(
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
    const nombreBase = nombreComponente.split('_')[0];
    return `import { Component, OnInit } from '@angular/core';
import { ${nombreBase}Service } from './${nombreBase.toLowerCase()}.service';
import { I${nombreBase} } from './${nombreBase.toLowerCase()}.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-${nombreComponente.toLowerCase()}',
  templateUrl: './${nombreComponente.toLowerCase()}.component.html',
  styleUrls: ['./${nombreComponente.toLowerCase()}.component.css']
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
    this.router.navigate(['/${nombreBase.toLowerCase()}/create']);
  }
}`;
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
import { I${nombreBase} } from './${nombreBase.toLowerCase()}.interface';

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