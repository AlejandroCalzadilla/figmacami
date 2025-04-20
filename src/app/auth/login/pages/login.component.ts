import { Component, inject } from "@angular/core";
import { LoginService } from "../services/login.service";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink, RouterOutlet } from "@angular/router";

@Component({
 
    selector: 'app-login',
    templateUrl: './login.component.html',
    imports: [
        FormsModule,
      

       
    ],
})

export class LoginComponent {   
    email: string = '';
    password: string = '';
  
    private router      = inject( Router )
    private loginService= inject(LoginService);

    login(){
        this.loginService.login(this.email, this.password)
        .subscribe( resp => {
            if( resp === true) {
                this.router.navigateByUrl('/proyectos');
            }
            console.log("respuesta del login",resp);
        }, err => {
            console.log(err);
        });
    }
      

}