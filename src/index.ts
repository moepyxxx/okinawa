import { Bird } from "./bird";
import { Bubble } from "./bubble";
import { FootPrint } from "./footPrint";
import { ImageContent } from "./imageContent";
import { Sea } from "./sea";
import { Text } from "./text";
import { Title } from "./title";
import { Weather } from "./weather";

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let container: HTMLElement | null = null;

let animationId: number | null;
let lastTime: number = 0;
let fps: number = 0;
let interval: number = 0;
let frame: number = 0;
let contentsStartFrame: number = 0;

let isPaging: boolean = false;
let pagingStartFrame: number = 0;
let currentContentPage: string | null = null;
const pagingTotalFrames = 10;

let currentContent: ImageContent | null = null;

let sea: Sea | null = null;
let bubble: Bubble | null = null;
let footPrint: FootPrint | null = null;
let bird: Bird | null = null;
let title: Title | null = null;
let text: Text | null = null;
const imageContents: ImageContent[] = [];
let weather: Weather | null = null;

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
  container = document.querySelector(".container") as HTMLElement;
  if (canvas == null || ctx == null || container == null) {
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

  const imageWidth = (canvas.width - 200 - 40 * 3) / 3;
  const imageHeight = imageWidth * (2 / 3);
  const row1 =
    canvas.height / 2 + (canvas.height / 2 - (40 + 2 * imageHeight)) / 2;
  const row2 = row1 + imageHeight + 40;
  imageContents.push(
    ...[
      new ImageContent(
        canvas,
        ctx,
        "./images/sea_creatures.jpeg",
        [],
        {
          x: 100,
          y: row1,
        },
        "Sea Creatures",
        "",
        [""]
      ),
      new ImageContent(
        canvas,
        ctx,
        "./images/food.jpeg",
        [],
        {
          x: canvas.width / 2 - imageWidth / 2,
          y: row1,
        },
        "Food",
        "",
        [""]
      ),
      new ImageContent(
        canvas,
        ctx,
        "./images/nature.jpeg",
        [],
        {
          x: canvas.width - imageWidth - 100,
          y: row1,
        },
        "Nature",
        "",
        [""]
      ),
      new ImageContent(
        canvas,
        ctx,
        "./images/sea.jpeg",
        [],
        {
          x: 100,
          y: row2,
        },
        "Sea",
        "",
        [""]
      ),
      new ImageContent(
        canvas,
        ctx,
        "./images/glass.jpeg",
        [],
        {
          x: canvas.width / 2 - imageWidth / 2,
          y: row2,
        },
        "Glass",
        "沖縄の自然みたいにきれいな琉球ガラスの世界",
        [
          "沖縄に行ったら絶対おみやげに欲しいと",
          "思っていたのがこの琉球ガラス",
          "",
          "今回はとある工房さんをたずねて",
          "吹きガラス体験をしてみました〜",
          "",
          "ガラスの素材を選ぶのにめちゃガチ悩み",
          "",
          "わたしは沖縄の海の中、",
          "珊瑚礁をイメージしたカラフルな仕上がりに",
          "",
          "樽のようにずんぐりむっくりのグラスは",
          "家で泡盛を飲むのにぴったりでした",
        ]
      ),
      new ImageContent(
        canvas,
        ctx,
        "./images/hotel.jpeg",
        [],
        {
          x: canvas.width - imageWidth - 100,
          y: row2,
        },
        "Hotel",
        "",
        [""]
      ),
    ]
  );
  imageContents.forEach((contentImage) => {
    window.addEventListener("click", (e) => {
      const isClicked = contentImage.isPointInImage(e.offsetX, e.offsetY);
      if (isClicked) {
        currentContentPage = contentImage.title;
        isPaging = true;
        pagingStartFrame = frame;
      }
    });
  });
  window.addEventListener("mousemove", (e) => {
    if (!container) return;

    const isHovered = imageContents.some((content) =>
      content.isPointInImage(e.offsetX, e.offsetY)
    );
    if (isHovered) {
      container.style.cursor = "pointer";
    } else {
      container.style.cursor = "default";
    }
  });

  weather = new Weather(canvas, ctx, sea);
}

