import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GistService {
  private apiUrl = 'https://api.github.com/gists';

  constructor(private http: HttpClient) {}

  createGistFlutterCode(token: string, code: string, description: string = 'Código Flutter para DartPad'): Observable<any> {
    const body = {
      description,
      public: true,
      files: {
        'main.dart': {
          content: code
        }
      }
    };
    const headers = new HttpHeaders({
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    });
    return this.http.post(this.apiUrl, body, { headers });
  }
 
  setGistId(gistId: string): void {
    localStorage.setItem('gistId', gistId); 
    }
   

}
