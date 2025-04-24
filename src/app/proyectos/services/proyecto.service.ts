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


 findAll( userid:string): Observable<Proyecto[]> {
    const url  = `${ this.baseUrl }/api/proyecto/user/${ userid }`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${ token }`);
    return this.http.get<Proyecto[]>( url,{headers} );
     
  }

  create( proyecto: Proyecto ): Observable<Proyecto> {
    const url  = `${ this.baseUrl }/api/proyecto`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${ token }`);
    return this.http.post<Proyecto>( url, proyecto, {headers} );
  }


  findById( id: string ): Observable<Proyecto> {
    const url  = `${ this.baseUrl }/api/proyecto/${ id }`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${ token }`);
    return this.http.get<Proyecto>( url, {headers} );
  }


  UpdateData(id: string, data: string): Observable<Proyecto> {
    const url = `${this.baseUrl}/api/proyecto/nodes?id=${id}`; // URL de la API para actualizar el proyecto
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)   
    const body = { data }; // El cuerpo de la solicitud
    
    return this.http.patch<Proyecto>(url, body, { headers });
  }

  delete( id: string ): Observable<void> {
    const url  = `${ this.baseUrl }/api/proyecto/${ id }`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${ token }`);
    return this.http.delete<void>( url, {headers} );

  }


}