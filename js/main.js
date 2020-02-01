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

window.requestAnimFrame = (function(callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
    function(callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();

class Eyes {
    constructor(eyes, context, canvas) {
        this.x = eyes.x;
        this.y = eyes.y;
        this.r1 = eyes.r1;
        this.r2 = eyes.r2;
        this.ctx = context;
        this.canvas = canvas;
    }

    drawOuter() {
        let leftEyeX = this.x;
        let rightEyeX = this.x + 150;
        drawCircle(this.ctx, leftEyeX, this.y, this.r1);
        drawCircle(this.ctx, rightEyeX, this.y, this.r1);
    }

    drawInner(x, y) {
        let innerX = x;
        let innerY = y;
        drawCircle(this.ctx, innerX, innerY, this.r2);
        drawCircle(this.ctx, innerX + 150, innerY, this.r2);
    }

    drawEyes(difX, difY) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawOuter();
        this.drawInner(difX, difY);
    }

}

function drawCircle(ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
}

// Creating new object and using method to draw eyes first time.
var eyesObject = new Eyes(eyes, ctx, canvas);
eyesObject.drawEyes(eyes.x, eyes.y);

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

    // Calculating where the pupils should be.
    var pupilPosition = {};
    pupilPosition.x = (e.pageX <= boundaries.XMin) ? boundaries.XMin :
                      (e.pageX >= boundaries.XMax) ? boundaries.XMax : e.pageX;
    pupilPosition.y = (e.pageY <= boundaries.YMin) ? boundaries.YMin :
                      (e.pageY >= boundaries.YMax) ? boundaries.YMax : e.pageY;

    // request new frame
    requestAnimFrame(function() {
        eyesObject.drawEyes(pupilPosition.x, pupilPosition.y);
    }); 

}