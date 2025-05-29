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
 
  ai = new GoogleGenAI({ apiKey: environment.key });

  async textToImage(file: File): Promise<string> {
    const image = await this.ai.files.upload({ file });

  /*   const prompt = `
Eres un asistente especializado en convertir interfaces móviles (imágenes o bocetos) en código HTML + CSS. Cuando recibas una imagen:

1. Analiza la composición y genera un archivo HTML que incluya todos los elementos detectados (contenedores, imágenes, iconos, textos, botones, etc.).
2. Emplea CSS inline (atributo \`style\` en las mismas etiquetas HTML) para cada elemento.
3. Diseña el CSS pensando exclusivamente en móviles:
   - Establece un \`min-width\` de 375px para el contenedor principal.
   - Usa unidades relativas (%, rem, vh/vw) cuando sea posible, pero asegura que el ancho mínimo no baje de 375px.
   - Incluye reglas de \`overflow\` (\`overflow-x\` o \`overflow-y\`) en contenedores que puedan desbordarse para garantizar scroll donde haga falta.
4. Para cada elemento gráfico (imágenes, dibujos, iconos):
   - Inserta un placeholder HTML: \`<img src="placeholder.png" width="XXX" height="YYY" alt="…">\` con las dimensiones exactas que mide en el diseño original.
   - Si se trata de un icono, utiliza un componente genérico: \`<svg class="icon-placeholder" width="XX" height="YY"></svg>\` con las mismas dimensiones.
5. Preserva las proporciones, márgenes y paddings tal como aparecen en el mockup, traduciendo pixel a pixel.
6. Garantiza que el resultado sea autocontenible: un único archivo .html con todo el CSS en atributos \`style\`, sin dependencias externas.
7. Al final, devuelve únicamente el bloque de código completo entre \`<html>…</html>\`, sin comentarios ni explicaciones adicionales.
`; */


    const response = await this.ai.models.generateContent({
      model: "gemini-2.0-flash",
       
      
      
      contents: [
        createUserContent([
          createPartFromUri(image.uri!, image.mimeType!),

        ]),
      ],
      config: {
        systemInstruction: `
Eres un experto convertidor de diseños móviles a HTML/CSS inline. Transforma imágenes de interfaces (apps, webs móviles) a código limpio y responsive siguiendo estas reglas:
1. ESTRUCTURA
- HTML semántico (header, main, button)
- CSS 100% inline (solo atributos style)
- Viewport móvil: <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
2. MOBILE-FIRST
- Ancho mínimo: 375px
- Botones de 44x44px mínimo
- Sin hover, solo :active
3. PLACEHOLDERS
- Imágenes: <div style="width:[W]px; height:[H]px; background:linear-gradient(...)">
- Iconos: SVG básico (<circle cx="12" cy="12" r="10" fill="#9E9E9E">)
4.ANTI-OVERFLOW
- overflow-x:hidden en contenedores
- Texto: white-space:nowrap; text-overflow:ellipsis
5.COMPONENTES BASE
Header sticky:
<header style="position:sticky; top:0; height:56px; display:flex; align-items:center; background:white; box-shadow:0 2px 4px rgba(0,0,0,0.1);">
6.BUENAS PRÁCTICAS
- Usa Flexbox/Grid
- Código auto-contenido (0 dependencias)
- Fidelidad pixel-perfect al diseño
 IMPORTANTE:
- Prioriza diseño sobre funcionalidad
- 0 scroll horizontal
- Placeholders mantienen dimensiones originales
- Usa los estilos del ejemplo como base
`,
      
      },
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


  async textoAHtmlFlutter(html: string, css: string): Promise<files> {
    // Generar un nombre de componente aleatorio
    const randomStr = Math.random().toString(36).substring(2, 10);
    const componentName = `Component${randomStr}`;

    const prompt = `
Objetivo:
Convertir código HTML,CSS a Flutter 3 (Dart) usando nombre de clase específico y previniendo errores comunes.
nstrucciones Técnicas:
1.Estructura Base:
\`\`\`dart
class [${componentName}] extends StatelessWidget {
  const [${componentName}]({super.key}); 
  @override
  Widget build(BuildContext context) {
    return // Widget raíz con prevención de overflow
  }
}
\`\`\`
- Reemplazar \`[${componentName}]\` por el nombre proporcionado
- Usar \`SingleChildScrollView\` como widget raíz para prevenir overflow vertical
2. **Mapeo de Elementos (HTML → Flutter):**
| HTML          | Flutter 3 (Dart)                                                                 |
|---------------|----------------------------------------------------------------------------------|
| \`<div>\`       | \`Container\`, \`SizedBox\` o \`Padding\` con restricciones de tamaño                  |
| \`<h1>-<h6>\`   | \`Text()\` con \`Theme.of(context).textTheme.headlineX\`                         |
| \`<p>\`         | \`Expanded(child: Text(..., overflow: TextOverflow.ellipsis))\`                  |
| \`<img>\`       | \`Image.network()\` con \`BoxFit.cover\` Y dimensiones fijas (\`width\`/\`height\`) |
| \`<button>\`    | \`ElevatedButton(onPressed: (){...})\`                                           |
| \`<ul>/<ol>\`   | \`ListView.builder(shrinkWrap: true, physics: NeverScrollableScrollPhysics())\`  |
3.Prevención de Errores (CRÍTICO):
a) OVERFLOW:
   - Todo \`Text\` dentro de \`Column\`/\`Row\` → Envolver en \`Expanded\` o \`Flexible\`
   - Contenido vertical extenso → \`SingleChildScrollView(scrollDirection: Axis.vertical)\`
   - Elementos horizontales → \`ListView(scrollDirection: Axis.horizontal)\`
b) **RESTRICCIONES DE TAMAÑO:**
   - Imágenes: Siempre especificar \`width\` y \`height\`
   - Contenedores: Usar \`ConstrainedBox\` con \`maxHeight\`/\`maxWidth\` cuando sea necesario
c) **NULL SAFETY (Flutter 3):**
   - Todos parámetros requeridos usar \`required\`
   - Widgets personalizados usar \`Key? key\` en constructor
4. **Buenas Prácticas:**
- Usar \`const\` para widgets estáticos
- Agrupar widgets complejos en componentes personalizados
- Textos largos siempre llevar \`overflow: TextOverflow.ellipsis\`
- Especificar \`BoxFit\` en todas las imágenes
5. Validaciones Requeridas:
Verificar que ningún widget hijo pueda expandirse ilimitadamente
Todos los textos en Column/Row envueltos en Expanded/Flexible
Imágenes tienen dimensiones explícitas o BoxFit definido
Formato de Respuesta:
\`\`\`dart
// Código Flutter 3 completo usando [${componentName}]
// Comentarios explicativos en puntos críticos
\`\`\`
Input:
HTML,CSS:
\`\`\`html
[${html}, ${css}]
`;
    const response = await this.ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        createUserContent([
          prompt,
        ]),
      ],
      config: {
        systemInstruction: 'Eres un programador experto en pasar codigo html css a flutter 3, no devuelvas mas que codigo flutter'
      }
    });
    let flutterCode = response.text ?? '';
    flutterCode = flutterCode.replace(/^```dart\s*/i, '').replace(/```\s*$/i, '');
    return {
      classname: componentName,
      content: flutterCode,
    };
  }


}






export interface files {
  classname: string;
  content: string;

}