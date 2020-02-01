window.requestAnimFrame = (function(callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
    function(callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();

function drawCircle(ctx, x, y, r, arcLength, pi) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
}

var drawOuter = drawCircle(ctx, x, y, r, arcLength, pi);
var drawInner = drawCircle(ctx, x, y, r, arcLength, pi);

function drawEyes(eyes, ctx) {  
    drawOuter(ctx, eyes.x, eyes.y, eyes.r1);
    drawInner(ctx, eyes.x, eyes.y, eyes.r2);
}

function animate(eyes, canvas, ctx, mousePositionX, mousePositionY) {
    // clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawEyes(eyes, ctx);

    // request new frame
    requestAnimFrame(function() {
        animate(eyes, canvas, ctx, mousePositionX, mousePositionY);
    });
}
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var eyes = {
    x: 100,
    y: 100,
    r1: 40,
    r2: 5
}

var boundaries = {
    XMin: eyes.x - (eyes.r1 / 2),
    XMax: eyes.x + (eyes.r1 / 2),
    YMin: eyes.y - (eyes.r1 / 2),
    YMax: eyes.y + (eyes.r1 / 2)
}

var rightEye = {};
var leftEye = {};
rightEye.x = eyes.x + 150;
rightEye.y = eyes.y;
rightEye.r1 = eyes.r1;
rightEye.r2 = eyes.r2;
leftEye.x = eyes.x;
leftEye.y = eyes.y;
leftEye.r1 = eyes.r1;
leftEye.r2 = eyes.r2

var rightEyeFunc = drawEyes(rightEye, ctx);
var leftEyeFunc = drawEyes(leftEye, ctx);

// wait one second before starting animation

// animate(eyes, canvas, ctx, mousePositionX, mousePositionY);

// Mouse position detector
document.onmousemove = handleMouseMove;

function handleMouseMove(e) {
    var eventDoc, doc, body;

    e = e || window.e; // IE-ism

    // If pageX/Y aren't available and clientX/Y are,
    // calculate pageX/Y - logic taken from jQuery.
    // (This is to support old IE)
    if (e.pageX == null && e.clientX != null) {
        eDoc = (e.target && e.target.ownerDocument) || document;
        doc = eDoc.documentElement;
        body = eDoc.body;

        e.pageX = e.clientX +
            (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
            (doc && doc.clientLeft || body && body.clientLeft || 0);
        e.pageY = e.clientY +
            (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
            (doc && doc.clientTop  || body && body.clientTop  || 0 );
    }

    // Use event.pageX / event.pageY here
    document.getElementById("labelX").innerHTML = e.pageX;
    document.getElementById("labelY").innerHTML = e.pageY;

    var pupilPosition = {};
    pupilPosition.x = (e.pageX <= boundaries.XMin) ? boundaries.XMin :
                      (e.pageX >= boundaries.XMax) ? boundaries.XMax : e.pageX;
    pupilPosition.y = (e.pageY <= boundaries.YMin) ? boundaries.YMin :
                      (e.pageY >= boundaries.YMax) ? boundaries.YMax : e.pageY;

    console.log("pupilPosition.x -> " + pupilPosition.x);
    console.log("pupilPosition.y -> " + pupilPosition.y);
    
}