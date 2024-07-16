import { DrawObject } from "./drawObject";
import { Position } from "./type";

export class ImageContent extends DrawObject {
  frame: number = 0;
  image: HTMLImageElement | null = null;
  subImages: HTMLImageElement[] = [];
  title: string;
  subTitle: string;
  bodies: string[];
  contentsPosition: Position = { x: 0, y: 0 };

  topImageWidth: number;
  topImageHeight: number;
  topImageRadius: number;

  constructor(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    src: string,
    subSrc: string[],
    contentsPosition: Position,
    title: string,
    subTitle: string,
    bodies: string[]
  ) {
    super(canvas, ctx);
    this.loadImage(src).then((img) => {
      this.image = img;
    });
    subSrc.forEach((src) => {
      this.loadImage(src).then((img) => {
        this.subImages.push(img);
      });
    });
    this.contentsPosition = contentsPosition;
    this.title = title;
    this.subTitle = subTitle;
    this.bodies = bodies;

    this.topImageWidth = (canvas.width - 200 - 40 * 3) / 3;
    this.topImageHeight = this.topImageWidth * (2 / 3);
    this.topImageRadius = 20;
  }

  async loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (event) => reject(event);
      img.src = src;
    });
  }

  drawTopContent() {
    if (!this.image) return;

    // offsetの計算 (-15から15の間を行き来する)
    const amplitude = 15; // 振幅
    const frequency = 0.1; // 周波数 (値が小さいほど遅くなる)
    const offset = amplitude * Math.sin(frequency * this.frame);

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(
      this.contentsPosition.x + this.topImageRadius,
      this.contentsPosition.y + offset
    );
    this.ctx.lineTo(
      this.contentsPosition.x + this.topImageWidth - this.topImageRadius,
      this.contentsPosition.y + offset
    );
    this.ctx.quadraticCurveTo(
      this.contentsPosition.x + this.topImageWidth,
      this.contentsPosition.y + offset,
      this.contentsPosition.x + this.topImageWidth,
      this.contentsPosition.y + offset + this.topImageRadius
    );
    this.ctx.lineTo(
      this.contentsPosition.x + this.topImageWidth,
      this.contentsPosition.y +
        offset +
        this.topImageHeight -
        this.topImageRadius
    );
    this.ctx.quadraticCurveTo(
      this.contentsPosition.x + this.topImageWidth,
      this.contentsPosition.y + offset + this.topImageHeight,
      this.contentsPosition.x + this.topImageWidth - this.topImageRadius,
      this.contentsPosition.y + offset + this.topImageHeight
    );
    this.ctx.lineTo(
      this.contentsPosition.x + this.topImageRadius,
      this.contentsPosition.y + offset + this.topImageHeight
    );
    this.ctx.quadraticCurveTo(
      this.contentsPosition.x,
      this.contentsPosition.y + offset + this.topImageHeight,
      this.contentsPosition.x,
      this.contentsPosition.y +
        offset +
        this.topImageHeight -
        this.topImageRadius
    );
    this.ctx.lineTo(
      this.contentsPosition.x,
      this.contentsPosition.y + offset + this.topImageRadius
    );
    this.ctx.quadraticCurveTo(
      this.contentsPosition.x,
      this.contentsPosition.y + offset,
      this.contentsPosition.x + this.topImageRadius,
      this.contentsPosition.y + offset
    );
    this.ctx.closePath();

    this.ctx.clip();

    // アスペクト比固定方法
    // // 3×2のアスペクト比に合わせて画像をスケーリング
    // const targetAspectRatio = 3 / 2;
    // const imgAspectRatio = img.width / img.height;

    // let drawWidth, drawHeight, sourceX, sourceY, sourceWidth, sourceHeight;

    // if (imgAspectRatio > targetAspectRatio) {
    //   // 画像が横に長い場合、幅を合わせてトリミング
    //   sourceHeight = img.height;
    //   sourceWidth = img.height * targetAspectRatio;
    //   sourceX = (img.width - sourceWidth) / 2;
    //   sourceY = 0;
    // } else {
    //   // 画像が縦に長い場合、高さを合わせてトリミング
    //   sourceWidth = img.width;
    //   sourceHeight = img.width / targetAspectRatio;
    //   sourceX = 0;
    //   sourceY = (img.height - sourceHeight) / 2;
    // }

    // drawWidth = width;
    // drawHeight = height;

    // this.ctx.drawImage(
    //   img,
    //   sourceX,
    //   sourceY,
    //   sourceWidth,
    //   sourceHeight,
    //   x,
    //   this.contentsPosition.y + offset,
    //   drawWidth,
    //   drawHeight
    // );
    // this.ctx.restore();

    this.ctx.drawImage(
      this.image,
      this.contentsPosition.x,
      this.contentsPosition.y + offset,
      this.topImageWidth,
      this.topImageHeight
    );
    this.ctx.restore();
  }

  drawSubContent() {
    if (!this.image) return;

    // TOP画像
    this.ctx.save();
    this.ctx.drawImage(
      this.image,
      this.canvas.width / 3,
      0,
      (this.canvas.width / 3) * 2,
      ((this.canvas.width / 3) * 2 * 2) / 3
    );
    this.ctx.restore();

    // タイトル
    this.ctx.save();
    this.ctx.textAlign = "left";
    this.ctx.textBaseline = "middle";
    this.drawTextWithKerning(
      this.title.split(""),
      this.canvas.width / 10,
      ((this.canvas.width / 3) * 2 * 2) / 3 / 2,
      20,
      "bold 132px Arial",
      "#fff"
    );
    this.ctx.restore();

    // サブタイトル
    this.ctx.save();
    this.drawTextWithKerning(
      this.subTitle.split(""),
      this.canvas.width / 10,
      ((this.canvas.width / 3) * 2 * 2) / 3 / 2 + 100,
      4,
      "24px Arial",
      "#fff"
    );

    this.ctx.restore();
  }

  drawTextWithKerning(
    text: string[],
    x: number,
    y: number,
    kerning: number,
    font: string,
    fillStyle: string
  ) {
    this.ctx.font = font;
    this.ctx.fillStyle = fillStyle;
    let currentX = x;
    this.ctx.textAlign = "left";

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      this.ctx.fillText(char, currentX, y);
      currentX += this.ctx.measureText(char).width + kerning;
    }
  }

  isPointInImage(x: number, y: number) {
    const amplitude = 15; // 振幅
    const frequency = 0.1; // 周波数 (値が小さいほど遅くなる)
    const offset = amplitude * Math.sin(frequency * this.frame);

    this.ctx.beginPath();
    this.ctx.moveTo(
      this.contentsPosition.x + this.topImageRadius,
      this.contentsPosition.y + offset
    );
    this.ctx.lineTo(
      this.contentsPosition.x + this.topImageWidth - this.topImageRadius,
      this.contentsPosition.y + offset
    );
    this.ctx.quadraticCurveTo(
      this.contentsPosition.x + this.topImageWidth,
      this.contentsPosition.y + offset,
      this.contentsPosition.x + this.topImageWidth,
      this.contentsPosition.y + offset + this.topImageRadius
    );
    this.ctx.lineTo(
      this.contentsPosition.x + this.topImageWidth,
      this.contentsPosition.y +
        offset +
        this.topImageHeight -
        this.topImageRadius
    );
    this.ctx.quadraticCurveTo(
      this.contentsPosition.x + this.topImageWidth,
      this.contentsPosition.y + offset + this.topImageHeight,
      this.contentsPosition.x + this.topImageWidth - this.topImageRadius,
      this.contentsPosition.y + offset + this.topImageHeight
    );
    this.ctx.lineTo(
      this.contentsPosition.x + this.topImageRadius,
      this.contentsPosition.y + offset + this.topImageHeight
    );
    this.ctx.quadraticCurveTo(
      this.contentsPosition.x,
      this.contentsPosition.y + offset + this.topImageHeight,
      this.contentsPosition.x,
      this.contentsPosition.y +
        offset +
        this.topImageHeight -
        this.topImageRadius
    );
    this.ctx.lineTo(
      this.contentsPosition.x,
      this.contentsPosition.y + offset + this.topImageRadius
    );
    this.ctx.quadraticCurveTo(
      this.contentsPosition.x,
      this.contentsPosition.y + offset,
      this.contentsPosition.x + this.topImageRadius,
      this.contentsPosition.y + offset
    );
    this.ctx.closePath();

    return this.ctx.isPointInPath(x, y);
  }

  update() {
    this.frame++;
  }
}
