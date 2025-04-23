import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-formulario',
  templateUrl: './crud_create.component.html',
  styleUrls: ['./crud_create.component.css'],
  imports: [ReactiveFormsModule]
})
export class FormularioComponent implements OnInit {
  @Input() mode: 'create' | 'edit' = 'create'; // Diferenciar entre "Create" y "Edit"
  @Input() initialData: any = {}; // Datos iniciales para el modo "Edit"
  formulario: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formulario = this.fb.group({});
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    // Campos base del formulario
    this.formulario = this.fb.group({
      name: [this.initialData.name || '', Validators.required],
      email: [this.initialData.email || '', [Validators.required, Validators.email]],
      password: [this.initialData.password || '', Validators.required],
      gender: [this.initialData.gender || '', Validators.required],
      preference: this.fb.array(this.initialData.preference || []),
      marital_status: [this.initialData.marital_status || '', Validators.required],
      message: [this.initialData.message || '']
    });
  }

  // Método para agregar dinámicamente nuevos campos al formulario
  addField(fieldName: string, value: any = '', validators: any[] = []): void {
    this.formulario.addControl(fieldName, this.fb.control(value, validators));
  }

  // Método para manejar el envío del formulario
  onSubmit(): void {
    if (this.formulario.valid) {
      console.log('Formulario enviado:', this.formulario.value);
    } else {
      console.error('Formulario inválido');
    }
  }

  // Getter para manejar preferencias como FormArray
  get preferences(): FormArray {
    return this.formulario.get('preference') as FormArray;
  }

  // Agregar o quitar preferencias dinámicamente
  togglePreference(value: string): void {
    const index = this.preferences.value.indexOf(value);
    if (index === -1) {
      this.preferences.push(this.fb.control(value));
    } else {
      this.preferences.removeAt(index);
    }
  }
}