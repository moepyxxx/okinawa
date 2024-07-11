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
  titleHeight;

let lastScrollPosition;

setup();
animate(0);

window.addEventListener("resize", () => {
  console.log("resize");
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

function setup() {
  canvas = document.querySelector("#canvas");
  ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight * 2;
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
  drawUnderWaveLine();

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
  drawSubText("いってきたぞ〜");
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

  // const offsetS = 100;
  // const lp1S = { x: baseStart + offsetS, y: baseStart };
  // const lc1S = {
  //   x: baseMiddle + offsetS,
  //   y: baseStart - offsetS,
  // };
  // const lc2S = {
  //   x: baseStart + offsetS,
  //   y: baseMiddle - offsetS,
  // };
  // const lp2S = { x: baseMiddle + offsetS, y: baseMiddle - offsetS };
  // const lc3S = {
  //   x: baseEnd + offsetS,
  //   y: baseMiddle - offsetS,
  // };
  // const lc4S = {
  //   x: baseMiddle + offsetS,
  //   y: baseEnd - offsetS,
  // };
  // const lp3S = { x: baseEnd + offsetS, y: baseYEnd - offsetS };
  // ctx.save();
  // ctx.beginPath();
  // ctx.filter = "blur(2px)";
  // ctx.strokeStyle = "#ffefd5";
  // ctx.fillStyle = "#ffefd5";
  // ctx.moveTo(lp1S.x + offsetS, lp1S.y);
  // ctx.bezierCurveTo(lc1S.x, lc1S.y, lc2S.x, lc2S.y, lp2S.x, lp2S.y);
  // ctx.lineTo(lp2S.x + offsetS, lp2S.y);
  // ctx.bezierCurveTo(lc3S.x, lc3S.y, lc4S.x, lc4S.y, lp3S.x, lp3S.y);
  // ctx.lineTo(baseEnd, baseYEnd);
  // ctx.lineTo(offsetS, baseYEnd);
  // ctx.lineTo(offsetS, 0);
  // ctx.stroke();
  // ctx.fill();
  // ctx.restore();
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

  // const lp1F = { x: baseStart + offsetF, y: baseStart - offsetF };
  // const lc1F = {
  //   x: baseMiddle + offsetF,
  //   y: baseStart - offsetF,
  // };
  // const lc2F = {
  //   x: baseStart + offsetF,
  //   y: baseMiddle - offsetF,
  // };
  // const lp2F = { x: baseMiddle + offsetF, y: baseMiddle - offsetF };
  // const lc3F = {
  //   x: baseEnd + offsetF,
  //   y: baseMiddle - offsetF,
  // };
  // const lc4F = {
  //   x: baseMiddle + offsetF,
  //   y: baseYEnd - offsetF,
  // };
  // const lp3F = { x: baseEnd - offsetF, y: baseYEnd - offsetF };
  // ctx.save();
  // ctx.beginPath();
  // ctx.filter = "blur(3px)";
  // ctx.strokeStyle = "rgba(0, 141, 183, 0.2)";
  // ctx.fillStyle = "rgba(0, 141, 183, 0.2)";
  // ctx.moveTo(lp1F.x + offsetF, lp1F.y);
  // ctx.bezierCurveTo(lc1F.x, lc1F.y, lc2F.x, lc2F.y, lp2F.x, lp2F.y);
  // ctx.bezierCurveTo(lc3F.x, lc3F.y, lc4F.x, lc4F.y, lp3F.x, lp3F.y);
  // ctx.lineTo(canvas.width, canvas.height);
  // ctx.lineTo(0, canvas.height);
  // ctx.lineTo(offsetF, 0);
  // ctx.stroke();
  // ctx.fill();
  // ctx.restore();
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

  while (count < maxCount) {
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
  drawStar(startX - 50, titleHeight / 2 - 150, 5, 30, 15, "#e0ffff");
  drawStar(startX + sumWidth + 50, titleHeight / 2 + 50, 5, 30, 15, "#00bfff");

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

  ctx.lineWidth = 10;
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

function drawSubText(text) {
  ctx.save();
  ctx.font = "30px ヒラギノ明朝";
  ctx.fillStyle = "#000";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, canvas.width / 2, titleHeight / 2 + 50);
  ctx.restore();
}

function setFootPrintCoordinates() {
  let startX = canvas.width;
  let startY = (titleHeight / 9) * 8;
  footPrintCoordinates = [];

  while (startY > 0 || startX > 0) {
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
