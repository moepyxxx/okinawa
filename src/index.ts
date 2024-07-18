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
let frame: number = 0;

let isPaging: boolean = false;
let pagingStartFrame: number = 0;
let currentContentPage: string | null = null;
const pagingTotalFrames = 50;

let currentContent: ImageContent | null = null;

let sea: Sea | null = null;
let bubble: Bubble | null = null;
let footPrint: FootPrint | null = null;
let bird: Bird | null = null;
let title: Title | null = null;
let text: Text | null = null;
let imageContents: ImageContent[] = [];
let weather: Weather | null = null;

setup();
animate();

window.addEventListener("resize", () => {
  setup();
  animate();
});

function setup() {
  animationId = null;

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
  // 画像の初期化
  imageContents.forEach((contentImage) => {
    contentImage.removeCurrentContent();
  });
  imageContents = [];
  imageContents.push(
    ...[
      new ImageContent(
        canvas,
        ctx,
        "./images/sea_creatures.jpeg",
        ["./images/sea_creatures.jpeg", "./images/sea_creatures.jpeg"],
        {
          x: 100,
          y: row1,
        },
        "Sea Creatures",
        "沖縄の海にまったり住むカラフルで可愛いお魚たち",
        [
          "このクマノミとは、本部エリアから船で15分の場所に位置する",
          "水納島（みんなじま）で会いました",
          "",
          "沖縄の海はどこもかしこも天然の水族館",
          "砂浜から数メートルの遊泳エリアも海の中をのぞいてみれば魚たちが",
          "",
          "特に驚いたのはその近さ。近いって",
          "君たちは警戒心がないのかな？というくらい",
          "スレスレを通りかかります（追いかけたり触ったりしたらダメです）",
          "",
          "魚たちはたぶんそこが家なので家にいるだけですが",
          "私のこと好きなのかなと勘違いするくらいでした",
          "",
          "とにかくめちゃくちゃ可愛いー！",
          "（沖縄には毒のある魚もいるので、注意が必要みたいです）",
        ]
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
        ["./images/glass.jpeg", "./images/glass.jpeg"],
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
    drawContentBackground();
    drawContent();
  }

  // ページング中
  if (isPaging) {
    if (currentContentPage !== null) {
      drawTop();
    } else {
      drawContentBackground();
      drawContent();
    }

    const progress = (frame - pagingStartFrame) / pagingTotalFrames;
    drawContentBackground(progress);
  }

  // ページング終わり
  if (isPaging && frame - pagingStartFrame === pagingTotalFrames + 30) {
    window.scrollTo(0, 0);
    if (container && canvas) {
      container.style.height = currentContentPage === null ? "250vh" : "160vh";
      canvas.height =
        currentContentPage === null
          ? window.innerHeight * 2.5
          : window.innerHeight * 1.6;
    }
    isPaging = false;
    if (container) {
      container.style.cursor = "default";
    }

    if (currentContentPage === null) {
      currentContent = null;
    }
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

  imageContents.forEach((contentImage) => {
    contentImage.drawTopContent();
  });

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

function drawContentBackground(progress: number = 1) {
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

function drawContent() {
  if (!currentContent) {
    throw new Error("cannot get currentContent");
  }
  currentContent.drawContent(pagingStartFrame);
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
    currentContent.setCurrentContent();
  }
  // コンテンツがあるが表示が終わっている場合
  if (
    currentContentPage !== null &&
    currentContent !== null &&
    currentContent.isCurrentImageContent === false
  ) {
    currentContent.removeCurrentContent();
    currentContentPage = null;
    isPaging = true;
    pagingStartFrame = frame;
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
  // imageContents.forEachのupdateと重複する
  // currentContent?.update();
}

function animate() {
  if (canvas == null || ctx == null) {
    throw new Error("cannot get canvas");
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  draw();
  update();

  animationId = requestAnimationFrame(animate);
}
