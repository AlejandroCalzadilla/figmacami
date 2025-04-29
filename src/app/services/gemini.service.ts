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

    

      async textoAImagen(file: File): Promise<string>{
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

      async generacionTexto(texto: string,prompt:string) {
        const response = await this.ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: [
            createUserContent([
              prompt,texto,
            ]),
          ],
        });

       // console.log(response.text);
       return response.text; 
     }


}