import { DrawObject } from "./drawObject";
import { Position } from "./type";

export class Cloud extends DrawObject {
  frame: number = 0;
  cloudPosition: Position;
  shadowPosition: Position;
  scale: number;
  initialPhase: number;

  constructor(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    cloudPosition: Position,
    shadowPosition: Position,
    scale: number
  ) {
    super(canvas, ctx);
    this.cloudPosition = cloudPosition;
    this.shadowPosition = shadowPosition;
    this.scale = scale;
    // 初期位置をセット
    this.initialPhase = Math.random() * 2 * Math.PI;
  }

  draw() {
    // offsetの計算 (-10から10の間を行き来する)
    const amplitude = 10; // 振幅
    const frequency = 0.05; // 周波数 (値が小さいほど遅くなる)
    const offset =
      amplitude * Math.sin(frequency * this.frame + +this.initialPhase);

    this.drawCloud(
      this.shadowPosition.x + offset,
      this.shadowPosition.y,
      this.scale,
      "rgba(47, 79, 79, .2)",
      "rgba(47, 79, 79, .2)",
      "blur(2px)"
    );
    this.drawCloud(
      this.cloudPosition.x + offset,
      this.cloudPosition.y,
      this.scale,
      "#fafdff",
      "#efefef"
    );
  }

  drawCloud(
    x: number,
    y: number,
    scale: number,
    color: string,
    strokeColor: string,
    blur = "blur(0)"
  ) {
    this.ctx.save();
    this.ctx.moveTo(x + 125 * scale, y + 128 * scale);
    this.ctx.beginPath();
    this.ctx.filter = blur;
    this.ctx.lineTo(x + 125 * scale, y + 128 * scale);
    this.ctx.bezierCurveTo(
      x + 130 * scale,
      y + 66 * scale,
      x + 180 * scale,
      y + 63 * scale,
      x + 214 * scale,
      y + 81 * scale
    );
    this.ctx.bezierCurveTo(
      x + 234 * scale,
      y + 37 * scale,
      x + 283 * scale,
      y + 44 * scale,
      x + 300 * scale,
      y + 72 * scale
    );
    this.ctx.bezierCurveTo(
      x + 310 * scale,
      y + 24 * scale,
      x + 368 * scale,
      y + 10 * scale,
      x + 413 * scale,
      y + 44 * scale
    );
    this.ctx.bezierCurveTo(
      x + 462 * scale,
      y + 8 * scale,
      x + 519 * scale,
      y + 16 * scale,
      x + 551 * scale,
      y + 45 * scale
    );
    this.ctx.bezierCurveTo(
      x + 609 * scale,
      y + -13 * scale,
      x + 736 * scale,
      y + 6 * scale,
      x + 736 * scale,
      y + 72 * scale
    );
    this.ctx.bezierCurveTo(
      x + 833 * scale,
      y + 49 * scale,
      x + 890 * scale,
      y + 97 * scale,
      x + 881 * scale,
      y + 160 * scale
    );
    this.ctx.bezierCurveTo(
      x + 974 * scale,
      y + 172 * scale,
      x + 977 * scale,
      y + 267 * scale,
      x + 943 * scale,
      y + 315 * scale
    );
    this.ctx.bezierCurveTo(
      x + 1021 * scale,
      y + 346 * scale,
      x + 1004 * scale,
      y + 456 * scale,
      x + 943 * scale,
      y + 464 * scale
    );
    this.ctx.bezierCurveTo(
      x + 953 * scale,
      y + 553 * scale,
      x + 881 * scale,
      y + 599 * scale,
      x + 816 * scale,
      y + 562 * scale
    );
    this.ctx.bezierCurveTo(
      x + 783 * scale,
      y + 671 * scale,
      x + 700 * scale,
      y + 666 * scale,
      x + 629 * scale,
      y + 625 * scale
    );
    this.ctx.bezierCurveTo(
      x + 558 * scale,
      y + 653 * scale,
      x + 527 * scale,
      y + 625 * scale,
      x + 512 * scale,
      y + 588 * scale
    );
    this.ctx.bezierCurveTo(
      x + 483 * scale,
      y + 633 * scale,
      x + 446 * scale,
      y + 671 * scale,
      x + 361 * scale,
      y + 625 * scale
    );
    this.ctx.bezierCurveTo(
      x + 283 * scale,
      y + 664 * scale,
      x + 181 * scale,
      y + 654 * scale,
      x + 143 * scale,
      y + 577 * scale
    );
    this.ctx.bezierCurveTo(
      x + 15 * scale,
      y + 561 * scale,
      x + -27 * scale,
      y + 499 * scale,
      x + 26 * scale,
      y + 365 * scale
    );
    this.ctx.bezierCurveTo(
      x + -4.5 * scale,
      y + 338 * scale,
      x + -1.5 * scale,
      y + 280 * scale,
      x + 47 * scale,
      y + 269 * scale
    );
    this.ctx.bezierCurveTo(
      x + 30.5 * scale,
      y + 224 * scale,
      x + 19 * scale,
      y + 138 * scale,
      x + 125 * scale,
      y + 128 * scale
    );
    this.ctx.fillStyle = color;
    this.ctx.strokeStyle = strokeColor;
    this.ctx.stroke();
    this.ctx.fill();
    this.ctx.restore();
  }

  update() {
    this.frame++;
  }
}
