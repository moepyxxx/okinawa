let canvas, ctx, animationId, lastTime, fps, interval;
let waveFrame,
  baseStart,
  baseMiddle,
  baseXRange,
  baseYRange,
  baseEnd,
  baseYEnd,
  bubblePositions,
  bubbleCount,
  footPrintCoordinates,
  birdCurrentX,
  birdCurrentY,
  birdTargetX,
  birdTargetY,
  isBirdRotating,
  rotateTargetAngle,
  birdAngle,
  titleHeight,
  seaCreaturesImage,
  foodImage,
  natureImage,
  seaImage,
  glassImage,
  hotelImage,
  imageSettings;

let lastScrollPosition;

await setup();
animate(0);

window.addEventListener("resize", () => {
  setup();
  draw();
});

window.addEventListener("scroll", () => {
  const currentScrollPosition =
    window.scrollY || document.documentElement.scrollTop;

  if (currentScrollPosition > lastScrollPosition) {
    console.log("下方向にスクロール中");
  }

  lastScrollPosition = currentScrollPosition;
});

async function setup() {
  canvas = document.querySelector("#canvas");
  ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight * 2.5;
  titleHeight = window.innerHeight;
  canvas.style.backgroundColor = "#fdf5e6";
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#fff";
  animationId = null;
  lastTime = 0;
  fps = 10;
  interval = 1000 / fps;

  waveFrame = 0;
  baseStart = 0;
  baseXRange = 600;
  baseYRange = 600;
  baseMiddle = canvas.width / 2;
  baseEnd = canvas.width;
  baseYEnd = (canvas.height / 4) * 2;
  bubbleCount = 200;
  bubblePositions = [...Array(bubbleCount)].map(() => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 6,
    opacity: Math.random(),
  }));
  footPrintCoordinates = [];
  setFootPrintCoordinates();
  birdCurrentX = 100;
  birdCurrentY = titleHeight / 2;
  // offset分を足す
  birdTargetX = canvas.width + 400;
  birdTargetY = 0 - 400;
  isBirdRotating = false;
  rotateTargetAngle = 0;
  birdAngle = 0;
  lastScrollPosition = 0;

  seaCreaturesImage = await loadImage("./images/sea_creatures.jpeg");
  foodImage = await loadImage("./images/food.jpeg");
  natureImage = await loadImage("./images/nature.jpeg");
  seaImage = await loadImage("./images/sea.jpeg");
  glassImage = await loadImage("./images/glass.jpeg");
  hotelImage = await loadImage("./images/hotel.jpeg");
  imageSettings = [
    {
      image: seaCreaturesImage,
    },
    {
      image: foodImage,
    },
    {
      image: natureImage,
    },
    {
      image: seaImage,
    },
    {
      image: glassImage,
    },
    {
      image: hotelImage,
    },
  ];
}

function draw() {
  // 海の跡がついた砂浜
  drawSandyBeach();

  // 波
  drawWaves();

  // 海の深いところ
  drawSea();

  // 泡
  drawBubbles();

  // 足跡
  drawFootPrints();

  // 鳥ちゃん
  fryingBird();

  // 後ろの線
  // drawUnderWaveLine();

  // テキスト
  const texts = [
    { text: "O", width: 150 },
    { text: "K", width: 140 },
    { text: "I", width: 70 },
    { text: "N", width: 130 },
    { text: "A", width: 130 },
    { text: "W", width: 160 },
    { text: "A", width: 150 },
  ];
  drawMainTexts(texts);
  drawSubText(
    "／ 沖縄旅行の思い出と魅力をぎゅっとまとめてみました ＼",
    30,
    canvas.width / 2,
    titleHeight / 2 + 60
  );

  // 画像
  const width = (canvas.width - 200 - 40 * 3) / 3;
  const height = width * (2 / 3);
  const row1 = canvas.height / 2 + (canvas.height / 2 - (40 + 2 * height)) / 2;
  const row2 = row1 + height + 40;
  const imagePositions = [
    {
      image: natureImage,
      x: 100,
      y: row1,
    },
    {
      image: foodImage,
      x: canvas.width / 2 - width / 2,
      y: row1,
    },
    {
      image: seaImage,
      x: canvas.width - width - 100,
      y: row1,
    },
    {
      image: seaCreaturesImage,
      x: 100,
      y: row2,
    },
    {
      image: hotelImage,
      x: canvas.width / 2 - width / 2,
      y: row2,
    },
    {
      image: glassImage,
      x: canvas.width - width - 100,
      y: row2,
    },
  ];
  for (let i = 0; i < imagePositions.length; i++) {
    const { image, x, y } = imagePositions[i];
    drawRoundedRectImage(image, x, y, width, height, 20, i);
  }

  // 雲
  const cloudPositions = [
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
  ];
  for (let i = 0; i < cloudPositions.length; i++) {
    const { shadow, cloud, size } = cloudPositions[i];
    drawCloud(
      shadow.x,
      shadow.y,
      size,
      "rgba(47, 79, 79, .2)",
      "rgba(47, 79, 79, .2)",
      "blur(2px)"
    );
    drawCloud(cloud.x, cloud.y, size, "#fafdff", "#efefef");
  }

  // コピーライト
  drawCopyRight();
}

