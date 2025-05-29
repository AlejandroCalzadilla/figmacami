import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { IframeDataService } from '../services/movil/iframe-data.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: "app-pruebas-web",
  template: `
    <iframe 
      #myIframe
      [src]="iframeSrc"
      style="width: 100%; height: 100vh; border: 0;"
    ></iframe>
  `
})
export default class PruebasWebComponent  {
  componentes: any[] = [];
  @ViewChild('myIframe', { static: true }) myIframe!: ElementRef;
  iframeSrc: SafeResourceUrl = '';

  constructor(private iframeDataService: IframeDataService, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    // Obtener el gistId de localStorage
    const gistId = localStorage.getItem('gistId');
    let url = '';
    if (gistId) {
      url = `https://dartpad.dev/embed-flutter.html?id=${gistId}&theme=dark`;
    } else {
      url = 'https://dartpad.dev/embed-flutter.html?theme=light';
    }
    this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.iframeDataService.componentes$.subscribe(data => {
      this.componentes = data;
    });
  } 
}