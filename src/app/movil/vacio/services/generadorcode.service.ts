import { Injectable } from '@angular/core';

// Interfaz para representar un componente Flutter visual
export interface FlutterComponent {
  id: number;
  type: string;
  properties?: any;
  children?: FlutterComponent[];
  child?: FlutterComponent;
}

@Injectable({
  providedIn: 'root'
})
export class GeneradorCodeService {
  /**
   * Genera el código Dart a partir de la estructura de componentes
   */
  generateCode(components: FlutterComponent[]): string {
    let code = `import 'package:flutter/material.dart';\n\nclass GeneratedWidget extends StatelessWidget {\n  @override\n  Widget build(BuildContext context) {\n    return Scaffold(\n      body: SafeArea(\n        child: `;
    if (components.length === 0) {
      code += `Container(),`;
    } else if (components.length === 1) {
      code += this.generateComponentCode(components[0]);
    } else {
      code += `Column(\n          children: [\n`;
      components.forEach(component => {
        code += `            ${this.generateComponentCode(component)},\n`;
      });
      code += `          ],\n        )`;
    }
    code += `\n      ),\n    );\n  }\n}`;
    return code;
  }

  /**
   * Genera el código Dart para un componente individual (recursivo)
   */
  generateComponentCode(component: FlutterComponent): string {
    switch (component.type) {
      case 'Text':
        return `Text(\n          '${component.properties.text}',\n          style: TextStyle(\n            fontSize: ${component.properties.fontSize ?? 16},\n            color: Color(0xFF${(component.properties.color || '#000000').substring(1)}),\n            fontWeight: FontWeight.${component.properties.fontWeight || 'normal'}\n          ),\n        )`;
      case 'Container':
        return `Container(\n          width: ${component.properties.width ?? 200},\n          height: ${component.properties.height ?? 100},\n          padding: EdgeInsets.all(${component.properties.padding ?? 0}),\n          decoration: BoxDecoration(\n            color: Color(0xFF${(component.properties.color || '#e3f2fd').substring(1)}),\n            borderRadius: BorderRadius.circular(${component.properties.borderRadius ?? 0}),\n          ),\n          ${component.child ? 'child: ' + this.generateComponentCode(component.child) : ''}\n        )`;
      case 'ElevatedButton':
        return `ElevatedButton(\n          onPressed: () {},\n          style: ElevatedButton.styleFrom(\n            backgroundColor: Color(0xFF${(component.properties.backgroundColor || '#2196f3').substring(1)}),\n          ),\n          child: Text(\n            '${component.properties.text}',\n            style: TextStyle(color: Color(0xFF${(component.properties.textColor || '#ffffff').substring(1)})),\n          ),\n        )`;
      case 'Image':
        const src = component.properties.src || 'https://via.placeholder.com/150x100';
        return `Image.network(\n          '${src}',\n          width: ${component.properties.width ?? 150},\n          height: ${component.properties.height ?? 100},\n          fit: BoxFit.cover,\n        )`;
      case 'TextField':
        return `TextField(\n          decoration: InputDecoration(\n            hintText: '${component.properties.placeholder || ''}',\n            border: OutlineInputBorder(),\n          ),\n        )`;
      case 'Column':
        const mainAxis = component.properties.mainAxisAlignment || 'start';
        const crossAxis = component.properties.crossAxisAlignment || 'center';
        const columnChildren = (component.children || []).map(child =>
          '            ' + this.generateComponentCode(child)
        ).join(',\n');
        return `Column(\n          mainAxisAlignment: ${this.getFlutterMainAxis(mainAxis)},\n          crossAxisAlignment: ${this.getFlutterCrossAxis(crossAxis)},\n          children: [\n${columnChildren}\n          ],\n        )`;
      case 'Row':
        const mainAxisR = component.properties.mainAxisAlignment || 'start';
        const crossAxisR = component.properties.crossAxisAlignment || 'center';
        const rowChildren = (component.children || []).map(child =>
          '            ' + this.generateComponentCode(child)
        ).join(',\n');
        return `Row(\n          mainAxisAlignment: ${this.getFlutterMainAxis(mainAxisR)},\n          crossAxisAlignment: ${this.getFlutterCrossAxis(crossAxisR)},\n          children: [\n${rowChildren}\n          ],\n        )`;
      default:
        return `Container()`;
    }
  }

  /**
   * Traduce alineaciones de string a enums de Flutter
   */
  getFlutterMainAxis(alignment: string): string {
    switch (alignment) {
      case 'start': return 'MainAxisAlignment.start';
      case 'center': return 'MainAxisAlignment.center';
      case 'end': return 'MainAxisAlignment.end';
      case 'spaceAround': return 'MainAxisAlignment.spaceAround';
      case 'spaceBetween': return 'MainAxisAlignment.spaceBetween';
      case 'spaceEvenly': return 'MainAxisAlignment.spaceEvenly';
      default: return 'MainAxisAlignment.start';
    }
  }

  getFlutterCrossAxis(alignment: string): string {
    switch (alignment) {
      case 'start': return 'CrossAxisAlignment.start';
      case 'center': return 'CrossAxisAlignment.center';
      case 'end': return 'CrossAxisAlignment.end';
      case 'stretch': return 'CrossAxisAlignment.stretch';
      default: return 'CrossAxisAlignment.center';
    }
  }
}