function drawWaves() {
  const min = 30;
  const max = 100;

  for (let moveRange = min; moveRange < max; moveRange += 10) {
    /**
     * -50〜50の間をspeed10の速さで行き来するsin波を作る
     * 値が大きければspeedは小さくなる
     */
    const moveSpeed = moveRange - 20;
    const offset = moveRange * Math.sin(waveFrame / moveSpeed);

    let waveX = baseStart;
    let waveY = baseStart;
    let waveIdx = 1;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(waveX, waveY);

    while (waveY < canvas.height) {
      const lc1 = {
        x: waveIdx * baseXRange + offset,
        y: waveY - offset,
      };
      const lc2 = {
        x: waveX - offset,
        y: waveIdx * baseYRange + offset,
      };
      const lp = {
        x: waveIdx * baseXRange,
        y: waveIdx * baseYRange,
      };
      ctx.bezierCurveTo(lc1.x, lc1.y, lc2.x, lc2.y, lp.x, lp.y);
      ctx.lineTo(lp.x, lp.y);
      waveX += baseXRange;
      waveY += baseXRange;
      waveIdx++;
    }
    ctx.lineTo(waveX, waveY);
    ctx.lineTo(0, canvas.height);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.strokeStyle = "rgba(0, 175,204, .5)";
    ctx.fillStyle = "rgba(0, 175,204, .2)";
    ctx.stroke();
    ctx.fill();
    ctx.restore();
  }
}

function drawSandyBeach() {
  let offsetS = 150;
  let sandX = baseStart + offsetS;
  let sandY = baseStart - offsetS;
  let seaIdx = 1;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(sandX, sandY);

  while (sandY < canvas.height + offsetS) {
    const lc1 = {
      x: seaIdx * baseXRange + offsetS,
      y: sandY - offsetS,
    };
    const lc2 = {
      x: sandX + offsetS,
      y: seaIdx * baseYRange - offsetS,
    };
    const lp = {
      x: seaIdx * baseXRange + offsetS,
      y: seaIdx * baseYRange - offsetS,
    };
    ctx.bezierCurveTo(lc1.x, lc1.y, lc2.x, lc2.y, lp.x, lp.y);
    ctx.lineTo(lp.x, lp.y);
    sandX += baseXRange;
    sandY += baseYRange;
    seaIdx++;
  }
  ctx.lineTo(sandX, sandY);
  ctx.lineTo(0, canvas.height);
  ctx.lineTo(0, 0);
  ctx.closePath();
  ctx.filter = "blur(2px)";
  ctx.strokeStyle = "#ffefd5";
  ctx.fillStyle = "#ffefd5";
  ctx.stroke();
  ctx.fill();
  ctx.restore();
}

function drawSea() {
  let offsetF = -100;
  let seaX = baseStart + offsetF;
  let seaY = baseStart - offsetF;
  let seaIdx = 1;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(seaX, seaY);

  while (seaY < canvas.height + offsetF) {
    const lc1 = {
      x: seaIdx * baseXRange + offsetF,
      y: seaY - offsetF,
    };
    const lc2 = {
      x: seaX + offsetF,
      y: seaIdx * baseYRange - offsetF,
    };
    const lp = {
      x: seaIdx * baseXRange + offsetF,
      y: seaIdx * baseYRange - offsetF,
    };
    ctx.bezierCurveTo(lc1.x, lc1.y, lc2.x, lc2.y, lp.x, lp.y);
    ctx.lineTo(lp.x, lp.y);
    seaX += baseXRange;
    seaY += baseYRange;
    seaIdx++;
  }
  ctx.lineTo(seaX, seaY);
  ctx.lineTo(0, canvas.height);
  ctx.lineTo(0, 0);
  ctx.closePath();
  ctx.filter = "blur(3px)";
  ctx.strokeStyle = "#00afcc";
  ctx.fillStyle = "#00afcc";
  ctx.stroke();
  ctx.fill();
  ctx.restore();
}

