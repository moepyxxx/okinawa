import { DrawObject } from "./drawObject";

export class Sea extends DrawObject {
  baseMiddle: number;
  baseXStart: number;
  baseYStart: number;
  baseEnd: number;
  baseYEnd: number;

  frame = 0;
  baseXRange: number;
  baseYRange: number;

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    super(canvas, ctx);

    this.baseXStart = -(this.canvas.width / 6);
    this.baseYStart = 0;
    this.baseMiddle = this.canvas.width / 2;
    this.baseEnd = this.canvas.width;
    this.baseYEnd = (this.canvas.height / 4) * 2 + this.baseYStart;
    this.baseXRange = this.canvas.width / 2.5;
    this.baseYRange = this.canvas.width / 2.5;
  }

  drawWaves() {
    const min = 30;
    const max = 100;

    for (let moveRange = min; moveRange < max; moveRange += 10) {
      /**
       * -50〜50の間をspeed10の速さで行き来するsin波を作る
       * 値が大きければspeedは小さくなる
       */
      const moveSpeed = moveRange - 10;
      const offset = moveRange * Math.sin(this.frame / moveSpeed);

      let waveX = 0;
      let waveY = 0;
      let waveIdx = 1;

      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.moveTo(this.baseXStart, this.baseYStart);

      while (waveY < this.canvas.height) {
        const lc1 = {
          x: this.baseXStart + (waveIdx * this.baseXRange + offset),
          y: this.baseYStart + (waveY - offset),
        };
        const lc2 = {
          x: this.baseXStart + (waveX - offset),
          y: this.baseYStart + (waveIdx * this.baseYRange + offset),
        };
        const lp = {
          x: this.baseXStart + waveIdx * this.baseXRange,
          y: this.baseYStart + waveIdx * this.baseYRange,
        };
        this.ctx.bezierCurveTo(lc1.x, lc1.y, lc2.x, lc2.y, lp.x, lp.y);
        this.ctx.lineTo(lp.x, lp.y);
        waveX += this.baseXRange;
        waveY += this.baseXRange;
        waveIdx++;
      }
      this.ctx.lineTo(waveX, waveY);
      this.ctx.lineTo(0, this.canvas.height);
      this.ctx.lineTo(0, this.baseYStart);
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
    let seaX = 0 + offsetF;
    let seaY = 0 - offsetF;
    let seaIdx = 1;

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(this.baseXStart + offsetF, this.baseYStart - offsetF);

    while (seaY < this.canvas.height + offsetF) {
      const lc1 = {
        x: this.baseXStart + (seaIdx * this.baseXRange + offsetF),
        y: this.baseYStart + (seaY - offsetF),
      };
      const lc2 = {
        x: this.baseXStart + (seaX + offsetF),
        y: this.baseYStart + (seaIdx * this.baseYRange - offsetF),
      };
      const lp = {
        x: this.baseXStart + (seaIdx * this.baseXRange + offsetF),
        y: this.baseYStart + (seaIdx * this.baseYRange - offsetF),
      };
      this.ctx.bezierCurveTo(lc1.x, lc1.y, lc2.x, lc2.y, lp.x, lp.y);
      this.ctx.lineTo(lp.x, lp.y);
      seaX += this.baseXRange;
      seaY += this.baseYRange;
      seaIdx++;
    }
    this.ctx.lineTo(seaX, seaY);
    this.ctx.lineTo(0, this.canvas.height);
    this.ctx.lineTo(0, this.baseYStart);
    this.ctx.closePath();
    this.ctx.filter = "blur(3px)";
    this.ctx.strokeStyle = "#00afcc";
    this.ctx.fillStyle = "#00afcc";
    this.ctx.stroke();
    this.ctx.fill();
    this.ctx.restore();
  }

  isPointInSea(x: number, y: number) {
    let offsetF = -100;
    let seaX = 0 + offsetF;
    let seaY = 0 - offsetF;
    let seaIdx = 1;

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(this.baseXStart + offsetF, this.baseYStart - offsetF);

    while (seaY < this.canvas.height + offsetF) {
      const lc1 = {
        x: this.baseXStart + (seaIdx * this.baseXRange + offsetF),
        y: this.baseYStart + (seaY - offsetF),
      };
      const lc2 = {
        x: this.baseXStart + (seaX + offsetF),
        y: this.baseYStart + (seaIdx * this.baseYRange - offsetF),
      };
      const lp = {
        x: this.baseXStart + (seaIdx * this.baseXRange + offsetF),
        y: this.baseYStart + (seaIdx * this.baseYRange - offsetF),
      };
      this.ctx.bezierCurveTo(lc1.x, lc1.y, lc2.x, lc2.y, lp.x, lp.y);
      this.ctx.lineTo(lp.x, lp.y);
      seaX += this.baseXRange;
      seaY += this.baseYRange;
      seaIdx++;
    }
    this.ctx.lineTo(seaX, seaY);
    this.ctx.lineTo(0, this.canvas.height);
    this.ctx.lineTo(0, this.baseYStart);
    this.ctx.closePath();

    return this.ctx.isPointInPath(x, y);
  }

  drawSandyBeach() {
    let offsetS = 150;
    let sandX = 0 + offsetS;
    let sandY = 0 - offsetS;
    let seaIdx = 1;

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(this.baseXStart + offsetS, this.baseYStart - offsetS);

    while (sandY < this.canvas.height + offsetS) {
      const lc1 = {
        x: this.baseXStart + (seaIdx * this.baseXRange + offsetS),
        y: this.baseYStart + (sandY - offsetS),
      };
      const lc2 = {
        x: this.baseXStart + (sandX + offsetS),
        y: this.baseYStart + (seaIdx * this.baseYRange - offsetS),
      };
      const lp = {
        x: this.baseXStart + (seaIdx * this.baseXRange + offsetS),
        y: this.baseYStart + (seaIdx * this.baseYRange - offsetS),
      };
      this.ctx.bezierCurveTo(lc1.x, lc1.y, lc2.x, lc2.y, lp.x, lp.y);
      this.ctx.lineTo(lp.x, lp.y);
      sandX += this.baseXRange;
      sandY += this.baseYRange;
      seaIdx++;
    }
    this.ctx.lineTo(sandX, sandY);
    this.ctx.lineTo(0, this.canvas.height);
    this.ctx.lineTo(0, this.baseXStart);
    this.ctx.closePath();
    this.ctx.filter = "blur(2px)";
    this.ctx.strokeStyle = "rgb(255, 239, 213, 1)";
    this.ctx.fillStyle = "rgb(255, 239, 213, 1)";
    this.ctx.stroke();
    this.ctx.fill();
    this.ctx.restore();
  }

  isPointInSandyBeach(x: number, y: number) {
    let offsetS = 150;
    let sandX = 0 + offsetS;
    let sandY = 0 - offsetS;
    let seaIdx = 1;

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(this.baseXStart + offsetS, this.baseYStart - offsetS);

    while (sandY < this.canvas.height + offsetS) {
      const lc1 = {
        x: this.baseXStart + (seaIdx * this.baseXRange + offsetS),
        y: this.baseYStart + (sandY - offsetS),
      };
      const lc2 = {
        x: this.baseXStart + (sandX + offsetS),
        y: this.baseYStart + (seaIdx * this.baseYRange - offsetS),
      };
      const lp = {
        x: this.baseXStart + (seaIdx * this.baseXRange + offsetS),
        y: this.baseYStart + (seaIdx * this.baseYRange - offsetS),
      };
      this.ctx.bezierCurveTo(lc1.x, lc1.y, lc2.x, lc2.y, lp.x, lp.y);
      this.ctx.lineTo(lp.x, lp.y);
      sandX += this.baseXRange;
      sandY += this.baseYRange;
      seaIdx++;
    }
    this.ctx.lineTo(sandX, sandY);
    this.ctx.lineTo(sandX, 0);
    this.ctx.lineTo(0, this.baseXStart);
    this.ctx.closePath();

    return this.ctx.isPointInPath(x, y);
  }
  update() {
    this.frame++;
  }
}
