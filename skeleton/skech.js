let classifier;
let vid;
function preload(){
    classifier = ml5.bodyPose();
}
function setup(){
    createCanvas(800,600);
    vid = createCapture(VIDEO);

    classifier.detectStart(vid, gotPoses);

}
function gotPoses(results){
    console.log(results);
    results[0]
    console.log(results[0].nose);
   circle(results[0].nose.x, results[0].nose.y, 20);
   stroke(255,0,0);
   circle(results[1].nose.x, results[1].nose.y, 20);
}