function drawBubbles() {
  for (let i = 0; i < bubbleCount; i++) {
    const x = bubblePositions[i].x;
    const y = bubblePositions[i].y;
    const radius = bubblePositions[i].radius;
    const bubbleColor = `rgba(255, 255, 255, ${bubblePositions[i].opacity})`;
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = bubbleColor;
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawFootPrints() {
  const maxCount = waveFrame / 10;
  let count = 0;
  if (maxCount === 0) return;

  while (count <= maxCount && count < footPrintCoordinates.length) {
    const { x, y } = footPrintCoordinates[count];
    count % 2 === 0 ? drawRightFootPrint(x, y) : drawLeftFootPrint(x, y);
    count++;
  }
}

function fryingBird() {
  const speed = 30;
  const offset = 400;
  if (isBirdRotating) {
    // まだ回転していない場合はターゲットと回転ターゲット度数を決める
    if (rotateTargetAngle === 0) {
      const rand = Math.random();
      // 左上周辺
      if (birdTargetX <= canvas.width / 2 && birdTargetY <= titleHeight / 2) {
        birdTargetX =
          rand > 0.5
            ? canvas.width + offset
            : Math.floor(
                Math.random() * (canvas.width - canvas.width / 2 + 1)
              ) +
              canvas.width / 2;
        birdTargetY =
          rand > 0.5
            ? Math.floor(Math.random() * (titleHeight - titleHeight / 2 + 1)) +
              titleHeight / 2
            : titleHeight + offset;

        // 右上周辺
      } else if (
        birdCurrentX >= canvas.width / 2 &&
        birdCurrentY <= titleHeight
      ) {
        birdTargetX =
          rand > 0.5
            ? 0 - offset
            : Math.floor(Math.random() * (canvas.width / 2 - 0 + 1)) + 0;
        birdTargetY =
          rand > 0.5
            ? Math.floor(Math.random() * (titleHeight - titleHeight / 2 + 1)) +
              titleHeight / 2
            : titleHeight + offset;

        // 右下周辺
      } else if (
        birdCurrentX >= canvas.width / 2 &&
        birdCurrentY >= titleHeight
      ) {
        birdTargetX =
          rand > 0.5
            ? 0 - offset
            : Math.floor(Math.random() * (canvas.width / 2 - 0 + 1)) + 0;
        birdTargetY =
          rand > 0.5
            ? Math.floor(Math.random() * (canvas.width / 2 - 0 + 1)) + 0
            : 0 - offset;

        // 左下周辺
      } else {
        birdTargetX =
          rand > 0.5
            ? canvas.width + offset
            : Math.floor(
                Math.random() * (canvas.width - canvas.width / 2 + 1)
              ) +
              canvas.width / 2;
        birdTargetY =
          rand > 0.5
            ? Math.floor(Math.random() * (titleHeight / 2 - 0 + 1)) + 0
            : 0 - offset;
      }

      const { ux, uy } = calcNormal(
        birdCurrentX,
        birdCurrentY,
        birdTargetX,
        birdTargetY
      );

      rotateTargetAngle = calcAngleFromNormal(ux, uy);
    }

    // 回転させる
    // 特に回転させる必要がなくなったときは回転フラグをfalseにする
    if (birdAngle < rotateTargetAngle) {
      birdAngle += speed;
      birdCurrentX += speed;
      birdCurrentY += speed;
      if (birdAngle > rotateTargetAngle) {
        isBirdRotating = false;
        rotateTargetAngle = 0;
      }
    } else if (birdAngle > rotateTargetAngle) {
      birdAngle -= speed;
      birdCurrentX += speed;
      birdCurrentY += speed;
      if (birdAngle < rotateTargetAngle) {
        isBirdRotating = false;
        rotateTargetAngle = 0;
      }
    }
  } else {
    const { ux, uy } = calcNormal(
      birdCurrentX,
      birdCurrentY,
      birdTargetX,
      birdTargetY
    );
    const dist = distance(birdCurrentX, birdCurrentY, birdTargetX, birdTargetY);
    if (dist >= 20) {
      birdCurrentX += ux * speed;
      birdCurrentY += uy * speed;
      birdAngle = calcAngleFromNormal(ux, uy);
    } else {
      isBirdRotating = true;
    }
  }

  drawBird(birdCurrentX, birdCurrentY, birdAngle, "rgba(47, 79, 79, .8)");
  drawBird(birdCurrentX, birdCurrentY + 100, birdAngle, "rgba(47, 79, 79, .2)");
}

function drawBird(x, y, angle, color = "#2f4f4f") {
  ctx.save();

  ctx.translate(x, y);
  // angleは右から時計回りだが、画像は上が基準のため
  ctx.rotate(((90 + angle) * Math.PI) / 180);

  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(30, 0, 64.5, 40.5);
  ctx.quadraticCurveTo(26.7, 12.5, 0.5, 12.5);
  ctx.quadraticCurveTo(-26, 12.5, -64, 40.5);
  ctx.quadraticCurveTo(-29.2, 0, 0.5, 0);
  ctx.fill();

  ctx.restore();
}

function drawMainTexts(texts) {
  const sumWidth = texts
    .map((t) => t.width)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  const startX = (canvas.width - sumWidth) / 2;

  // ヒトデ
  // drawStar(startX - 50, titleHeight / 2 - 150, 5, 30, 15, "#e0ffff");
  // drawStar(startX + sumWidth + 50, titleHeight / 2 + 50, 5, 30, 15, "#00bfff");

  ctx.save();
  const gradient = ctx.createLinearGradient(
    startX,
    titleHeight / 2 - 75,
    startX + sumWidth,
    titleHeight / 2 + 75
  );

  // HSL色空間で色を生成
  const startHue1 = 120;
  const endHue1 = 255;

  const startHue2 = 255;
  const endHue2 = 100;

  // 補間値を計算
  const t = (Math.sin(waveFrame / 20) + 1) / 2; // 0から1までの範囲で循環する値を生成

  const hue1 = startHue1 * (1 - t) + endHue1 * t;
  const hue2 = startHue2 * (1 - t) + endHue2 * t;

  gradient.addColorStop(0, `hsl(${hue1}, 100%, 42%)`);
  gradient.addColorStop(1, `hsl(${hue2}, 100%, 79%)`);

  ctx.lineWidth = 12;
  ctx.font = "bold 150px Arial";
  ctx.strokeStyle = gradient;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  for (let i = 0; i < texts.length; i++) {
    let x = startX;
    for (let j = 0; j < i; j++) {
      x += texts[j].width;
    }
    ctx.strokeText(texts[i].text, x, titleHeight / 2);
  }
  ctx.restore();
}

function drawSubText(text, size, x, y) {
  ctx.save();
  ctx.font = `${size}px Noto Sans JP`;
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, y);
  ctx.restore();
}

function setFootPrintCoordinates() {
  let startX = canvas.width;
  let startY = (titleHeight / 9) * 8;
  footPrintCoordinates = [];

  while (startY > -20) {
    footPrintCoordinates.push({ x: startX, y: startY });
    startX -= 10;

    if (footPrintCoordinates.length % 2 !== 0) {
      startX -= 40;
      startY -= 30;
    } else {
      startX -= -30;
      startY -= 70;
    }
  }
}

function drawUnderWaveLine() {
  const x = canvas.width / 2;
  const y = titleHeight / 2 + 80;
  ctx.save();

  const gradient = ctx.createLinearGradient(
    x + -36.5,
    titleHeight,
    x + 80,
    titleHeight
  );
  gradient.addColorStop(0, "#6495ed");
  gradient.addColorStop(0.25, "#87ceeb");
  gradient.addColorStop(0.75, "#afeeee");
  gradient.addColorStop(1, "#40e0d0");
  ctx.lineWidth = 20;
  ctx.strokeStyle = gradient;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x + -64, y + 29);
  ctx.quadraticCurveTo(x + -36.5, y + 6.7, x + -24, y + 13);
  ctx.bezierCurveTo(x + -15.7, y + 16.5, x + -15.8, y + 25.7, x + -7.5, y + 29);
  ctx.bezierCurveTo(x + 8, y + 35, x + 17, y + 6.5, x + 32.5, y + 13);
  ctx.bezierCurveTo(x + 40.5, y + 16.5, x + 40, y + 26.5, x + 48.5, y + 29);
  ctx.quadraticCurveTo(x + 61.5, y + 33.5, x + 80, y + 13);
  ctx.stroke();
  ctx.restore();
}

