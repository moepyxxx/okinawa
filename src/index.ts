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
let titleHeight: number;

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
  if (animationId !== null) {
    cancelAnimationFrame(animationId);
  }
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
  canvas.height =
    window.innerHeight < window.innerWidth / 2
      ? window.innerHeight * 4
      : window.innerHeight * 2;
  container.style.height = `${
    window.innerHeight < window.innerWidth / 2
      ? window.innerHeight * 4
      : window.innerHeight * 2
  }px`;
  canvas.style.backgroundColor = "#fdf5e6";
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#fff";
  titleHeight = canvas.height / 4;

  sea = new Sea(canvas, ctx);
  bubble = new Bubble(canvas, ctx);
  footPrint = new FootPrint(canvas, ctx);
  bird = new Bird(canvas, ctx);

  title = new Title(
    canvas,
    ctx,
    [
      { text: "O", width: 150 },
      { text: "K", width: 140 },
      { text: "I", width: 70 },
      { text: "N", width: 130 },
      { text: "A", width: 130 },
      { text: "W", width: 160 },
      { text: "A", width: 150 },
    ],
    titleHeight
  );
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
        "./images/sea.jpeg",
        ["./images/sea_sub_1.jpeg", "./images/sea_sub_2.jpeg"],
        {
          x: 100,
          y: row1,
        },
        "Sea",
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
          "",
          "沖縄の海には深い青の海、青い海、",
          "エメラルドグリーンの海、肌色の海があります",
          "海が綺麗すぎて外からでも海の中が透き通って見えるんですよね〜",
        ]
      ),
      new ImageContent(
        canvas,
        ctx,
        "./images/food.jpeg",
        ["./images/food_sub_1.jpeg", "./images/food_sub_2.jpeg"],
        {
          x: canvas.width / 2 - imageWidth / 2,
          y: row1,
        },
        "Food",
        "美味しかった沖縄のお料理たち",
        [
          "大好きな沖縄料理もたくさん食べました",
          "",
          "定番の家庭料理である",
          "チャンプルー、沖縄そば、ラフテー、海ぶどうから",
          "アグーの焼肉、アメリカ文化の根づくハンバーガーまで",
          "",
          "おやつにはブルーシールやサーターアンダギーも",
          "（食べすぎてすべて載せきれません）",
          "",
          "沖縄グルメは本州でも人気なので食べれますが",
          "現地で食べると一味違いますね〜☺️",
          "",
          "ハンバーガーは沖縄のちょうど中央くらいにある",
          "美浜アメリカンビレッジで。ジャンキー！",
          "",
          "ねらっていたソウルフードのポーク卵サンドだけ",
          "お腹いっぱいで食べれなかったのが心残り…",
        ]
      ),
      new ImageContent(
        canvas,
        ctx,
        "./images/nature.jpeg",
        ["./images/nature_sub_1.jpeg", "./images/nature_sub_2.jpeg"],
        {
          x: canvas.width - imageWidth - 100,
          y: row1,
        },
        "Nature",
        "海だけじゃない！ ゆたかな沖縄の自然と絶景",
        [
          "沖縄といえばエメラルドグリーンの海が象徴的ですが",
          "熱帯地域ならではの自然も豊か",
          "",
          "観光に行った備瀬のフクギ並木は",
          "砂浜からすぐに陸地に入った場所にたたずむ",
          "夏でも木漏れ日が涼しくおしゃれで綺麗な場所でした",
          "",
          "そして沖縄の花といえばハイビスカス！",
          "大ぶりで色とりどりでとっても可愛かった〜",
          "",
          "ホテルの中でも道路でも見つけることができたので",
          "見つけるたびに写真を撮って嬉しくなりました",
          "",
          "海もいいけど、陸地の自然もよい！",
        ]
      ),
      new ImageContent(
        canvas,
        ctx,
        "./images/sake.jpeg",
        ["./images/sake_sub_1.jpeg", "./images/sake_sub_2.jpeg"],
        {
          x: 100,
          y: row2,
        },
        "Sake",
        "美味しかった沖縄のお酒たち",
        [
          "お酒大好きなので滞在中はずっと飲んでいた私",
          "",
          "特にオリオンビールやシークワーサーサワー、泡盛など",
          "沖縄ご当地なお酒をいただいて",
          "（とある1日だけヒルトンでワインを飲みすぎています🥺）",
          "",
          "特に思い出深いのが国際通りの居酒屋さん",
          "泡盛大好きな店員さんから毛色の違う泡盛を",
          "色々と飲ませてもらいました",
          "",
          "泡盛も日本酒と同じく古酒があって、なかなかそれは泡盛でした",
          "",
          "沖縄おつまみもむろん絶品でした",
          "（島らっきょう、海ぶどう、てびち）",
          "",
          "でも本州に帰ってきて日本酒飲んでみたら",
          "やっぱり日本酒が1番〜って思いました。笑",
        ]
      ),
      new ImageContent(
        canvas,
        ctx,
        "./images/glass.jpeg",
        ["./images/glass_sub_1.jpeg", "./images/glass_sub_2.jpeg"],
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
        ["./images/hotel_sub_1.jpeg", "./images/hotel_sub_2.jpeg"],
        {
          x: canvas.width - imageWidth - 100,
          y: row2,
        },
        "Hotel",
        "異国感ただよう超絶ほすすぎなリゾートホテル",
        [
          "沖縄旅行がはじまったときは",
          "こんなにお世話になると思っていなかったのが",
          "滞在中ずーっと帰る家になっていたヒルトン瀬底リゾート",
          "",
          "正直沖縄のアクティビティや観光が",
          "楽しみすぎてホテルは何も考えずでしたが",
          "結論めちゃくちゃ素敵だったぞ〜✨",
          "",
          "まず1日目は部屋のベランダから花火を見た",
          "2日目は部屋のベランダで缶チューハイとアイスを",
          "3日目は併設のビーチとプールを満喫",
          "",
          "ホスピタリティ抜群で",
          "何度もいろんなところでお世話になりました",
        ]
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
    window.innerHeight < window.innerWidth / 2
      ? window.innerHeight * 4
      : window.innerHeight * 2;

    const topHeight =
      window.innerHeight < window.innerWidth / 2
        ? window.innerHeight * 4
        : window.innerHeight * 2;
    const contentHeight =
      window.innerHeight > (window.innerWidth / 3) * 2
        ? window.innerHeight * 1.5
        : window.innerHeight * 2;
    window.scrollTo(0, 0);
    if (container && canvas) {
      container.style.height =
        currentContentPage === null ? `${topHeight}px` : `${contentHeight}px`;
      canvas.height = currentContentPage === null ? topHeight : contentHeight;
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

  // 以下が上に重ねたくないもの
  title?.drawSun();
  title?.drawTitle();
  text?.drawText(
    "／ いえーい！旅行の思い出と魅力をぎゅっとまとめてみました ＼",
    30,
    canvasWidth / 2,
    titleHeight + 60,
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

  imageContents.forEach((contentImage) => {
    contentImage.drawTopContent();
  });
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
  const startHeight = titleHeight * 2 - 50;

  ctx.save();
  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#fff";

  const startX = canvasWidth / 2;
  const startY = startHeight - 130;

  const midY = startHeight - 130 + 80;
  const endX = canvas.width / 2 + 20;
  const endY = startHeight - 130 + 60;

  ctx.moveTo(startX, startY);

  const totalFrames = 50;
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
    startHeight - 20,
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
