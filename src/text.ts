import { DrawObject } from "./drawObject";

export class Text extends DrawObject {
  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    super(canvas, ctx);
  }

  drawText(text: string, size: number, x: number, y: number, color = "#fff") {
    this.ctx.save();
    this.ctx.font = `${size}px Noto Sans JP`;
    this.ctx.fillStyle = color;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(text, x, y);
    this.ctx.restore();
  }
}
