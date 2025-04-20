import { Injectable } from '@angular/core';
import Konva from 'konva';

@Injectable({
  providedIn: 'root',
})
export class DrawingService {
  createRectangle(stage: Konva.Stage, layer: Konva.Layer, options: { color: string; strokeWidth: number }): Konva.Rect {
    const rect = new Konva.Rect({
      x: stage.width() / 2 - 50,
      y: stage.height() / 2 - 30,
      width: 200,
      height: 60,
      stroke: options.color,
      strokeWidth: options.strokeWidth,
      fill: 'transparent',
      name: 'shape',
      draggable: true,
    });

    layer.add(rect);
    layer.draw();
    return rect;
  }

  createCircle(stage: Konva.Stage, layer: Konva.Layer, options: { color: string; strokeWidth: number }): Konva.Circle {
    const circle = new Konva.Circle({
      x: stage.width() / 2,
      y: stage.height() / 2,
      radius: 30,
      stroke: options.color,
      strokeWidth: options.strokeWidth,
      fill: 'transparent',
      name: 'shape',
      draggable: true,
    });

    layer.add(circle);
    layer.draw();
    return circle;
  }

  createArrow(stage: Konva.Stage, layer: Konva.Layer, options: { color: string; strokeWidth: number }): Konva.Arrow {
    const arrowLength = 100;
    const startX = stage.width() / 2 - arrowLength / 2;
    const startY = stage.height() / 2;

    const arrow = new Konva.Arrow({
      points: [startX, startY, startX + arrowLength, startY],
      pointerLength: 10,
      pointerWidth: 10,
      stroke: options.color,
      strokeWidth: options.strokeWidth,
      fill: options.color,
      name: 'shape',
      draggable: true,
    });

    layer.add(arrow);
    layer.draw();
    return arrow;
  }

  createText(stage: Konva.Stage, layer: Konva.Layer, options: { color: string }): Konva.Text {
    const textNode = new Konva.Text({
      x: stage.width() / 2 - 50,
      y: stage.height() / 2,
      text: 'Escribe aquí',
      fontSize: 20,
      fontFamily: 'Arial',
      fill: options.color,
      name: 'shape',
      draggable: true,
    });

    layer.add(textNode);
    layer.draw();
    return textNode;
  }
}