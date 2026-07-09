// POSE DETECTION
let video;
let model;
let skeleton;

let showVideo = true;
let showPose = true;
let showCoords = false;

let cat, hat, wand;

function preload() {
  cat = loadImage('images/cat.png');
  hat = loadImage('images/hat.png');
  wand = loadImage('images/wand.png');
}

function setup() {
  let cnvs = createCanvas(800, 600);
  cnvs.parent('divP5');

  rectMode(CENTER);
  textAlign(CENTER, CENTER);

  video = createCapture(VIDEO);
  video.size(800, 600);
  video.hide();

  model = ml5.poseNet(video, () => {
    console.log('PoseNet ready');
  });

  model.on('pose', results => {
    if (results.length > 0) {
      skeleton = results[0];
    }
  });
}

function draw() {
  background(0);

  
  if (showVideo) {
    image(video, 0, 0, width, height);
  }

  if (!skeleton) return;

  if (showPose) showSkeleton();
  if (showCoords) showPointsCoords();

  // 🐱 cat：左肩
  image(
    cat,
   skeleton.pose.rightWrist.x - 110,
    skeleton.pose.rightWrist.y - 400,
    200,
    300
  );

  // 🎩 hat：nose（没有 head）
  image(
    hat,
    skeleton.pose.nose.x - 150,
    skeleton.pose.nose.y - 400,
    400,
    350
  );

  // 🪄 wand：右手腕
  image(
    wand,
    skeleton.pose.leftShoulder.x - 100,
    skeleton.pose.leftShoulder.y - 300,
    300,
    100
  );
}