function draw() {
  if (ctx == null) {
    throw new Error("cannot get canvas");
  }

  if (!isPaging && currentContentPage === null) {
    drawTop();
  }

  if (!isPaging && currentContentPage !== null) {
    drawContentsBackground();
    drawContents();
  }

  // ページング中
  if (isPaging) {
    currentContentPage === null ? drawContents() : drawTop();

    const progress = (frame - pagingStartFrame) / pagingTotalFrames;
    drawContentsBackground(progress);
  }

  // ページング終わり
  if (isPaging && frame - pagingStartFrame === pagingTotalFrames) {
    window.scrollTo(0, 0);
    isPaging = false;
    if (container) {
      container.style.cursor = "default";
    }

    // コンテンツフレームを初期化
    currentContentPage === null
      ? (contentsStartFrame = 0)
      : contentsStartFrame === frame;
  }
}

function drawTop() {
  if (ctx == null) {
    throw new Error("cannot get canvas");
  }

  const canvasWidth = canvas?.width ?? 0;
  const canvasHeight = canvas?.height ?? 0;

  sea?.drawSandyBeach();
  sea?.drawWaves();
  sea?.drawSea();
  bubble?.draw();
  footPrint?.draw();
  bird?.draw();

  weather?.draw();

  // 以下が上に重ねたくないもの
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
  drawScrollDown();
  text?.drawText(
    "Contents",
    60,
    100,
    canvasHeight / 2 + 100,
    "left",
    "bold",
    "#fff"
  );
  imageContents.forEach((contentImage) => {
    contentImage.drawTopContent();
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

function drawContentsBackground(progress: number = 1) {
  if (ctx == null) {
    throw new Error("cannot get canvas");
  }

  const canvasWidth = canvas?.width ?? 0;
  const canvasHeight = canvas?.height ?? 0;

  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, canvasWidth, canvasHeight);
  ctx.fillStyle = `rgba(0, 175, 204, ${progress})`;
  ctx.fill();
  ctx.restore();
}

function drawContents() {
  if (!currentContent) {
    throw new Error("cannot get currentContent");
  }
  currentContent.drawSubContent();
}

function drawScrollDown() {
  if (canvas == null || ctx == null) {
    throw new Error("cannot get canvas");
  }

  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  ctx.save();
  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#fff";

  const startX = canvasWidth / 2;
  const startY = (canvasHeight / 5) * 2 - 160;

  const midY = (canvasHeight / 5) * 2 - 80;
  const endX = canvas.width / 2 + 20;
  const endY = (canvasHeight / 5) * 2 - 100;

  ctx.moveTo(startX, startY);

  const totalFrames = 30;
  const progress = (frame % totalFrames) / totalFrames;

  if (progress < 0.5) {
    const currentY = startY + (midY - startY) * (progress * 2);
    ctx.lineTo(startX, currentY);
  } else {
    ctx.lineTo(startX, midY);
    const additionalProgress = (progress - 0.4) * 2;
    const currentX = startX + (endX - startX) * additionalProgress;
    const currentY = midY + (endY - midY) * additionalProgress;
    ctx.lineTo(currentX, currentY);
  }

  ctx.stroke();
  ctx.closePath();
  ctx.restore();

  text?.drawText(
    "scroll down",
    20,
    canvasWidth / 2,
    (canvasHeight / 5) * 2 - 50,
    "center",
    "",
    "#fff"
  );
}

function update() {
  if (canvas == null || ctx == null) {
    throw new Error("cannot get canvas");
  }

  // コンテンツがある場合は準備
  if (currentContentPage !== null && currentContent === null) {
    const contentImage = imageContents.find(
      (content) => content.title === currentContentPage
    );
    if (!contentImage || !contentImage.image) {
      throw new Error("cannot get title");
    }
    currentContent = contentImage;
  }

  // 各インスタンスの更新
  frame++;
  sea?.update();

  footPrint?.update();
  title?.update();
  imageContents.forEach((contentImage) => {
    contentImage.update();
  });
  weather?.update();
  currentContent?.update();
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
