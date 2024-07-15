import { DrawObject } from "./drawObject";

type TitleType = {
  text: string;
  width: number;
};

export class Title extends DrawObject {
  frame: number = 0;
  titleHeight: number = window.innerHeight;
  title: TitleType[];

  sumWidth: number = 0;
  startX: number = 0;

  constructor(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    title: TitleType[]
  ) {
    super(canvas, ctx);
    this.title = title;
    this.setupTitle();
  }

  setupTitle() {
    this.sumWidth = this.title
      .map((t) => t.width)
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    this.startX = (this.canvas.width - this.sumWidth) / 2;
  }

  drawTitle() {
    this.ctx.save();
    const gradient = this.ctx.createLinearGradient(
      this.startX,
      this.titleHeight / 2 - 75,
      this.startX + this.sumWidth,
      this.titleHeight / 2 + 75
    );

    // HSL色空間で色を生成
    const startHue1 = 120;
    const endHue1 = 255;

    const startHue2 = 255;
    const endHue2 = 100;

    // 補間値を計算
    const t = (Math.sin(this.frame / 20) + 1) / 2; // 0から1までの範囲で循環する値を生成

    const hue1 = startHue1 * (1 - t) + endHue1 * t;
    const hue2 = startHue2 * (1 - t) + endHue2 * t;

    gradient.addColorStop(0, `hsl(${hue1}, 100%, 42%)`);
    gradient.addColorStop(1, `hsl(${hue2}, 100%, 79%)`);

    this.ctx.lineWidth = 12;
    this.ctx.font = "bold 150px Arial";
    this.ctx.strokeStyle = gradient;
    this.ctx.lineJoin = "round";
    this.ctx.lineCap = "round";
    for (let i = 0; i < this.title.length; i++) {
      let x = this.startX;
      for (let j = 0; j < i; j++) {
        x += this.title[j].width;
      }
      this.ctx.strokeText(this.title[i].text, x, this.titleHeight / 2);
    }
    this.ctx.restore();
  }

  drawSun() {
    this.ctx.save();
    this.ctx.fillStyle = "#fff";
    this.ctx.beginPath();
    this.ctx.arc(
      this.startX + 50 / 2,
      this.titleHeight / 2 - 120,
      50,
      0,
      Math.PI * 2
    );
    this.ctx.fill();
    this.ctx.restore();
  }

  update() {
    this.frame++;
  }
}
