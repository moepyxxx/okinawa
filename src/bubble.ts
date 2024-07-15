import { DrawObject } from "./drawObject";

export class Bubble extends DrawObject {
  bubblePositions: {
    x: number;
    y: number;
    radius: number;
    opacity: number;
  }[] = [];
  bubbleCount: number = 200;

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    super(canvas, ctx);
    this.setupBubbles();
  }

  setupBubbles() {
    this.bubblePositions = [...Array(this.bubbleCount)].map(() => ({
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      radius: Math.random() * 6,
      opacity: Math.random(),
    }));
  }

  drawBubbles() {
    for (let i = 0; i < this.bubbleCount; i++) {
      const x = this.bubblePositions[i].x;
      const y = this.bubblePositions[i].y;
      const radius = this.bubblePositions[i].radius;
      const bubbleColor = `rgba(255, 255, 255, ${this.bubblePositions[i].opacity})`;
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.fillStyle = bubbleColor;
      this.ctx.arc(x, y, radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }
  }
}
