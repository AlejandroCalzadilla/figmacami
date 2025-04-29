import { inject, Injectable } from '@angular/core';
import { GeneratedComponent } from '../pizarra/interfaces/componente_angular';
import { CrudValidado } from '../pizarra/interfaces/crud.interface';
import { GeminiService } from './gemini.service';

@Injectable({
  providedIn: 'root'
})
export class ExportadorCrudService {
  propiedades!: string;
  interfaz!: string;
  propiedadesOriginales!: string;
  geminiService = inject(GeminiService);
  async generarComponentesCrud(crud: CrudValidado): Promise<GeneratedComponent[]> {
    try {
      let createComponent!: GeneratedComponent;
      const componentes: GeneratedComponent[] = [];
      const nombreBase = crud.nombre;
      if (crud.formCreate) {
        const data = await this.geminiService.generacionTexto(crud.formCreate.html, `devuelve un string de propiedades en typescript en base a este html,
          e las propiedades las encuentras en los label <label>propiedad</label>, no devuelva explicacion alguna solo el codigo
          no devuelvas interfaz eso yo lo ago , solo las propiedades con su tipo de dato y separadas por comas, no devuelvas nada mas, todo en español     
          `);
        this.interfaz = this.generarInterfaz(nombreBase, data!);
        createComponent = await this.generarComponenteCreate(crud.formCreate, nombreBase);
        componentes.push(createComponent);
      }

      // Generar componente Edit
      if (crud.formEdit) {
        const editComponent = this.generarComponenteEdit(crud.formEdit, nombreBase);
        editComponent.html = createComponent.html;
        componentes.push(editComponent);
      }
      if (crud.indexTable) {
        const listComponent = await this.generarComponenteLista(crud.indexTable, nombreBase);
        componentes.push(listComponent);
      }
      if (crud.showRegister) {
        const viewComponent = await this.generarComponenteVer(crud.showRegister, nombreBase);
        componentes.push(viewComponent);
      }
      return componentes;
    } catch (error) {
      console.error('Error al generar componentes CRUD:', error);
      return [];
    }
  }


  private generarInterfaz(nombreBase: string, propiedades: string): string {
    console.log(propiedades, 'que propiedades llegan a la interfaz');
    this.propiedades = propiedades;
    this.propiedadesOriginales = propiedades;
    return `export interface I${nombreBase} {
    id?: string;
    ${this.propiedades}
}`;
  }


  private async generarComponenteCreate(formData: { html: string; css: string }, nombreBase: string): Promise<GeneratedComponent> {
    const nombreComponente = `${nombreBase}`;
    const parser = new DOMParser();
    const doc = parser.parseFromString(formData.html, 'text/html');
    const form = doc.querySelector('form');

    if (!form) {
      throw new Error('No se encontró un formulario en el HTML proporcionado');
    }
    let datos = await this.geminiService.generacionTexto(formData.html, `devuelve un html en base a el siguiente html, es un formulario y quiero adaptarlo a angular con [formGroup]="formulario" y (ngSubmit)="crearoeditar()
       formControlName="propiedad" , estas son la propiedades ${this.propiedades} estas debes ponerlas en el formcontrolname formControlName="this.propiedades.propiedadn", estas propiedades en general van a  coincidir con el texto de los labels , <label> propiedad</label>
      no devuelvas explicacion alguna solo el html, no devuelvas nada mas, no quites los id que llegan con las etiquetas
       `) || '';
    datos = datos.replace(/^```html\s*|\s*```$/g, '');
    const interfaz = this.interfaz;
    const componente = this.generarComponenteFormReactivo(nombreComponente, false);
    const servicio = this.generarServicio(nombreBase);

    return {
      html: datos,
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
      ruta_componente: `./${nombreBase}/components/${nombreBase}_create/${nombreBase}_create.component`
    };
  }


