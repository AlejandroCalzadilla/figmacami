import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { RegisterForm } from '../../interfaces/register';
import { CommonModule } from "@angular/common";
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
   imports: [
    ReactiveFormsModule,
    CommonModule
   ],
})
export default class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  private authservice= inject(AuthService);
  private router      = inject( Router)
  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(2)]],
      lastName: ["", [Validators.required, Validators.minLength(2)]],
      userName: ["", [Validators.required, Validators.minLength(4)]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.registerForm.valid) {
        console.log("Formulario válido");
      const formData: RegisterForm = this.registerForm.value;
      this.authservice.register(formData).subscribe(
        (response:any) => {
            console.log("Registro exitoso:", response);
            this.router.navigateByUrl('/proyectos');
            
            // Aquí puedes redirigir al usuario a otra página o mostrar un mensaje de éxito
        },
        (error: any) => {
            console.error("Error en el registro:", error);
            // Aquí puedes mostrar un mensaje de error al usuario
            }
        );
      console.log("Formulario enviado:", formData);
    } else {
      console.error("Formulario inválido");
    }
  }
}