// These are the variables of my project
let mask;
let iris;
let irisPos;
let ml5Model;
let vidInput;

// This function is called once when the program starts and loads the images
function preload() {
    // load the ml5 model
    ml5Model = ml5.imageClassifier("https://teachablemachine.withgoogle.com/models/MBUorTfmuu/" + "model.json",
        { flipped: true, });
    // load the images
    mask = loadImage('assets/master.png');
    iris = loadImage('assets/iris.png');
}

function setup() {
    createCanvas(800, 800);
    // get video input
    vidInput = createCapture(VIDEO);
    vidInput.hide();
    //
    irisPos = 0;
}

function draw() {
    background(255);

    // classify the video input
    ml5Model.classify(vidInput, gotResult);

   image(iris, 100 + irisPos, 120);
    image(mask, 0, 0);
    image(vidInput, 0, 0, 100, 80);

}

function gotResult(output) {
    console.log(output[0].label);
    
    // change the value of irisPos based on first label from  the output
    if (output[0].label == 'face') {
        irisPos = 0;
    } else if (output[0].label == 'ye') {
        irisPos = -15;
    } else if (output[0].label == 'stone') {
        irisPos = 25;
    }

}