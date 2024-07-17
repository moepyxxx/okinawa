import { DrawObject } from "./drawObject";
import { Position } from "./type";

export class ImageContent extends DrawObject {
  frame: number = 0;
  image: HTMLImageElement | null = null;
  isCurrentImageContent: boolean = false;
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

  clickListener = (e: MouseEvent) => {
    const offset = 8;
    this.ctx.beginPath();
    this.ctx.rect(
      this.canvas.width / 10 - offset,
      this.canvas.height / 40 - offset,
      (this.canvas.width / 10) * 1.2 + offset * 2,
      16 + offset * 2
    );
    this.ctx.closePath();

    if (this.ctx.isPointInPath(e.offsetX, e.offsetY)) {
      this.isCurrentImageContent = false;
    }
  };

  mouseMoveListener = (e: MouseEvent) => {
    const offset = 8;
    this.ctx.beginPath();
    this.ctx.rect(
      this.canvas.width / 10 - offset,
      this.canvas.height / 40 - offset,
      (this.canvas.width / 10) * 1.2 + offset * 2,
      16 + offset * 2
    );
    this.ctx.closePath();

    if (this.ctx.isPointInPath(e.offsetX, e.offsetY)) {
      this.canvas.style.cursor = "pointer";
    } else {
      this.canvas.style.cursor = "default";
    }
  };

  setCurrentContent() {
    this.isCurrentImageContent = true;
    window.addEventListener("click", this.clickListener);
    window.addEventListener("mousemove", this.mouseMoveListener);
  }

  removeCurrentContent() {
    this.isCurrentImageContent = false;
    window.removeEventListener("click", this.clickListener);
    window.removeEventListener("mousemove", this.mouseMoveListener);
  }

  drawContent() {
    if (!this.image) return;

    // 戻るページ
    this.ctx.save();
    this.ctx.textAlign = "left";
    this.ctx.textBaseline = "top";
    this.drawTextWithKerning(
      "← Back To Top Page".split(""),
      this.canvas.width / 10,
      this.canvas.height / 40,
      2,
      "16px Arial",
      "#fff"
    );
    this.ctx.restore();

    const topImageWidth = (this.canvas.width / 3) * 2;
    const topImageHeight = ((this.canvas.width / 3) * 2 * 2) / 3;

    const subImageWidth = (this.canvas.width / 6) * 2;
    const subImageHeight = ((this.canvas.width / 6) * 2 * 2) / 3;

    // TOP画像
    this.ctx.save();
    this.ctx.drawImage(
      this.image,
      this.canvas.width / 3,
      0,
      topImageWidth,
      topImageHeight
    );
    this.ctx.restore();

    // タイトル
    this.ctx.save();
    this.ctx.textAlign = "left";
    this.ctx.textBaseline = "middle";
    this.drawTextWithKerning(
      this.title.split(""),
      this.canvas.width / 10,
      topImageHeight / 2,
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
      topImageHeight / 2 + 100,
      4,
      "24px Arial",
      "#fff"
    );
    this.ctx.restore();

    // 本文
    this.ctx.save();
    this.ctx.textAlign = "left";
    this.ctx.textBaseline = "top";
    this.bodies.forEach((body, i) => {
      this.drawTextWithKerning(
        body.split(""),
        (this.canvas.width / 10) * 6,
        topImageHeight + this.canvas.height / 10 + subImageHeight / 2 + 32 * i,
        4,
        "16px Arial",
        "#fff"
      );
    });
    this.ctx.restore();

    // サブ画像
    if (this.subImages.length !== 2) {
      throw new Error("subImages length is not 2");
    }

    this.ctx.save();
    this.ctx.drawImage(
      this.subImages[0],
      0,
      topImageHeight + this.canvas.height / 10,
      subImageWidth,
      subImageHeight
    );
    this.ctx.drawImage(
      this.subImages[1],
      this.canvas.width / 6,
      topImageHeight +
        this.canvas.height / 10 +
        subImageHeight +
        this.canvas.height / 20,
      subImageWidth,
      subImageHeight
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