function drawRightFootPrint(start, end) {
  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = "#a9a9a9";
  ctx.moveTo(start + 8, end);
  ctx.bezierCurveTo(
    start + 29,
    end + -3,
    start + 28,
    end + 24,
    start + 25,
    end + 39.7
  );
  ctx.bezierCurveTo(
    start + 32,
    end + 50.5,
    start + 10,
    end + 53,
    start + 9,
    end + 44
  );
  ctx.bezierCurveTo(
    start + 8,
    end + 35,
    start + 7,
    end + 32,
    start + 3,
    end + 24
  );
  ctx.bezierCurveTo(start + 0, end + 16, start + -4, end + 2, start + 8, end);
  ctx.fill();
  ctx.restore();
}

function drawLeftFootPrint(start, end) {
  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = "#a9a9a9";
  ctx.moveTo(start + 14, end);
  ctx.bezierCurveTo(
    start + 26,
    end + -1,
    start + 25,
    end + 14,
    start + 24,
    end + 22
  );
  ctx.bezierCurveTo(
    start + 22,
    end + 30,
    start + 22,
    end + 34,
    start + 23,
    end + 43
  );
  ctx.bezierCurveTo(
    start + 24,
    end + 52,
    start + 11,
    end + 53,
    start + 7,
    end + 42
  );
  ctx.bezierCurveTo(
    start + 0,
    end + 27.5,
    start + -7,
    end + 2,
    start + 14,
    end
  );
  ctx.fill();
  ctx.restore();
}

