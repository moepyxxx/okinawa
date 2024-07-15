import { DrawObject } from "./drawObject";

export class Text extends DrawObject {
  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    super(canvas, ctx);
  }

  drawText(
    text: string,
    size: number,
    x: number,
    y: number,
    color = "#fff",
    strokeColor = color
  ) {
    this.ctx.save();
    this.ctx.font = `bold ${size}px Noto Sans JP`;
    this.ctx.fillStyle = color;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.lineWidth = 0.5;
    this.ctx.strokeStyle = strokeColor;
    this.ctx.fillText(text, x, y);
    this.ctx.strokeText(text, x, y);
    this.ctx.restore();
  }
}
