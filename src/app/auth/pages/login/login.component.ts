import { Component, inject } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink, RouterOutlet } from "@angular/router";

@Component({
 
    selector: 'app-login',
    templateUrl: './login.component.html',
    imports: [
        FormsModule,
        RouterLink,
    
    ],
})

export class LoginComponent {   
    email: string = '';
    password: string = '';
  
    private router      = inject( Router )
    private loginService= inject(AuthService);

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