function drawStar(cx, cy, spikes, outerRadius, innerRadius, color) {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.save();
  // ctx.translate(cx, cy);
  // ctx.rotate(15 - Math.PI * 1.5);
  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.lineWidth = 5;
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

function drawCloud(x, y, size, color, strokeColor, blur = "blur(0)") {
  ctx.save();
  ctx.moveTo(x + 125 * size, y + 128 * size);
  ctx.beginPath();
  ctx.filter = blur;
  ctx.lineTo(x + 125 * size, y + 128 * size);
  ctx.bezierCurveTo(
    x + 130 * size,
    y + 66 * size,
    x + 180 * size,
    y + 63 * size,
    x + 214 * size,
    y + 81 * size
  );
  ctx.bezierCurveTo(
    x + 234 * size,
    y + 37 * size,
    x + 283 * size,
    y + 44 * size,
    x + 300 * size,
    y + 72 * size
  );
  ctx.bezierCurveTo(
    x + 310 * size,
    y + 24 * size,
    x + 368 * size,
    y + 10 * size,
    x + 413 * size,
    y + 44 * size
  );
  ctx.bezierCurveTo(
    x + 462 * size,
    y + 8 * size,
    x + 519 * size,
    y + 16 * size,
    x + 551 * size,
    y + 45 * size
  );
  ctx.bezierCurveTo(
    x + 609 * size,
    y + -13 * size,
    x + 736 * size,
    y + 6 * size,
    x + 736 * size,
    y + 72 * size
  );
  ctx.bezierCurveTo(
    x + 833 * size,
    y + 49 * size,
    x + 890 * size,
    y + 97 * size,
    x + 881 * size,
    y + 160 * size
  );
  ctx.bezierCurveTo(
    x + 974 * size,
    y + 172 * size,
    x + 977 * size,
    y + 267 * size,
    x + 943 * size,
    y + 315 * size
  );
  ctx.bezierCurveTo(
    x + 1021 * size,
    y + 346 * size,
    x + 1004 * size,
    y + 456 * size,
    x + 943 * size,
    y + 464 * size
  );
  ctx.bezierCurveTo(
    x + 953 * size,
    y + 553 * size,
    x + 881 * size,
    y + 599 * size,
    x + 816 * size,
    y + 562 * size
  );
  ctx.bezierCurveTo(
    x + 783 * size,
    y + 671 * size,
    x + 700 * size,
    y + 666 * size,
    x + 629 * size,
    y + 625 * size
  );
  ctx.bezierCurveTo(
    x + 558 * size,
    y + 653 * size,
    x + 527 * size,
    y + 625 * size,
    x + 512 * size,
    y + 588 * size
  );
  ctx.bezierCurveTo(
    x + 483 * size,
    y + 633 * size,
    x + 446 * size,
    y + 671 * size,
    x + 361 * size,
    y + 625 * size
  );
  ctx.bezierCurveTo(
    x + 283 * size,
    y + 664 * size,
    x + 181 * size,
    y + 654 * size,
    x + 143 * size,
    y + 577 * size
  );
  ctx.bezierCurveTo(
    x + 15 * size,
    y + 561 * size,
    x + -27 * size,
    y + 499 * size,
    x + 26 * size,
    y + 365 * size
  );
  ctx.bezierCurveTo(
    x + -4.5 * size,
    y + 338 * size,
    x + -1.5 * size,
    y + 280 * size,
    x + 47 * size,
    y + 269 * size
  );
  ctx.bezierCurveTo(
    x + 30.5 * size,
    y + 224 * size,
    x + 19 * size,
    y + 138 * size,
    x + 125 * size,
    y + 128 * size
  );
  ctx.fillStyle = color;
  ctx.strokeStyle = strokeColor;
  ctx.stroke();
  ctx.fill();
  ctx.restore();
}

function update() {
  waveFrame++;
}

function animate(timestamp) {
  if (timestamp - lastTime > interval) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw();
    update();
    lastTime = timestamp;
  }
  animationId = requestAnimationFrame(animate);
}

