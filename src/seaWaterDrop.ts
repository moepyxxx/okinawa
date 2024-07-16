import { DrawObject } from "./drawObject";
import { Position } from "./type";

export class SeaWaterDrop extends DrawObject {
  frame: number = 0;
  startFrames: number[] = [0, 5, 12, 19, 25];
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
    const startFrames = [0, 5, 12, 19, 25];
    const totalFrames = 20;

    this.ctx.save();
    for (let i = 0; i < startFrames.length - 1; i++) {
      this.ctx.beginPath();
      const progress =
        (this.frame - (startFrames[i] % totalFrames)) / totalFrames;
      if (progress < 0) {
        continue;
      }
      if (progress > 0.7) {
        const adjustedProgress = (progress - 0.7) / 0.3;
        const opacity = 0.2 * (1 - adjustedProgress);
        this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
      } else {
        this.ctx.strokeStyle = "rgba(255, 255, 255, .2)";
      }
      this.ctx.arc(
        this.position.x,
        this.position.y,
        10 + 60 * progress,
        0,
        Math.PI * 2,
        false
      );
      this.ctx.closePath();
      this.ctx.stroke();
      if (i === startFrames.length - 1 && progress < 1.5) {
        this.isEnd = true;
      }
    }
    this.ctx.restore();
  }

  update() {
    this.frame++;
  }
}
