let classfier;
let img;

function preload(){
    classfier = ml5.imageClassifier(MobileNet);
    img = loadImage('path/to/your/image.jpg');
}
function setup(){
    createCanvas(400,400);

    background(220);
    image(img,0,0,width,height);
    }
function gotResult(results){
    console.log(results);}
  fill(255);
    textSize(18);
    label = results[0].label;
    confidence = "Confidence: " + nf(results[0].confidence, 0, 2);
    text(label,10,360);
    text(confidence,10,380);
    