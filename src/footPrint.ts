import { DrawObject } from "./drawObject";

export class FootPrint extends DrawObject {
  frame: number = 0;
  titleHeight: number = window.innerHeight;
  footPrintCoordinates: { x: number; y: number }[] = [];

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    super(canvas, ctx);
    this.setupFootPrints();
  }

  setupFootPrints() {
    let startX = this.canvas.width;
    let startY = (this.titleHeight / 9) * 8;
    this.footPrintCoordinates = [];

    while (startY > -20) {
      this.footPrintCoordinates.push({ x: startX, y: startY });
      startX -= 10;

      if (this.footPrintCoordinates.length % 2 !== 0) {
        startX -= 40;
        startY -= 30;
      } else {
        startX -= -30;
        startY -= 70;
      }
    }
  }

  drawFootPrints() {
    const maxCount = this.frame / 10;
    let count = 0;
    if (maxCount === 0) return;

    while (count <= maxCount && count < this.footPrintCoordinates.length) {
      const { x, y } = this.footPrintCoordinates[count];
      count % 2 === 0
        ? this.drawRightFootPrint(x, y)
        : this.drawLeftFootPrint(x, y);
      count++;
    }
  }

  drawRightFootPrint(start: number, end: number) {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.fillStyle = "#a9a9a9";
    this.ctx.moveTo(start + 8, end);
    this.ctx.bezierCurveTo(
      start + 29,
      end + -3,
      start + 28,
      end + 24,
      start + 25,
      end + 39.7
    );
    this.ctx.bezierCurveTo(
      start + 32,
      end + 50.5,
      start + 10,
      end + 53,
      start + 9,
      end + 44
    );
    this.ctx.bezierCurveTo(
      start + 8,
      end + 35,
      start + 7,
      end + 32,
      start + 3,
      end + 24
    );
    this.ctx.bezierCurveTo(
      start + 0,
      end + 16,
      start + -4,
      end + 2,
      start + 8,
      end
    );
    this.ctx.fill();
    this.ctx.restore();
  }

  drawLeftFootPrint(start: number, end: number) {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.fillStyle = "#a9a9a9";
    this.ctx.moveTo(start + 14, end);
    this.ctx.bezierCurveTo(
      start + 26,
      end + -1,
      start + 25,
      end + 14,
      start + 24,
      end + 22
    );
    this.ctx.bezierCurveTo(
      start + 22,
      end + 30,
      start + 22,
      end + 34,
      start + 23,
      end + 43
    );
    this.ctx.bezierCurveTo(
      start + 24,
      end + 52,
      start + 11,
      end + 53,
      start + 7,
      end + 42
    );
    this.ctx.bezierCurveTo(
      start + 0,
      end + 27.5,
      start + -7,
      end + 2,
      start + 14,
      end
    );
    this.ctx.fill();
    this.ctx.restore();
  }

  update() {
    this.frame++;
  }
}
