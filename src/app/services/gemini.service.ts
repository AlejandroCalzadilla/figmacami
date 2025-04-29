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

    

      async textoAImagen(file: File) {
        const image = await this.ai.files.upload({
          file,
        });

        console.log(image);
        const response = await this.ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: [
            createUserContent([
              "Generate clean and responsive HTML code using Tailwind CSS based on the layout in the image. The image contains a large outer element that represents the full screen. Inside this element, there is the content of a complete HTML page. Use semantic HTML where appropriate and structure the layout using Tailwind utility classes. Focus on replicating the structure and visual arrangement shown in the image without adding extra functionality",
               createPartFromUri(image.uri!, image.mimeType!),
            ]),
          ],
          
        });

        console.log(response.text);
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