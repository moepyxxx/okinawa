import { DrawObject } from "./drawObject";

export class WaveLine extends DrawObject {
  titleHeight: number = window.innerHeight;

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    super(canvas, ctx);
  }

  drawUnderWaveLine() {
    const x = this.canvas.width / 2;
    const y = this.titleHeight / 2 + 80;
    this.ctx.save();

    const gradient = this.ctx.createLinearGradient(
      x + -36.5,
      this.titleHeight,
      x + 80,
      this.titleHeight
    );
    gradient.addColorStop(0, "#6495ed");
    gradient.addColorStop(0.25, "#87ceeb");
    gradient.addColorStop(0.75, "#afeeee");
    gradient.addColorStop(1, "#40e0d0");
    this.ctx.lineWidth = 20;
    this.ctx.strokeStyle = gradient;
    this.ctx.lineJoin = "round";
    this.ctx.lineCap = "round";
    this.ctx.beginPath();
    this.ctx.moveTo(x + -64, y + 29);
    this.ctx.quadraticCurveTo(x + -36.5, y + 6.7, x + -24, y + 13);
    this.ctx.bezierCurveTo(
      x + -15.7,
      y + 16.5,
      x + -15.8,
      y + 25.7,
      x + -7.5,
      y + 29
    );
    this.ctx.bezierCurveTo(x + 8, y + 35, x + 17, y + 6.5, x + 32.5, y + 13);
    this.ctx.bezierCurveTo(
      x + 40.5,
      y + 16.5,
      x + 40,
      y + 26.5,
      x + 48.5,
      y + 29
    );
    this.ctx.quadraticCurveTo(x + 61.5, y + 33.5, x + 80, y + 13);
    this.ctx.stroke();
    this.ctx.restore();
  }
}