/**
 * 2点間の距離から単位ベクトルを求める
 */
function calcNormal(px, py, qx, qy) {
  const len = calcLength(px, py, qx, qy);
  const ux = (qx - px) / len;
  const uy = (qy - py) / len;
  return { ux, uy };
}

/**
 * 2点間の距離を求める
 */
function calcLength(px, py, qx, qy) {
  return Math.sqrt((qx - px) * (qx - px) + (qy - py) * (qy - py));
}

/**
 * 単位ベクトルから角度（度数）を計算する
 */
function calcAngleFromNormal(ux, uy) {
  const radians = Math.atan2(uy, ux);
  const degrees = radians * (180 / Math.PI);
  return degrees;
}

/**
 * 対象との距離を求める
 */
function distance(px, py, qx, qy) {
  const x = qx - px;
  const y = qy - py;
  return Math.sqrt(x * x + y * y);
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = (event) => reject(event);
    image.src = src;
    return image;
  });
}

function drawRoundedRectImage(img, x, y, width, height, radius, index) {
  // offsetの計算 (-30から30の間を行き来する)
  const amplitude = 20; // 振幅
  const frequency = 0.1; // 周波数 (値が小さいほど遅くなる)
  const offset = amplitude * Math.sin(frequency * waveFrame);

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x + radius, y + offset);
  ctx.lineTo(x + width - radius, y + offset);
  ctx.quadraticCurveTo(x + width, y + offset, x + width, y + offset + radius);
  ctx.lineTo(x + width, y + offset + height - radius);
  ctx.quadraticCurveTo(
    x + width,
    y + offset + height,
    x + width - radius,
    y + offset + height
  );
  ctx.lineTo(x + radius, y + offset + height);
  ctx.quadraticCurveTo(x, y + offset + height, x, y + offset + height - radius);
  ctx.lineTo(x, y + offset + radius);
  ctx.quadraticCurveTo(x, y + offset, x + radius, y + offset);
  ctx.closePath();

  ctx.clip();

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

  // ctx.drawImage(
  //   img,
  //   sourceX,
  //   sourceY,
  //   sourceWidth,
  //   sourceHeight,
  //   x,
  //   y + offset,
  //   drawWidth,
  //   drawHeight
  // );
  // ctx.restore();

  ctx.drawImage(img, x, y + offset, width, height);
  ctx.restore();
}

function drawCopyRight() {
  ctx.save();
  ctx.font = "14px ヒラギノ明朝";
  ctx.fillStyle = "#abb1b5";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("© 2024 iwa moe", canvas.width / 2, canvas.height - 20);
  ctx.restore();
}
