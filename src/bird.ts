import { DrawObject } from "./drawObject";
import { Utils } from "./utils";

export class Bird extends DrawObject {
  birdCurrentX: number = 0;
  birdCurrentY: number = 0;
  birdTargetX: number = 0;
  birdTargetY: number = 0;
  isBirdRotating: boolean = false;
  rotateTargetAngle: number = 0;
  birdAngle: number = 0;
  titleHeight: number = window.innerHeight;

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    super(canvas, ctx);
  }

  drawFlyingBird() {
    const speed = 30;
    const offset = 400;
    if (this.isBirdRotating) {
      // まだ回転していない場合はターゲットと回転ターゲット度数を決める
      if (this.rotateTargetAngle === 0) {
        const rand = Math.random();
        // 左上周辺
        if (
          this.birdTargetX <= this.canvas.width / 2 &&
          this.birdTargetY <= this.titleHeight / 2
        ) {
          this.birdTargetX =
            rand > 0.5
              ? this.canvas.width + offset
              : Math.floor(
                  Math.random() *
                    (this.canvas.width - this.canvas.width / 2 + 1)
                ) +
                this.canvas.width / 2;
          this.birdTargetY =
            rand > 0.5
              ? Math.floor(
                  Math.random() * (this.titleHeight - this.titleHeight / 2 + 1)
                ) +
                this.titleHeight / 2
              : this.titleHeight + offset;

          // 右上周辺
        } else if (
          this.birdCurrentX >= this.canvas.width / 2 &&
          this.birdCurrentY <= this.titleHeight
        ) {
          this.birdTargetX =
            rand > 0.5
              ? 0 - offset
              : Math.floor(Math.random() * (this.canvas.width / 2 - 0 + 1)) + 0;
          this.birdTargetY =
            rand > 0.5
              ? Math.floor(
                  Math.random() * (this.titleHeight - this.titleHeight / 2 + 1)
                ) +
                this.titleHeight / 2
              : this.titleHeight + offset;

          // 右下周辺
        } else if (
          this.birdCurrentX >= this.canvas.width / 2 &&
          this.birdCurrentY >= this.titleHeight
        ) {
          this.birdTargetX =
            rand > 0.5
              ? 0 - offset
              : Math.floor(Math.random() * (this.canvas.width / 2 - 0 + 1)) + 0;
          this.birdTargetY =
            rand > 0.5
              ? Math.floor(Math.random() * (this.canvas.width / 2 - 0 + 1)) + 0
              : 0 - offset;

          // 左下周辺
        } else {
          this.birdTargetX =
            rand > 0.5
              ? this.canvas.width + offset
              : Math.floor(
                  Math.random() *
                    (this.canvas.width - this.canvas.width / 2 + 1)
                ) +
                this.canvas.width / 2;
          this.birdTargetY =
            rand > 0.5
              ? Math.floor(Math.random() * (this.titleHeight / 2 - 0 + 1)) + 0
              : 0 - offset;
        }

        const { ux, uy } = Utils.calcNormal(
          this.birdCurrentX,
          this.birdCurrentY,
          this.birdTargetX,
          this.birdTargetY
        );

        this.rotateTargetAngle = Utils.calcAngleFromNormal(ux, uy);
      }

      // 回転させる
      // 特に回転させる必要がなくなったときは回転フラグをfalseにする
      if (this.birdAngle < this.rotateTargetAngle) {
        this.birdAngle += speed;
        this.birdCurrentX += speed;
        this.birdCurrentY += speed;
        if (this.birdAngle > this.rotateTargetAngle) {
          this.isBirdRotating = false;
          this.rotateTargetAngle = 0;
        }
      } else if (this.birdAngle > this.rotateTargetAngle) {
        this.birdAngle -= speed;
        this.birdCurrentX += speed;
        this.birdCurrentY += speed;
        if (this.birdAngle < this.rotateTargetAngle) {
          this.isBirdRotating = false;
          this.rotateTargetAngle = 0;
        }
      }
    } else {
      const { ux, uy } = Utils.calcNormal(
        this.birdCurrentX,
        this.birdCurrentY,
        this.birdTargetX,
        this.birdTargetY
      );
      const dist = Utils.distance(
        this.birdCurrentX,
        this.birdCurrentY,
        this.birdTargetX,
        this.birdTargetY
      );
      if (dist >= 20) {
        this.birdCurrentX += ux * speed;
        this.birdCurrentY += uy * speed;
        this.birdAngle = Utils.calcAngleFromNormal(ux, uy);
      } else {
        this.isBirdRotating = true;
      }
    }

    this.drawBird(
      this.birdCurrentX,
      this.birdCurrentY,
      this.birdAngle,
      "rgba(47, 79, 79, .8)"
    );
    this.drawBird(
      this.birdCurrentX,
      this.birdCurrentY + 100,
      this.birdAngle,
      "rgba(47, 79, 79, .2)"
    );
  }

  drawBird(x: number, y: number, angle: number, color = "#2f4f4f") {
    this.ctx.save();

    this.ctx.translate(x, y);
    // angleは右から時計回りだが、画像は上が基準のため
    this.ctx.rotate(((90 + angle) * Math.PI) / 180);

    this.ctx.beginPath();
    this.ctx.fillStyle = color;
    this.ctx.moveTo(0, 0);
    this.ctx.quadraticCurveTo(30, 0, 64.5, 40.5);
    this.ctx.quadraticCurveTo(26.7, 12.5, 0.5, 12.5);
    this.ctx.quadraticCurveTo(-26, 12.5, -64, 40.5);
    this.ctx.quadraticCurveTo(-29.2, 0, 0.5, 0);
    this.ctx.fill();
    this.ctx.closePath();

    this.ctx.restore();
  }
}
