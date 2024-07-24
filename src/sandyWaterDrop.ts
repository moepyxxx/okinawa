import { DrawObject } from "./drawObject";
import { Position } from "./type";

export class SandyWaterDrop extends DrawObject {
  frame: number = 0;
  position: Position;
  isEnd = false;

  constructor(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    position: Position
  ) {
    super(canvas, ctx);
    this.position = position;
  }

  draw() {
    if (this.isEnd) {
      return;
    }

    const totalFrames = 50;
    const progress = this.frame / totalFrames;
    if (progress > 1) {
      this.isEnd = true;
      return;
    }

    let radius = 0;
    if (progress > 0 && progress < 0.3) {
      radius = 5 + (15 - 5) * progress * 3;
    }
    if (progress >= 0.3 && progress < 0.7) {
      radius = 15;
    }
    if (progress >= 0.7 && progress < 1) {
      radius = 15 + (5 - 15) * (progress - 0.7) * 3;
    }

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(
      this.position.x,
      this.position.y,
      radius,
      0,
      Math.PI * 2,
      false
    );
    this.ctx.closePath();
    this.ctx.fillStyle = "rgba(0, 0, 0, .05)";
    this.ctx.fill();

    this.ctx.restore();
  }

  update() {
    this.frame++;
  }
}
