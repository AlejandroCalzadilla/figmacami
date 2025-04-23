import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../interfaces/User';
import { AuthStatus } from '../interfaces/AuthStatus';
import { LoginResponse } from '../interfaces/login-response.interface';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { CheckTokenResponse } from '../interfaces/check-token.response';
import { RegisterForm } from '../interfaces/register';

@Injectable({
    providedIn:'root'
})

export class AuthService {
private readonly baseUrl: string = environment.baseUrl;
  private http = inject( HttpClient );

  private _currentUser = signal<User|null>(null);
  private _authStatus = signal<AuthStatus>( AuthStatus.checking );
  public currentUser = computed( () => this._currentUser() );
  public authStatus = computed( () => this._authStatus() );


  constructor() {
    //this.checkAuthStatus().subscribe();
  }

  private setAuthentication(id: string, token:string): boolean {

    localStorage.setItem('token', token);
    localStorage.setItem('userId',id );
    return true;
  }

  login( email: string, password: string ): Observable<boolean> {
    console.log("loginnservicee");
    const url  = `${ this.baseUrl }/api/auth/login`;
    const body = { email, password };
    return this.http.post<any>( url, body )
      .pipe(
        map( ({ id, token }) => this.setAuthentication( id, token )),
      );
  }


  public register( formData: RegisterForm ): Observable<any> {
    const url = `${ this.baseUrl }/api/auth/register`;
    return this.http.post<any>( url, formData )
      .pipe(
        map( ({ id, token }) => this.setAuthentication( id, token )),
        catchError( err => {
          console.log(err);
          return throwError(() => new Error('Error en el registro'));
        })
      );
  }  


  

  logout() {
    localStorage.removeItem('token');
    this._currentUser.set(null);
    this._authStatus.set( AuthStatus.notAuthenticated );
  }
    
}