import { DrawObject } from "./drawObject";
import { Position } from "./type";

export class Cloud extends DrawObject {
  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    super(canvas, ctx);
  }

  drawCloud(
    x: number,
    y: number,
    size: number,
    color: string,
    strokeColor: string,
    blur = "blur(0)"
  ) {
    this.ctx.save();
    this.ctx.moveTo(x + 125 * size, y + 128 * size);
    this.ctx.beginPath();
    this.ctx.filter = blur;
    this.ctx.lineTo(x + 125 * size, y + 128 * size);
    this.ctx.bezierCurveTo(
      x + 130 * size,
      y + 66 * size,
      x + 180 * size,
      y + 63 * size,
      x + 214 * size,
      y + 81 * size
    );
    this.ctx.bezierCurveTo(
      x + 234 * size,
      y + 37 * size,
      x + 283 * size,
      y + 44 * size,
      x + 300 * size,
      y + 72 * size
    );
    this.ctx.bezierCurveTo(
      x + 310 * size,
      y + 24 * size,
      x + 368 * size,
      y + 10 * size,
      x + 413 * size,
      y + 44 * size
    );
    this.ctx.bezierCurveTo(
      x + 462 * size,
      y + 8 * size,
      x + 519 * size,
      y + 16 * size,
      x + 551 * size,
      y + 45 * size
    );
    this.ctx.bezierCurveTo(
      x + 609 * size,
      y + -13 * size,
      x + 736 * size,
      y + 6 * size,
      x + 736 * size,
      y + 72 * size
    );
    this.ctx.bezierCurveTo(
      x + 833 * size,
      y + 49 * size,
      x + 890 * size,
      y + 97 * size,
      x + 881 * size,
      y + 160 * size
    );
    this.ctx.bezierCurveTo(
      x + 974 * size,
      y + 172 * size,
      x + 977 * size,
      y + 267 * size,
      x + 943 * size,
      y + 315 * size
    );
    this.ctx.bezierCurveTo(
      x + 1021 * size,
      y + 346 * size,
      x + 1004 * size,
      y + 456 * size,
      x + 943 * size,
      y + 464 * size
    );
    this.ctx.bezierCurveTo(
      x + 953 * size,
      y + 553 * size,
      x + 881 * size,
      y + 599 * size,
      x + 816 * size,
      y + 562 * size
    );
    this.ctx.bezierCurveTo(
      x + 783 * size,
      y + 671 * size,
      x + 700 * size,
      y + 666 * size,
      x + 629 * size,
      y + 625 * size
    );
    this.ctx.bezierCurveTo(
      x + 558 * size,
      y + 653 * size,
      x + 527 * size,
      y + 625 * size,
      x + 512 * size,
      y + 588 * size
    );
    this.ctx.bezierCurveTo(
      x + 483 * size,
      y + 633 * size,
      x + 446 * size,
      y + 671 * size,
      x + 361 * size,
      y + 625 * size
    );
    this.ctx.bezierCurveTo(
      x + 283 * size,
      y + 664 * size,
      x + 181 * size,
      y + 654 * size,
      x + 143 * size,
      y + 577 * size
    );
    this.ctx.bezierCurveTo(
      x + 15 * size,
      y + 561 * size,
      x + -27 * size,
      y + 499 * size,
      x + 26 * size,
      y + 365 * size
    );
    this.ctx.bezierCurveTo(
      x + -4.5 * size,
      y + 338 * size,
      x + -1.5 * size,
      y + 280 * size,
      x + 47 * size,
      y + 269 * size
    );
    this.ctx.bezierCurveTo(
      x + 30.5 * size,
      y + 224 * size,
      x + 19 * size,
      y + 138 * size,
      x + 125 * size,
      y + 128 * size
    );
    this.ctx.fillStyle = color;
    this.ctx.strokeStyle = strokeColor;
    this.ctx.stroke();
    this.ctx.fill();
    this.ctx.restore();
  }
}
