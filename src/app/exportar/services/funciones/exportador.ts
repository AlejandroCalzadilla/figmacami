import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExportadorAngularService {
  constructor() { }

  transformarHTMLaComponente(htmlString: string, nombreComponente: string): { componente: string, servicio: string, interfaz: string } {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
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

    const interfaz = this.generarInterfaz(nombreComponente, propiedades);
    const componente = this.generarComponente(form, nombreComponente, inputs);
    const servicio = this.generarServicio(nombreComponente);

    return {
      componente,
      servicio,
      interfaz
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

  private generarInterfaz(nombreComponente: string, propiedades: string): string {
    return `export interface I${nombreComponente} {
  id?: string;
${propiedades}
}`;
  }

  private generarComponente(form: HTMLFormElement, nombreComponente: string, inputs: NodeListOf<Element>): string {
    const propiedades = Array.from(inputs).map(input => {
      const name = input.getAttribute('name') || input.getAttribute('id') || '';
      return `  ${name}: FormControl = new FormControl('');`;
    }).join('\n');

    const template = form.outerHTML
      .replace(/ngModel/g, 'formControlName')
      .replace(/\(click\)/g, '(click)');

    return `import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ${nombreComponente}Service } from './${nombreComponente.toLowerCase()}.service';
import { I${nombreComponente} } from './${nombreComponente.toLowerCase()}.interface';

@Component({
  selector: 'app-${nombreComponente.toLowerCase()}',
  template: \`
${template}
  \`,
  styleUrls: ['./${nombreComponente.toLowerCase()}.component.css']
})
export class ${nombreComponente}Component implements OnInit {
  @Input() id?: string;
  formulario: FormGroup;
  modoEdicion: boolean = false;

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
    if (this.id) {
      this.modoEdicion = true;
      this.${nombreComponente.toLowerCase()}Service.obtenerPorId(this.id).subscribe(
        (data: I${nombreComponente}) => {
          this.formulario.patchValue(data);
        }
      );
    }
  }

  onSubmit(): void {
    if (this.formulario.valid) {
      const datos: I${nombreComponente} = {
        ...this.formulario.value,
        id: this.id || this.generarId()
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

  private generarServicio(nombreComponente: string): string {
    return `import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { I${nombreComponente} } from './${nombreComponente.toLowerCase()}.interface';

@Injectable({
  providedIn: 'root'
})
export class ${nombreComponente}Service {
  private readonly STORAGE_KEY = '${nombreComponente.toLowerCase()}_data';

  constructor() { }

  obtenerTodos(): Observable<I${nombreComponente}[]> {
    const datos = localStorage.getItem(this.STORAGE_KEY);
    return of(datos ? JSON.parse(datos) : []);
  }

  obtenerPorId(id: string): Observable<I${nombreComponente}> {
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

  crear(datos: I${nombreComponente}): Observable<I${nombreComponente}> {
    return new Observable(observer => {
      this.obtenerTodos().subscribe(items => {
        items.push(datos);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
        observer.next(datos);
        observer.complete();
      });
    });
  }

  actualizar(datos: I${nombreComponente}): Observable<I${nombreComponente}> {
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