  private generarComponenteEdit(formData: { html: string; css: string }, nombreBase: string): GeneratedComponent {
    const nombreComponente = `${nombreBase}`;
    const parser = new DOMParser();
    const doc = parser.parseFromString(formData.html, 'text/html');
    const form = doc.querySelector('form');
    if (!form) {
      throw new Error('No se encontró un formulario en el HTML proporcionado');
    }
    const inputs = form.querySelectorAll('input, select, textarea');
    const componente = this.generarComponenteFormReactivoEdit(form, nombreComponente, inputs, true);
    return {
      html: "",
      css: formData.css,
      ts: componente,
      nombre: nombreComponente,
      nombreClaseComponent: `${nombreBase}EditComponent`,
      ruta: { path: `edit_${nombreBase}/:id`, component: `${nombreBase}EditComponent` },
      nombre_archivo_ts: `${nombreComponente}_edit.component.ts`,
      nombre_archivo_css: `${nombreComponente}_edit.component.css`,
      nombre_archivo_html: `${nombreComponente}_edit.component.html`,
      nombre_Clase_Service: `${nombreBase}Service`,
      nombre_archivo_service: `${nombreBase}.service.ts`,
      nombre_archivo_interface: `${nombreBase}.interface.ts`,
      componente: true,
      form: 'edit',
      ruta_componente: `./${nombreBase}/components/${nombreBase}_edit/${nombreBase}_edit.component`
    };
  }

  private async generarComponenteLista(tableData: { html: string; css: string }, nombreBase: string): Promise<GeneratedComponent> {
    const nombreComponente = `${nombreBase}`;

    // Extraer la tabla manualmente del string
    const tableMatch = tableData.html.match(/<table[\s\S]*?<\/table>/i);
    if (!tableMatch) {
      throw new Error('No se encontró una tabla en el HTML proporcionado');
    }
    const tablaOriginalHtml = tableMatch[0]; // tabla encontrada como string
    const tablaModificada = await this.modificarTablaHtml(tablaOriginalHtml);
    // Reemplazar en el HTML la tabla original por la tabla modificada
    const html = tableData.html.replace(tablaOriginalHtml, tablaModificada);
    const componente = this.generarComponenteListaTS(tablaOriginalHtml as unknown as HTMLTableElement, nombreComponente);
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
  }


  private async modificarTablaHtml(html: string): Promise<string> {
    let data = await this.geminiService.generacionTexto(html, `devuelve un
       html en base a el siguiente html, es una tabla y quiero adaptarlo a  angular con *ngFor="let registro of registros",
       revisa los <th>  para sabe que  poner en los <td> los th deberian tener alguna de estas propiedades ${this.propiedades} , agrega a los td {{registro.propiedad}}
      no devuelvas explicacion alguna solo el html, no devuelvas nada mas, no quites los id que llegan con las etiquetas, llegara con tres botones editar, eliminar y ver asingales 
      click()="verRegistro(registro.id)" y click="editarRegistro(registro.id!)" y click="eliminarRegistro(registro.id!)", si no hay un boton de crear agregalo y pon click="crearNuevo()"
    `) || '';
    data = data.replace(/^```html\s*|\s*```$/g, '');
    return data;
  }

