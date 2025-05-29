import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class IframeDataService {
  private componentesSource = new BehaviorSubject<any[]>([]);
  componentes$ = this.componentesSource.asObservable();

  setComponentes(componentes: any[]) {
    this.componentesSource.next(componentes);
  }

  setGistId(gistId: string): void {
    localStorage.setItem('gistId', gistId); 
    }
}
