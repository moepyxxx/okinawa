import { Cloud } from "./cloud";
import { DrawObject } from "./drawObject";
import { Sea } from "./sea";
import { WeatherType } from "./type";
import { SeaWaterDrop } from "./seaWaterDrop";
import { SandyWaterDrop } from "./sandyWaterDrop";

export class Weather extends DrawObject {
  frame: number = 0;
  weather: WeatherType = "rainy";
  isChanging: boolean = false;
  weatherFrame: number = 0;
  startChangeFrame: number = 0;
  clouds: Cloud[] = [];
  sea: Sea;
  seaWaterDrops: SeaWaterDrop[] = [];
  sandyWaterDrops: SandyWaterDrop[] = [];

  constructor(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    sea: Sea
  ) {
    super(canvas, ctx);
    this.sea = sea;

    this.clouds = [
      new Cloud(
        canvas,
        ctx,
        {
          x: canvas.width - 200,
          y: canvas.height / 2,
        },
        {
          x: canvas.width - 200,
          y: canvas.height / 2 + 300,
        },
        1
      ),
      new Cloud(
        canvas,
        ctx,
        {
          x: -300,
          y: -200,
        },
        {
          x: -300,
          y: -200 + 150,
        },
        0.6
      ),
      new Cloud(
        canvas,
        ctx,
        {
          x: canvas.width / 5,
          y: (canvas.height / 7) * 6.5,
        },
        {
          x: canvas.width / 5,
          y: (canvas.height / 7) * 6.5 + 150,
        },
        0.9
      ),
    ];
  }

  changeWeather(weather: WeatherType) {
    this.weather = weather;
    this.isChanging = true;
    this.startChangeFrame = this.frame;
  }

  update() {
    this.frame++;
    this.clouds.forEach((cloud) => cloud.update());

    this.seaWaterDrops.forEach((waterDrop) => waterDrop.update());
    this.sandyWaterDrops.forEach((waterDrop) => waterDrop.update());

    if (
      this.weather === "rainy" &&
      (this.frame - this.weatherFrame) % 10 === 0
    ) {
      for (let i = 0; i < 3; i++) {
        let randomX = Math.floor(Math.random() * this.canvas.width);
        let randomY = Math.floor(Math.random() * this.canvas.height);
        while (!this.sea.isPointInSea(randomX, randomY)) {
          randomX = Math.floor(Math.random() * this.canvas.width);
          randomY = Math.floor(Math.random() * this.canvas.height);
        }
        this.seaWaterDrops.push(
          new SeaWaterDrop(this.canvas, this.ctx, {
            x: randomX,
            y: randomY,
          })
        );
      }
      for (let i = 0; i < 10; i++) {
        let randomX = Math.floor(Math.random() * this.canvas.width);
        let randomY = Math.floor(Math.random() * this.canvas.height);
        while (this.sea.isPointInSea(randomX, randomY)) {
          randomX = Math.floor(Math.random() * this.canvas.width);
          randomY = Math.floor(Math.random() * this.canvas.height);
        }
        this.sandyWaterDrops.push(
          new SandyWaterDrop(this.canvas, this.ctx, {
            x: randomX,
            y: randomY,
          })
        );
      }
    }

    if (this.frame % 100 === 0) {
      this.changeWeather(this.weather === "sunny" ? "rainy" : "sunny");
    }
  }

  draw() {
    let color =
      this.weather === "sunny" ? "rgba(0, 0, 0, 0)" : "rgba(0, 0, 0, 0.2)";
    const totalFrames = 20;

    if (this.isChanging && this.frame - this.startChangeFrame < totalFrames) {
      const progress = (this.frame - this.startChangeFrame) / totalFrames;

      if (this.weather === "sunny") {
        const opacity = 0.2 + (0 - 0.2) * progress;
        color = `rgba(0, 0, 0, ${opacity})`;
      }
      if (this.weather === "rainy") {
        const opacity = 0 + (0.2 - 0) * progress;
        color = `rgba(0, 0, 0, ${opacity})`;
      }
    } else if (this.frame - this.startChangeFrame === totalFrames) {
      this.isChanging = false;
    }

    this.ctx.save();
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.restore();

    this.clouds.forEach((cloud) => cloud.draw());

    this.seaWaterDrops.forEach((waterDrop) => {
      waterDrop.draw();
    });
    this.sandyWaterDrops.forEach((waterDrop) => {
      waterDrop.draw();
    });
  }
}
