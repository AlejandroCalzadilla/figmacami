import { Injectable } from "@angular/core";
import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} from "@google/genai";
import { environment } from "../../environments/environment.prod";

@Injectable({
  providedIn: "root",
})

export class GeminiService {


  genIA: any;
  model: any;
  ai = new GoogleGenAI({ apiKey: environment.key });



  async textoAImagen(file: File): Promise<string> {
    const image = await this.ai.files.upload({
      file,
    });
    const prompt = `genera un html y css a partir de esta imagen,toma en cuenta lo siguiente:si
         no es nada con logica osea no es crud , genera el html y css sin mas ,si algo de un crud
         por ejemplo un create que pon la etiqueta form y los inputs necesarios y boton con el texto 
         crear si es edit pon la etiqueta form y los inputs necesarios y boton con el texto editar
          si es view pon su etiquetas  un boton con el texto volver si la vista de registros de debe haber una tabla
          con botones ver,editar,eliminar si no estan crealos,si ves contenido irrelevante o que no tiene sentido
          no lo generes, no devuelvas nada de lo que no es necesario, si ves un logo o algo que no tiene sentido no lo generes,
          solo devuelve codigo html y css, no devuelvas nada mas, no pongas comentarios ni nada de lo que no es necesario,
          el css sera mediante los index de las etiquetas
          `;
    console.log(image);
    const response = await this.ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        createUserContent([
          "genera un html y css a partir de esta imagen,toma en cuenta lo siguiente:si no es nada con logica osea no es crud , genera sin nada  ",
          createPartFromUri(image.uri!, image.mimeType!),
        ]),
      ],

    });

    console.log(response.text);
    return response.text ?? '';
  }

  async generacionTexto(texto: string, prompt: string) {
    const response = await this.ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        createUserContent([
          prompt, texto,
        ]),
      ],
    });

    // console.log(response.text);
    return response.text;
  }


  async generacionHtmlFlutter(texto: string) {
    const response = await this.ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        createUserContent([
          texto, `Genera código HTML que implemente Material Design 3 (como en Flutter) para mostrar la descripción que te proporcione. 
        Requisitos:
        1. Usa estilos en línea (inline styles) para replicar fielmente los componentes de Flutter/Material 3
        2. Incluye estos elementos de Flutter:
        - Layouts (Row, Column, Stack)
        - Widgets (Card, ListTile, Chip, etc.)
        - Inputs (TextField, Checkbox, etc.)
        - Navigation patterns
        - Material Design 3 componentes
        3. Características obligatorias:
        - No hacer responsive
        - Solo código esencial, sin comentarios
        - Estructura limpia y minimalista
        - Fidelidad al look & feel de Flutter
       4. Excluir:
       - Meta tags
       - CSS externo
       - JavaScript
      - Elementos no esenciales
      El HTML debe ser autónomo con todos los estilos en línea.`
        ]),
      ],
    });

    // console.log(response.text);
    return response.text;
  }

  async audioADescripcion(file: File): Promise<string> {
    // Subir el archivo de audio
    const audio = await this.ai.files.upload({ file });
    // Llamar a Gemini con el archivo
    const response = await this.ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        createUserContent([
          "Describe este audio", // Puedes personalizar el prompt
          createPartFromUri(audio.uri!, audio.mimeType!),
        ]),
      ],
    });
    return response.text ?? '';
  }

  async audioAHtmlFlutter(file: File): Promise<string> {
    // Subir el archivo de audio
    const audio = await this.ai.files.upload({ file });
    // Llamar a Gemini con el archivo y el prompt de Flutter
    const response = await this.ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        createUserContent([
          `Genera código HTML que implemente Material Design 3 (como en Flutter) para mostrar la descripción del audio que te proporciono.\nRequisitos:\n1. Usa estilos en línea (inline styles) para replicar fielmente los componentes de Flutter/Material 3\n2. Incluye estos elementos de Flutter:\n- Layouts (Row, Column, Stack)\n- Widgets (Card, ListTile, Chip, etc.)\n- Inputs (TextField, Checkbox, etc.)\n- Navigation patterns\n- Material Design 3 componentes\n3. Características obligatorias:\n- No hacer responsive\n- Solo código esencial, sin comentarios\n- Estructura limpia y minimalista\n- Fidelidad al look & feel de Flutter\n4. Excluir:\n- Meta tags\n- CSS externo\n- JavaScript\n- Elementos no esenciales\nEl HTML debe ser autónomo con todos los estilos en línea.`,
          createPartFromUri(audio.uri!, audio.mimeType!),
        ]),
      ],
    });
    return response.text ?? '';
  }

}