  private generarComponenteFormReactivo(
    nombreComponente: string,
    isEdit: boolean
  ): string {

    const routeParams = isEdit ? `\n  private route = inject(ActivatedRoute);` : '';
    const routeImports = isEdit ? `\nimport { ActivatedRoute } from '@angular/router';` : '';


    // Extraer los nombres de las propiedades de this.propiedades
    const propiedades = this.propiedades.split(',')
      .map(line => line.trim())
      .filter(line => line)
      .map(line => {
        const [nombre, tipo] = line.split(':').map(part => part.trim());
        return { nombre, tipo };
      });

    return `import { Component, OnInit, inject } from '@angular/core';
  import { FormBuilder, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
  import { ${nombreComponente}Service } from './../../services/${nombreComponente}.service';
  import { CommonModule } from '@angular/common';
  import { Router } from '@angular/router';
  
  import { I${nombreComponente} } from './../../interfaces/${nombreComponente}.interface';${routeImports}
  
  @Component({
    selector: 'app-${nombreComponente.toLowerCase()}',
    templateUrl: './${nombreComponente}_create.component.html',
    styleUrls: ['./${nombreComponente}_create.component.css'],
    imports: [ReactiveFormsModule, CommonModule]
  })
  export class ${nombreComponente}${isEdit ? 'Edit' : 'Create'}Component implements OnInit {
    formulario: FormGroup;
    modoEdicion: boolean = ${isEdit};
    ${routeParams}
  
    constructor(
      private fb: FormBuilder,
      private ${nombreComponente.toLowerCase()}Service: ${nombreComponente}Service,
      private router: Router
    ) {
     this.formulario = this.fb.group({
  ${propiedades.map(prop => `
    ${prop.nombre}: [''${prop.tipo !== 'string' ? ', Validators.required' : ''}]
  `).join(',\n')}
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
              this.router.navigate(['/index_${nombreComponente.toLowerCase()}']);
              console.log('Datos actualizados exitosamente', response);
            },
            error => {
              console.error('Error al actualizar datos', error);
            }
          );
        } else {
          this.${nombreComponente.toLowerCase()}Service.crear(datos).subscribe(
            response => {
              this.router.navigate(['/index_${nombreComponente.toLowerCase()}']);
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


  private generarComponenteFormReactivoEdit(
    form: HTMLFormElement,
    nombreComponente: string,
    inputs: NodeListOf<Element>,
    isEdit: boolean
  ): string {

    const routeParams = isEdit ? `\n  private route = inject(ActivatedRoute);` : '';
    const routeImports = isEdit ? `\nimport { ActivatedRoute } from '@angular/router';` : '';

    // Extraer los nombres de las propiedades de this.propiedades
    const propiedades = this.propiedades.split(',')
      .map(line => line.trim())
      .filter(line => line)
      .map(line => {
        const [nombre, tipo] = line.split(':').map(part => part.trim());
        return { nombre, tipo };
      });

    return `import { Component, OnInit, inject } from '@angular/core';
  import { FormBuilder, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
  import { ${nombreComponente}Service } from './../../services/${nombreComponente}.service';
  import { CommonModule } from '@angular/common';
  import { Router } from '@angular/router';
  import { I${nombreComponente} } from './../../interfaces/${nombreComponente}.interface';${routeImports}
  
  @Component({
    selector: 'app-${nombreComponente.toLowerCase()}',
    templateUrl: './${nombreComponente}_edit.component.html',
    styleUrls: ['./${nombreComponente}_edit.component.css'],
    imports: [ReactiveFormsModule, CommonModule]
  })
  export class ${nombreComponente}${isEdit ? 'Edit' : 'Create'}Component implements OnInit {
    formulario: FormGroup;
    modoEdicion: boolean = ${isEdit};
    ${routeParams}
  
    constructor(
      private fb: FormBuilder,
      private ${nombreComponente.toLowerCase()}Service: ${nombreComponente}Service,
       private router: Router
    ) {
     this.formulario = this.fb.group({
  ${propiedades.map(prop => `
    ${prop.nombre}: [''${prop.tipo !== 'string' ? ', Validators.required' : ''}]
  `).join(',\n')}
});
    }
  
    ngOnInit(): void {
      ${isEdit ? `this.route.params.subscribe(params => {
        const id = params['id'];
        if (id) {
          this.${nombreComponente.toLowerCase()}Service.obtenerPorId(id).subscribe(
             (data: I${nombreComponente}) => {
              this.formulario.patchValue(data); // Cargar los datos al formulario
            },
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
              this.router.navigate(['/index_${nombreComponente.toLowerCase()}']);
              console.log('Datos actualizados exitosamente', response);
            },
            error => {
              console.error('Error al actualizar datos', error);
            }
          );
        } else {
          this.${nombreComponente.toLowerCase()}Service.crear(datos).subscribe(
            response => {
             this.router.navigate(['/index_${nombreComponente.toLowerCase()}']);
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
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-${nombreComponente.toLowerCase()}_page',
  templateUrl: './${nombreComponente.toLowerCase()}_page.component.html',
  styleUrls: ['./${nombreComponente.toLowerCase()}_page.component.css'],
  imports: [CommonModule]
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
    this.router.navigate(['/view_${nombreBase.toLowerCase()}', id]);
  }

  editarRegistro(id: string): void {
    this.router.navigate(['/edit_${nombreBase.toLowerCase()}', id]);
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
    this.router.navigate(['create_${nombreBase.toLowerCase()}']);
  }
}`;
  }

  private async generarComponenteVer(viewData: { html: string; css: string }, nombreBase: string): Promise<GeneratedComponent> {
    const nombreComponente = `${nombreBase}`;
    const parser = new DOMParser();
    const doc = parser.parseFromString(viewData.html, 'text/html');
    const viewElement = doc.querySelector('div');

    if (!viewElement) {
      throw new Error('No se encontró el elemento de vista en el HTML proporcionado');
    }

    const componente = this.generarComponenteVerTS(viewElement, nombreComponente);
    const data: string = await this.generarHtmlVer(viewData, nombreBase)
    // console.log(viewData.html, 'html de vista')
    return {
      html: data,
      css: viewData.css,
      ts: componente,
      nombre: nombreComponente,
      nombreClaseComponent: `${nombreBase}viewComponent`,
      ruta: { path: `view_${nombreBase}/:id`, component: `${nombreBase}ViewComponent` },
      nombre_archivo_ts: `${nombreComponente}_view.component.ts`,
      nombre_archivo_css: `${nombreComponente}_view.component.css`,
      nombre_archivo_html: `${nombreComponente}_view.component.html`,
      nombre_Clase_Service: `${nombreBase}Service`,
      nombre_archivo_service: `${nombreBase}.service.ts`,
      nombre_archivo_interface: `${nombreBase}.interface.ts`,
      componente: true,
      form: 'view',
      ruta_componente: `./${nombreBase}/components/${nombreBase}_view/${nombreBase}_view.component`
    };
  }

  private generarComponenteVerTS(viewElement: HTMLElement, nombreComponente: string): string {
    const nombreBase = nombreComponente;
    return `import { Component, OnInit } from '@angular/core';
import { ${nombreBase}Service } from './../../services/${nombreBase.toLowerCase()}.service';
import { I${nombreBase} } from './../../interfaces/${nombreBase.toLowerCase()}.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-${nombreComponente.toLowerCase()}',
  templateUrl: './${nombreComponente.toLowerCase()}_view.component.html',
  styleUrls: ['./${nombreComponente.toLowerCase()}_view.component.css'],
  imports: [CommonModule]
})
export class ${nombreBase}viewComponent implements OnInit {
  registro!: I${nombreBase};

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
    this.router.navigate(['/index_${nombreBase.toLowerCase()}']);
  }

  editar(): void {
    if (this.registro?.id) {
      this.router.navigate(['/${nombreBase.toLowerCase()}/edit', this.registro.id]);
    }
  }
}`;
  }


  private async generarHtmlVer(viewData: { html: string; css: string }, nombreBase: string): Promise<string> {
    let data = await this.geminiService.generacionTexto(viewData.html, `devuelve un html en base a el siguiente html, es una vista de un registro,
       busca palabras parecidadas ${this.propiedades} y usa codigo angular para mostrar los datos {{registro.propiedad}},
       no devuelvas explicacion alguna solo el html,no quites los id que llegan con las etiquetas, no devuelvas nada mas, no devuelvas 
    `) || '';
    data = data.replace(/^```html\s*|\s*```$/g, '');
    return data;
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