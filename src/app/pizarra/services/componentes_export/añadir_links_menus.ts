import { GeneratedComponent } from "../../interfaces/componente_angular";

export function addLinksToMenu(component: GeneratedComponent, links: string[]): void {
    if (component && component.links) {
      component.links.push(...links);
    } else {
      console.error('El componente no tiene un método setLinks.');
    }
  }