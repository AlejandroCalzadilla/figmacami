import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { IframeDataService } from '../../services/iframe-data.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-pruebas-web",
  template: `
    <nav class="bg-gray-800 p-4">
      <span class="text-white bg-blue-600 rounded-sm p-3 m-2">
        <a class="text-white" [routerLink]="['/pizarraflutter', idpizarra]">Volver a la pizarra</a>
      </span>
</nav>
    
    <iframe 
      #myIframe
      [src]="iframeSrc"
      style="width: 100%; height: 100vh; border: 0;"
    ></iframe>
  `,
  imports:[
    RouterLink
  ]
})
export default class PruebasWebComponent  {
  componentes: any[] = [];
  @ViewChild('myIframe', { static: true }) myIframe!: ElementRef;
  iframeSrc: SafeResourceUrl = '';
   public  idpizarra: string = '0'; // ID de la pizarra, se puede cambiar según sea necesario
  constructor(private iframeDataService: IframeDataService, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    // Obtener el gistId de localStorage
    this.idpizarra = localStorage.getItem('pId') || '0';
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