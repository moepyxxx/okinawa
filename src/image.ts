import { DrawObject } from "./drawObject";
import { Position } from "./type";

export class ContentImage extends DrawObject {
  frame: number = 0;
  image: HTMLImageElement | null = null;
  position: Position = { x: 0, y: 0 };

  imageWidth: number;
  imageHeight: number;
  imageRadius: number;

  constructor(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    src: string,
    position: Position,
    imageWidth: number,
    imageHeight: number,
    imageRadius: number
  ) {
    super(canvas, ctx);
    this.loadImage(src).then((img) => {
      this.image = img;
    });
    this.position = position;
    this.imageWidth = imageWidth;
    this.imageHeight = imageHeight;
    this.imageRadius = imageRadius;
  }

  async loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (event) => reject(event);
      img.src = src;
    });
  }

  draw() {
    if (!this.image) return;

    // offsetの計算 (-30から30の間を行き来する)
    const amplitude = 20; // 振幅
    const frequency = 0.1; // 周波数 (値が小さいほど遅くなる)
    const offset = amplitude * Math.sin(frequency * this.frame);

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(
      this.position.x + this.imageRadius,
      this.position.y + offset
    );
    this.ctx.lineTo(
      this.position.x + this.imageWidth - this.imageRadius,
      this.position.y + offset
    );
    this.ctx.quadraticCurveTo(
      this.position.x + this.imageWidth,
      this.position.y + offset,
      this.position.x + this.imageWidth,
      this.position.y + offset + this.imageRadius
    );
    this.ctx.lineTo(
      this.position.x + this.imageWidth,
      this.position.y + offset + this.imageHeight - this.imageRadius
    );
    this.ctx.quadraticCurveTo(
      this.position.x + this.imageWidth,
      this.position.y + offset + this.imageHeight,
      this.position.x + this.imageWidth - this.imageRadius,
      this.position.y + offset + this.imageHeight
    );
    this.ctx.lineTo(
      this.position.x + this.imageRadius,
      this.position.y + offset + this.imageHeight
    );
    this.ctx.quadraticCurveTo(
      this.position.x,
      this.position.y + offset + this.imageHeight,
      this.position.x,
      this.position.y + offset + this.imageHeight - this.imageRadius
    );
    this.ctx.lineTo(
      this.position.x,
      this.position.y + offset + this.imageRadius
    );
    this.ctx.quadraticCurveTo(
      this.position.x,
      this.position.y + offset,
      this.position.x + this.imageRadius,
      this.position.y + offset
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
    //   this.position.y + offset,
    //   drawWidth,
    //   drawHeight
    // );
    // this.ctx.restore();

    this.ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y + offset,
      this.imageWidth,
      this.imageHeight
    );
    this.ctx.restore();
  }

  update() {
    this.frame++;
  }
}
