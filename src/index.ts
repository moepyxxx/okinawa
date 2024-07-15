import { Bird } from "./bird";
import { Bubble } from "./bubble";
import { Cloud } from "./cloud";
import { FootPrint } from "./footPrint";
import { ContentImage } from "./image";
import { Sea } from "./sea";
import { Text } from "./text";
import { Title } from "./title";
import { Position } from "./type";

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;

let animationId: number | null;
let lastTime: number = 0;
let fps: number = 0;
let interval: number = 0;

let sea: Sea | null = null;
let bubble: Bubble | null = null;
let footPrint: FootPrint | null = null;
let bird: Bird | null = null;
let title: Title | null = null;
let text: Text | null = null;
let cloud: Cloud | null = null;
const cloudPositions: {
  shadow: Position;
  cloud: Position;
  size: number;
}[] = [];
const contentImages: ContentImage[] = [];

setup();
animate(0);

window.addEventListener("resize", () => {
  setup();
  draw();
});

function setup() {
  animationId = null;
  lastTime = 0;
  fps = 10;
  interval = 1000 / fps;

  canvas = document.querySelector("canvas");
  ctx = canvas?.getContext("2d") ?? null;
  if (canvas == null || ctx == null) {
    throw new Error("cannot get canvas");
  }

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight * 2.5;
  canvas.style.backgroundColor = "#fdf5e6";
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#fff";

  sea = new Sea(canvas, ctx);
  bubble = new Bubble(canvas, ctx);
  footPrint = new FootPrint(canvas, ctx);
  bird = new Bird(canvas, ctx);

  title = new Title(canvas, ctx, [
    { text: "O", width: 150 },
    { text: "K", width: 140 },
    { text: "I", width: 70 },
    { text: "N", width: 130 },
    { text: "A", width: 130 },
    { text: "W", width: 160 },
    { text: "A", width: 150 },
  ]);
  text = new Text(canvas, ctx);
  cloud = new Cloud(canvas, ctx);
  cloudPositions.push(
    ...[
      {
        shadow: {
          x: canvas.width - 200,
          y: canvas.height / 2 + 300,
        },
        cloud: {
          x: canvas.width - 200,
          y: canvas.height / 2,
        },
        size: 1,
      },
      {
        shadow: {
          x: -300,
          y: -200 + 150,
        },
        cloud: {
          x: -300,
          y: -200,
        },
        size: 0.6,
      },
      {
        shadow: {
          x: canvas.width / 5,
          y: (canvas.height / 7) * 6.5 + 150,
        },
        cloud: {
          x: canvas.width / 5,
          y: (canvas.height / 7) * 6.5,
        },
        size: 0.9,
      },
    ]
  );

  const imageWidth = (canvas.width - 200 - 40 * 3) / 3;
  const imageHeight = imageWidth * (2 / 3);
  const row1 =
    canvas.height / 2 + (canvas.height / 2 - (40 + 2 * imageHeight)) / 2;
  const row2 = row1 + imageHeight + 40;
  contentImages.push(
    ...[
      new ContentImage(
        canvas,
        ctx,
        "./images/sea_creatures.jpeg",
        {
          x: 100,
          y: row1,
        },
        imageWidth,
        imageHeight,
        20
      ),
      new ContentImage(
        canvas,
        ctx,
        "./images/food.jpeg",
        {
          x: canvas.width / 2 - imageWidth / 2,
          y: row1,
        },
        imageWidth,
        imageHeight,
        20
      ),
      new ContentImage(
        canvas,
        ctx,
        "./images/nature.jpeg",
        {
          x: canvas.width - imageWidth - 100,
          y: row1,
        },
        imageWidth,
        imageHeight,
        20
      ),
      new ContentImage(
        canvas,
        ctx,
        "./images/sea.jpeg",
        {
          x: 100,
          y: row2,
        },
        imageWidth,
        imageHeight,
        20
      ),
      new ContentImage(
        canvas,
        ctx,
        "./images/glass.jpeg",
        {
          x: canvas.width / 2 - imageWidth / 2,
          y: row2,
        },
        imageWidth,
        imageHeight,
        20
      ),
      new ContentImage(
        canvas,
        ctx,
        "./images/hotel.jpeg",
        {
          x: canvas.width - imageWidth - 100,
          y: row2,
        },
        imageWidth,
        imageHeight,
        20
      ),
    ]
  );
}

function draw() {
  const canvasWidth = canvas?.width ?? 0;
  const canvasHeight = canvas?.height ?? 0;

  sea?.drawSandyBeach();
  sea?.drawWaves();
  sea?.drawSea();
  bubble?.draw();
  footPrint?.draw();
  bird?.draw();
  title?.drawSun();
  title?.drawTitle();
  text?.drawText(
    "／ いえーい！旅行の思い出と魅力をぎゅっとまとめてみました ＼",
    30,
    canvasWidth / 2,
    window.innerHeight / 2 + 60,
    "center",
    "bold",
    "rgba(0, 175,204, .5)",
    "#0068b7"
  );

  text?.drawText(
    "Contents",
    60,
    100,
    canvasHeight / 2 + 100,
    "left",
    "bold",
    "#fff"
  );
  contentImages.forEach((contentImage) => {
    contentImage.draw();
  });
  text?.drawText(
    "気になる画像をクリックしてみてください",
    20,
    100,
    canvasHeight / 2 + 160,
    "left",
    "",
    "#fff"
  );
  contentImages.forEach((contentImage) => {
    contentImage.draw();
  });

  for (let i = 0; i < cloudPositions.length; i++) {
    const {
      shadow: shadowPosition,
      cloud: cloudPosition,
      size,
    } = cloudPositions[i];
    cloud?.drawCloud(
      shadowPosition.x,
      shadowPosition.y,
      size,
      "rgba(47, 79, 79, .2)",
      "rgba(47, 79, 79, .2)",
      "blur(2px)"
    );
    cloud?.drawCloud(
      cloudPosition.x,
      cloudPosition.y,
      size,
      "#fafdff",
      "#efefef"
    );
  }

  text?.drawText(
    "© 2024 iwa moe",
    14,
    canvasWidth / 2,
    canvasHeight - 20,
    "center",
    "",
    "#abb1b5"
  );
}

function update() {
  sea?.update();
  footPrint?.update();
  title?.update();
  contentImages.forEach((contentImage) => {
    contentImage.update();
  });
}

function animate(timestamp: number) {
  if (canvas == null || ctx == null) {
    throw new Error("cannot get canvas");
  }
  if (timestamp - lastTime > interval) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw();
    update();
    lastTime = timestamp;
  }
  animationId = requestAnimationFrame(animate);
}
