import { GeneratedComponent } from "../../pizarra/interfaces/componente_angular";

export function addLinksToMenu(component: GeneratedComponent, links: string[]): void {
    if (component && component.links) {
      component.links.push(...links);
    } else {
      console.error('El componente no tiene un método setLinks.');
    }
  }

  export function assignLinksToMenuComponent(tsCode: string, links: string[]): string {
    // Convertir el array de links en un string de TypeScript
    const linksArrayString = JSON.stringify(links, null, 2);
  
    // Buscar la declaración de la propiedad `links` en el código TypeScript
    const updatedTsCode = tsCode.replace(
      'links: string[] = [];',
      `links: string[] = ${linksArrayString};`
    );
  
    return updatedTsCode;
  }  