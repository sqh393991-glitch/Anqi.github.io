/**
 * 
 */
function showSkeleton() {
    // the skeleton includes a list of 17 keypoints,
    // or named locations on the body – let's see them!
    fill(155);
    noStroke();
    for (let pt of skeleton.pose.keypoints) {
        pt = scalePoint(pt.position);
        circle(pt.x, pt.y, 20);
    }

    // we can also get specific points!
    let leftShoulder = skeleton.pose.leftShoulder;
    let rightShoulder = skeleton.pose.rightShoulder;

    // only display if the confidence level is high enough
    if (rightShoulder.confidence > 0.3 && leftShoulder.confidence > 0.3) {

        // grab the position from the wrists and convert into
        // a vector (which will let us do fancier math below)
        let ls = createVector(leftShoulder.x, leftShoulder.y);
        ls = scalePoint(ls);

        let rs = createVector(rightShoulder.x, rightShoulder.y);
        rs = scalePoint(rs);

        stroke(185);
        strokeWeight(6);
        line(ls.x, ls.y, rs.x, rs.y);
    }

}

/**
 * Scales the position of a point from the video to the canvas
 * @param {*} pt a skeleton point 
 * @returns 
 */
function scalePoint(pt) {
    let xs = map(pt.x,  video.width, 0, width, 0);
    let ys = map(pt.y, video.height, 0, height, 0);
    return createVector(xs, ys);
}

/**
 * Show the coordinates of the skeleton's points
 */
showPointsCoords = function () {
    let leftShoulder = scalePoint(skeleton.pose.leftShoulder);
    let rightShoulder = scalePoint(skeleton.pose.rightShoulder);
    let leftElbow = scalePoint(skeleton.pose.leftElbow);
    let rightElbow = scalePoint(skeleton.pose.rightElbow);
    let leftWrist = scalePoint(skeleton.pose.leftWrist);
    let rightWrist = scalePoint(skeleton.pose.rightWrist);
    let leftHip = scalePoint(skeleton.pose.leftHip);
    let rightHip = scalePoint(skeleton.pose.rightHip);
    let leftKnee = scalePoint(skeleton.pose.leftKnee);
    let rightKnee = scalePoint(skeleton.pose.rightKnee);
    let leftAnkle = scalePoint(skeleton.pose.leftAnkle);
    let rightAnkle = scalePoint(skeleton.pose.rightAnkle);
    let leftEye = scalePoint(skeleton.pose.leftEye);
    let rightEye = scalePoint(skeleton.pose.rightEye);
    let nose = scalePoint(skeleton.pose.nose);
    let leftEar = scalePoint(skeleton.pose.leftEar);
    let rightEar = scalePoint(skeleton.pose.rightEar);

    fill(150);
    noStroke();
    text("x: " + nf(leftShoulder.x, 2, 0) + " y: " + nf(leftShoulder.y, 2, 0), leftShoulder.x, leftShoulder.y);
    text("x: " + nf(rightShoulder.x, 2, 0) + " y: " + nf(rightShoulder.y, 2, 0), rightShoulder.x, rightShoulder.y);
    text("x: " + nf(leftElbow.x, 2, 0) + " y: " + nf(leftElbow.y, 2, 0), leftElbow.x, leftElbow.y);
    text("x: " + nf(rightElbow.x, 2, 0) + " y: " + nf(rightElbow.y, 2, 0), rightElbow.x, rightElbow.y);
    text("x: " + nf(leftWrist.x, 2, 0) + " y: " + nf(leftWrist.y, 2, 0), leftWrist.x, leftWrist.y);
    text("x: " + nf(rightWrist.x, 2, 0) + " y: " + nf(rightWrist.y, 2, 0), rightWrist.x, rightWrist.y);
    text("x: " + nf(leftHip.x, 2, 0) + " y: " + nf(leftHip.y, 2, 0), leftHip.x, leftHip.y);
    text("x: " + nf(rightHip.x, 2, 0) + " y: " + nf(rightHip.y, 2, 0), rightHip.x, rightHip.y);
    text("x: " + nf(leftKnee.x, 2, 0) + " y: " + nf(leftKnee.y, 2, 0), leftKnee.x, leftKnee.y);
    text("x: " + nf(rightKnee.x, 2, 0) + " y: " + nf(rightKnee.y, 2, 0), rightKnee.x, rightKnee.y);
    text("x: " + nf(leftAnkle.x, 2, 0) + " y: " + nf(leftAnkle.y, 2, 0), leftAnkle.x, leftAnkle.y);
    text("x: " + nf(rightAnkle.x, 2, 0) + " y: " + nf(rightAnkle.y, 2, 0), rightAnkle.x, rightAnkle.y);
    text("x: " + nf(leftEye.x, 2, 0) + " y: " + nf(leftEye.y, 2, 0), leftEye.x, leftEye.y);
    text("x: " + nf(rightEye.x, 2, 0) + " y: " + nf(rightEye.y, 2, 0), rightEye.x, rightEye.y);
    text("x: " + nf(nose.x, 2, 0) + " y: " + nf(nose.y, 2, 0), nose.x, nose.y);
    text("x: " + nf(leftEar.x, 2, 0) + " y: " + nf(leftEar.y, 2, 0), leftEar.x, leftEar.y);
    text("x: " + nf(rightEar.x, 2, 0) + " y: " + nf(rightEar.y, 2, 0), rightEar.x, rightEar.y);

}