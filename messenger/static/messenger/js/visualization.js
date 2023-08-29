$(document).ready(function() {
    const canvas = document.getElementById('arrowBoard');
    let canvasSelector = $('#arrowBoard');
    const context = canvas.getContext('2d');
    canvas.width = canvas.getBoundingClientRect().width;
    canvas.height = canvas.getBoundingClientRect().height;
    function ArrowAnimation (){
        this.coordData = undefined;
    }
    ArrowAnimation.prototype.drawArrow = function (selected,
                                                   x1=canvas.width*0.55, y1=canvas.height*0.45,
                                                   x2=canvas.width*0.85, y2=canvas.height*0.45,
                                                   x3=canvas.width*0.85, y3=canvas.height*0.40,
                                                   x4=canvas.width*0.95, y4=canvas.height*0.50,
                                                   x5=canvas.width*0.85, y5=canvas.height*0.60,
                                                   x6=canvas.width*0.85, y6=canvas.height*0.55,
                                                   x7=canvas.width*0.55, y7=canvas.height*0.55) {
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.lineTo(x3, y3);
        context.lineTo(x4, y4);
        context.lineTo(x5, y5);
        context.lineTo(x6, y6);
        context.lineTo(x7, y7);
        context.lineTo(x1, y1);
        if (selected) {
            context.fillStyle = "rgb(51,255,238)";
        } else {
            context.fillStyle = "rgb(147,144,144)";
        }
        context.fill();
        context.closePath();
    }
    ArrowAnimation.prototype.animate = function (nowTime){
        if (this.coordData.rightNow <= this.coordData.rightIdeal) {
            this.drawArrow(true);
        } else {
            this.drawArrow(false);
        }
        context.translate(canvas.width*0.5, canvas.height*0.5);
        context.rotate(Math.PI/2);
        context.translate(-canvas.width*0.5, -canvas.height*0.5);
        if (this.coordData.bottomNow <= this.coordData.bottomIdeal) {
            this.drawArrow(true);
        } else {
            this.drawArrow(false);
        }
        context.translate(canvas.width*0.5, canvas.height*0.5);
        context.rotate(Math.PI/2);
        context.translate(-canvas.width*0.5, -canvas.height*0.5);
        if (this.coordData.leftNow <= this.coordData.leftIdeal) {
            this.drawArrow(true);
        } else {
            this.drawArrow(false);
        }
        context.translate(canvas.width*0.5, canvas.height*0.5);
        context.rotate(Math.PI/2);
        context.translate(-canvas.width*0.5, -canvas.height*0.5);
        if (this.coordData.topNow <= this.coordData.topIdeal) {
            this.drawArrow(true);
        } else {
            this.drawArrow(false);
        }
        context.setTransform(1, 0, 0, 1, 0, 0);
    }

    let animation = new ArrowAnimation();
    canvasSelector.on('data', function (e) {
        animation.coordData = e.detail;

    });
    function screenLoop(nowTime){
        context.clearRect(0, 0, canvas.width, canvas.height);
        animation.animate(nowTime);
        requestAnimationFrame(screenLoop);
    }

    canvasSelector.on('trackingReady', function () {
        requestAnimationFrame(screenLoop);
    });
});