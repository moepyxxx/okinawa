import { DrawObject } from "./drawObject";

export class Sea extends DrawObject {
  baseMiddle: number;
  baseEnd: number;
  baseYEnd: number;

  frame = 0;
  baseStart = 50;
  baseXRange: number;
  baseYRange: number;

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    super(canvas, ctx);

    this.baseMiddle = this.canvas.width / 2;
    this.baseEnd = this.canvas.width;
    this.baseYEnd = (this.canvas.height / 4) * 2;
    this.baseXRange = this.canvas.width / 2.5;
    this.baseYRange = this.canvas.width / 2.5;
  }

  update() {
    this.frame++;
  }

  drawWaves() {
    const min = 30;
    const max = 100;

    for (let moveRange = min; moveRange < max; moveRange += 10) {
      /**
       * -50〜50の間をspeed10の速さで行き来するsin波を作る
       * 値が大きければspeedは小さくなる
       */
      const moveSpeed = moveRange - 20;
      const offset = moveRange * Math.sin(this.frame / moveSpeed);

      let waveX = this.baseStart;
      let waveY = this.baseStart;
      let waveIdx = 1;

      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.moveTo(waveX, waveY);

      while (waveY < this.canvas.height) {
        const lc1 = {
          x: waveIdx * this.baseXRange + offset,
          y: waveY - offset,
        };
        const lc2 = {
          x: waveX - offset,
          y: waveIdx * this.baseYRange + offset,
        };
        const lp = {
          x: waveIdx * this.baseXRange,
          y: waveIdx * this.baseYRange,
        };
        this.ctx.bezierCurveTo(lc1.x, lc1.y, lc2.x, lc2.y, lp.x, lp.y);
        this.ctx.lineTo(lp.x, lp.y);
        waveX += this.baseXRange;
        waveY += this.baseXRange;
        waveIdx++;
      }
      this.ctx.lineTo(waveX, waveY);
      this.ctx.lineTo(0, this.canvas.height);
      this.ctx.lineTo(0, 0);
      this.ctx.closePath();
      this.ctx.strokeStyle = "rgba(0, 175,204, .5)";
      this.ctx.fillStyle = "rgba(0, 175,204, .2)";
      this.ctx.stroke();
      this.ctx.fill();
      this.ctx.restore();
    }
  }

  drawSea() {
    let offsetF = -100;
    let seaX = this.baseStart + offsetF;
    let seaY = this.baseStart - offsetF;
    let seaIdx = 1;

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(seaX, seaY);

    while (seaY < this.canvas.height + offsetF) {
      const lc1 = {
        x: seaIdx * this.baseXRange + offsetF,
        y: seaY - offsetF,
      };
      const lc2 = {
        x: seaX + offsetF,
        y: seaIdx * this.baseYRange - offsetF,
      };
      const lp = {
        x: seaIdx * this.baseXRange + offsetF,
        y: seaIdx * this.baseYRange - offsetF,
      };
      this.ctx.bezierCurveTo(lc1.x, lc1.y, lc2.x, lc2.y, lp.x, lp.y);
      this.ctx.lineTo(lp.x, lp.y);
      seaX += this.baseXRange;
      seaY += this.baseYRange;
      seaIdx++;
    }
    this.ctx.lineTo(seaX, seaY);
    this.ctx.lineTo(0, this.canvas.height);
    this.ctx.lineTo(0, 0);
    this.ctx.closePath();
    this.ctx.filter = "blur(3px)";
    this.ctx.strokeStyle = "#00afcc";
    this.ctx.fillStyle = "#00afcc";
    this.ctx.stroke();
    this.ctx.fill();
    this.ctx.restore();
  }

  drawSandyBeach() {
    let offsetS = 150;
    let sandX = this.baseStart + offsetS;
    let sandY = this.baseStart - offsetS;
    let seaIdx = 1;

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(sandX, sandY);

    while (sandY < this.canvas.height + offsetS) {
      const lc1 = {
        x: seaIdx * this.baseXRange + offsetS,
        y: sandY - offsetS,
      };
      const lc2 = {
        x: sandX + offsetS,
        y: seaIdx * this.baseYRange - offsetS,
      };
      const lp = {
        x: seaIdx * this.baseXRange + offsetS,
        y: seaIdx * this.baseYRange - offsetS,
      };
      this.ctx.bezierCurveTo(lc1.x, lc1.y, lc2.x, lc2.y, lp.x, lp.y);
      this.ctx.lineTo(lp.x, lp.y);
      sandX += this.baseXRange;
      sandY += this.baseYRange;
      seaIdx++;
    }
    this.ctx.lineTo(sandX, sandY);
    this.ctx.lineTo(0, this.canvas.height);
    this.ctx.lineTo(0, 0);
    this.ctx.closePath();
    this.ctx.filter = "blur(2px)";
    this.ctx.strokeStyle = "#ffefd5";
    this.ctx.fillStyle = "#ffefd5";
    this.ctx.stroke();
    this.ctx.fill();
    this.ctx.restore();
  }
}
