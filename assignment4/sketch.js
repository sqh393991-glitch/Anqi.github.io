/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates hand tracking on live video through ml5.handPose.
 */

let handPose;
let video;
let hands = [];
let blackCat; 

function preload() {
    // Load the handPose model
    handPose = ml5.handPose();
    blackCat = loadImage('images/blackcat.png');
}

function setup() {
    createCanvas(640, 480);
    // Create the webcam video and hide it
    video = createCapture(VIDEO);
    video.size(640, 480);
    video.hide();
    // start detecting hands from the webcam video
    handPose.detectStart(video, gotHands);
    console.log("hello")
}

function draw() {
    // Draw the webcam video
    image(video, 0, 0, width, height);

    // Draw all the tracked hand points and the puppet
    for (let i = 0; i < hands.length; i++) {
        let hand = hands[i];
        // Draw keypoints
        for (let j = 0; j < hand.keypoints.length; j++) {
            let keypoint = hand.keypoints[j];
            fill(0, 255, 0);
            noStroke();
            circle(keypoint.x, keypoint.y, 10);
        }

    
let indexTip = hand.keypoints.find(k => k.name === "index_finger_tip");
let indexPIP = hand.keypoints.find(k => k.name === "index_finger_pip");

if (indexTip && indexPIP) {
    
    let angle = atan2(
        indexTip.y - indexPIP.y,
        indexTip.x - indexPIP.x
    );

    push();
    translate(indexTip.x, indexTip.y); 
    rotate(angle+HALF_PI);
    imageMode(CENTER);
    image(blackCat, 0, 0, 60, 90);
    pop();
}

    }
}

// Callback function for when handPose outputs data
function gotHands(results) {
    // save the output to the hands variable
    hands = results;
}
