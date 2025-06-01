import { Injectable } from "@angular/core";
import saveAs from "file-saver";
import { environment } from "../../../../environments/environment.prod";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { files } from "./gemini.service"


@Injectable({
  providedIn: 'root'
})
export class ExportadorFlutterService{

  private readonly baseUrl: string = environment.baseUrl;
  constructor(private http: HttpClient) {}

  descargarZipFlutter(): void {
    const url = `${this.baseUrl}/api/genericoflutter/zip`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get(url, { headers, responseType: 'blob' }).subscribe(blob => {
      saveAs(blob, 'generico_fluuter.zip');
    });
  }

  crearArchivosYDescargarZipFlutter(componentes:files[]): void {
    const url = `${this.baseUrl}/api/genericoflutter/create-files-zip`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    console.log('Payload enviado al backend:', { files: componentes });
    this.http.post(url,{files:componentes }  , { headers, responseType: 'blob' }).subscribe(blob => {
      console.log('Respuesta del backend:', blob);
      saveAs(blob, 'generico_fluuter.zip');
    });
  }

}




