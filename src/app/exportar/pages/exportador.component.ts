import { Component, inject } from "@angular/core";
import { ExportadorService } from "../services/exportador.service";
import { sidebarTs } from "../services/commponente/component_ts";
import { sidebarHtml } from "../services/commponente/component_html";
import { sidebarCss } from "../services/commponente/component_style";

@Component({

  selector: 'app-exportador',
  templateUrl: './exportador.component.html',

})

export default class ExportadorComponent{
   
   exportador=inject(ExportadorService);



   exportar(){
       // this.exportador.generateProjectWithSidebar('sidebar', sidebarTs,sidebarHtml,sidebarCss);
   }


}