import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment.prod';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../interfaces/User';
import { AuthStatus } from '../interfaces/AuthStatus';
import { LoginResponse } from '../interfaces/login-response.interface';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { CheckTokenResponse } from '../interfaces/check-token.response';

@Injectable({
    providedIn:'root'
})

export class LoginService {
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

    //this._currentUser.set( user );
    //this._authStatus.set( AuthStatus.authenticated );

    //console.log("user",user);
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

  /* checkAuthStatus():Observable<boolean> {
    const url   = `${ this.baseUrl }/auth/check-token`;
    const token = localStorage.getItem('token');
    if ( !token ) {
      this.logout();
      return of(false);
    }
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${ token }`);
      return this.http.get<CheckTokenResponse>(url, { headers })
        .pipe(
          map( ({ user, token }) => this.setAuthentication( user, token )),
          catchError(() => {
            this._authStatus.set( AuthStatus.notAuthenticated );
            return of(false);
          })
        );

  } */

  logout() {
    localStorage.removeItem('token');
    this._currentUser.set(null);
    this._authStatus.set( AuthStatus.notAuthenticated );
  }
    
}