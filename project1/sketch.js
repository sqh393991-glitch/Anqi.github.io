/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates hand tracking on live video through ml5.handPose.
 */

/*
  ml5 HandPose
  
*/
let handPose;
let video;
let hands = [];

let girl;
let forest;
let monster;
let tool;
let bombImg;
let bgMusic;

let bombs = [];

let bgDarkness = 0;

// 怪物血量
let monsterHealth = 100;
let maxHealth = 100;

// 按空格丢炸弹控制
let bombInterval = 500;
let lastBombTime = 0;

function preload() {
  handPose = ml5.handPose();

  girl = loadImage("images/girl.png");
  forest = loadImage("images/forest.png");
  monster = loadImage("images/monster.png");
  tool = loadImage("images/tool.png");
  bombImg = loadImage("images/bomb.png"); 
  bgMusic = loadSound("images/music.mp3");
}

function setup() {
  createCanvas(800, 600);
  userStartAudio(); 

  if (bgMusic.isLoaded()) {
    bgMusic.setVolume(0.5);
    bgMusic.loop();
  }

  video = createCapture(VIDEO);
  video.size(800, 600);
  video.hide();

  handPose.detectStart(video, gotHands);
}

function draw() {
  background(0);

  push();
  translate(width, 0);
  scale(-1, 1);

  let isAttacking = false;

  if (hands.length >= 2) {
    let hand2 = hands[1];
    let tip2 = hand2.keypoints.find(k => k.name === "index_finger_tip");
    let wrist2 = hand2.keypoints.find(k => k.name === "wrist");

    if (tip2 && wrist2) {
      let d = dist(tip2.x, tip2.y, wrist2.x, wrist2.y);
      if (d > 130) isAttacking = true;
    }
  }

  let shakeX = isAttacking ? random(-5, 5) : 0;
  let shakeY = isAttacking ? random(-5, 5) : 0;

  image(forest, shakeX, shakeY, width, height);

  bgDarkness = lerp(bgDarkness, isAttacking ? 120 : 0, 0.1);
  fill(120, 0, 0, bgDarkness);
  noStroke();
  rect(0, 0, width, height);

  // 👧 女孩 + 丢炸弹
  if (hands.length >= 1) {
    let hand1 = hands[0];
    let tip1 = hand1.keypoints.find(k => k.name === "index_finger_tip");
    let pip1 = hand1.keypoints.find(k => k.name === "index_finger_pip");

    if (tip1 && pip1) {
      let angle1 = atan2(tip1.y - pip1.y, tip1.x - pip1.x);

      push();
      translate(tip1.x, tip1.y);
      rotate(angle1 + HALF_PI);
      imageMode(CENTER);
      image(girl, 0, 0, 200, 160);
      pop();

      let currentTime = millis();
      if (keyIsDown(32)) {
        if (currentTime - lastBombTime > bombInterval) {
          bombs.push({
            x: tip1.x,
            y: tip1.y,
            vx: -5,
            vy: -10,
            gravity: 0.8,
            life: 60,
            exploding: false
          });
          lastBombTime = currentTime;
        }
      }
    }
  }

  // 💣 炸弹逻辑
  for (let i = bombs.length - 1; i >= 0; i--) {
    let b = bombs[i];

    if (!b.exploding) {

      b.x += b.vx;
      b.y += b.vy;
      b.vy += b.gravity;

      // 💥 命中怪物
      if (hands.length >= 2) {
        let hand2 = hands[1];
        let tip2 = hand2.keypoints.find(k => k.name === "index_finger_tip");

        if (tip2) {
          let d = dist(b.x, b.y, tip2.x, tip2.y);

          if (d < 120) {
            b.exploding = true;
            b.life = 12;

            // 👇 扣血！！
            monsterHealth -= 10;
            monsterHealth = max(monsterHealth, 0);

            continue;
          }
        }
      }

      // 落地爆炸
      if (b.y > height - 40) {
        b.y = height - 40;
        b.exploding = true;
        b.life = 12;
      }

      imageMode(CENTER);
      image(bombImg, b.x, b.y, 60, 60);

    } else {

      noStroke();
      fill(255, 120, 0, 120);
      circle(b.x, b.y, 140 + random(-20, 20));

      fill(255, 180, 0, 180);
      circle(b.x, b.y, 90 + random(-10, 10));

      fill(255, 240, 150, 220);
      circle(b.x, b.y, 40);

      b.life--;
    }

    if (b.life <= 0) {
      bombs.splice(i, 1);
    }
  }

  // 👾 怪物
  if (hands.length >= 2) {
    let hand2 = hands[1];
    let tip2 = hand2.keypoints.find(k => k.name === "index_finger_tip");
    let pip2 = hand2.keypoints.find(k => k.name === "index_finger_pip");

    if (tip2) {
      imageMode(CENTER);
      image(monster, tip2.x, tip2.y, 400, 250);

      // 血条
      let barWidth = 120;
      let healthRatio = monsterHealth / maxHealth;

      // 背景
      fill(80);
      rect(tip2.x - barWidth/2, tip2.y - 180, barWidth, 10);

      // 当前血量
      fill(255, 0, 0);
      rect(tip2.x - barWidth/2, tip2.y - 180, barWidth * healthRatio, 10);
    }

    if (tip2 && pip2 && isAttacking) {
      let angle2 = atan2(tip2.y - pip2.y, tip2.x - pip2.x);

      push();
      translate(tip2.x, tip2.y);
      rotate(angle2);
      image(tool, 70, 0, 400, 200);
      pop();
    }
  }

  pop();

  // 🎉 胜利提示
  if (monsterHealth <= 0) {
    fill(255);
    textSize(50);
    textAlign(CENTER, CENTER);
    text(" WIN!", width/2, height/2);
  }
}

function gotHands(results) {
  hands = results;
}