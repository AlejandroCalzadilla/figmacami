import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.prod";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Proyecto } from "../interfaces/proyecto";

@Injectable({

     providedIn: 'root'
})
export class ProyectoService {
     

private readonly baseUrl: string = environment.baseUrl;
  private http = inject( HttpClient );


 findAll( ): Observable<Proyecto[]> {
    const url  = `${ this.baseUrl }/api/proyecto`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${ token }`);
    return this.http.get<Proyecto[]>( url,{headers} );
     
  }






}