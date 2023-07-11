$(document).ready(function() {
    const canvas = document.getElementById('training-board');
    let canvasSelector = $('#training-board');
    const context = canvas.getContext('2d');
    canvas.width = canvas.getBoundingClientRect().width;
    canvas.height = canvas.getBoundingClientRect().height;


    function Point(number, radius, x, y) {
        this.number = number;
        this.radius = radius;
        this.x = x;
        this.y = y;
        this.path = undefined;
        this.active = false;
        this.timer = undefined;
        this.hasData1 = false;
        this.hasData2 = false;
        this.hasData3 = false;
    }
    Point.prototype.draw = function (){
        if (this.active){
            this.onActive();
        }
        this.path = new Path2D();
        this.path.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        this.path.closePath();
        if (!this.active) {
            context.fillStyle = "#b91a1a";
        } else {
            context.fillStyle = "#439a1c";
        }
        context.fill(this.path);
        context.stroke(this.path);
    };
    Point.prototype.onActive = function (){
        const nowTime = new Date();
        if (this.timer === undefined){
            this.timer = new Date();
        } else if ((nowTime.getTime() - this.timer.getTime()) < 3000){
            this.radius = (3000 - (nowTime.getTime() - this.timer.getTime()))*20/3000;
            if (500 < (nowTime.getTime() - this.timer.getTime()) < 1000 && !this.hasData1){
                let pointDataEvent = new CustomEvent('saveData', {
                    detail :{
                        'x': this.x,
                        'y': this.y
                    }
                });
                this.hasData1 = true;
                canvas.dispatchEvent(pointDataEvent);
            }
            if (1000 < (nowTime.getTime() - this.timer.getTime()) < 2000 && !this.hasData2){
                let pointDataEvent = new CustomEvent('saveData', {
                    detail :{
                        'x': this.x,
                        'y': this.y
                    }
                });
                this.hasData2 = true;
                canvas.dispatchEvent(pointDataEvent);
            }
            if (2000 < (nowTime.getTime() - this.timer.getTime()) < 3000 && !this.hasData3){
                let pointDataEvent = new CustomEvent('saveData', {
                    detail :{
                        'x': this.x,
                        'y': this.y
                    }
                });
                this.hasData3 = true;
                canvas.dispatchEvent(pointDataEvent);
            }
        } else {
            this.radius = 20;
            this.timer = undefined;
            this.active = false;
            activeNumber++;
        }
    };
    function Cursor (){
        this.x = 0;
        this.y = 0;
        this.radius = 10;
    }
    Cursor.prototype.draw = function (){
        context.beginPath();
        context.fillStyle = '#245488';
        context.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
        context.fill();
        context.closePath();
    }
    Cursor.prototype.move = function (x, y){
        this.x = x;
        this.y = y;
    }
    let cursor = new Cursor();

    canvasSelector.on('cursorPredEvent', function (e) {
        const coord = e.detail;
        cursor.move(coord.x, coord.y);
    });

    let activeNumber = 1;
    let points1 = [
        new Point(1, 20, canvas.width * 0.05, canvas.height * 0.05),
        new Point(2, 20, canvas.width * 0.25, canvas.height * 0.05),
        new Point(3, 20, canvas.width * 0.5, canvas.height * 0.05),
        new Point(4, 20, canvas.width * 0.75, canvas.height * 0.05),
        new Point(5, 20, canvas.width * 0.95, canvas.height * 0.05),
        new Point(6, 20, canvas.width * 0.95, canvas.height * 0.25),
        new Point(7, 20, canvas.width * 0.75, canvas.height * 0.25),
        new Point(8, 20, canvas.width * 0.5, canvas.height * 0.25),
        new Point(9, 20, canvas.width * 0.25, canvas.height * 0.25),
        new Point(10, 20, canvas.width * 0.05, canvas.height * 0.25),
        new Point(11, 20, canvas.width * 0.05, canvas.height * 0.5),
        new Point(12, 20, canvas.width * 0.25, canvas.height * 0.5),
        new Point(13, 20, canvas.width * 0.5, canvas.height * 0.5),
        new Point(14, 20, canvas.width * 0.75, canvas.height * 0.5),
        new Point(15, 20, canvas.width * 0.95, canvas.height * 0.5),
        new Point(16, 20, canvas.width * 0.95, canvas.height * 0.75),
        new Point(17, 20, canvas.width * 0.75, canvas.height * 0.75),
        new Point(18, 20, canvas.width * 0.5, canvas.height * 0.75),
        new Point(19, 20, canvas.width * 0.25, canvas.height * 0.75),
        new Point(20, 20, canvas.width * 0.05, canvas.height * 0.75),
        new Point(21, 20, canvas.width * 0.05, canvas.height * 0.95),
         new Point(22, 20, canvas.width * 0.25, canvas.height * 0.95),
         new Point(23, 20, canvas.width * 0.5, canvas.height * 0.95),
         new Point(24, 20, canvas.width * 0.75, canvas.height * 0.95),
         new Point(25, 20, canvas.width * 0.95, canvas.height * 0.95),
    ]
    function drawPoints(){
        if (activeNumber < 26) {
            points1.forEach(function (item, i, arr) {
                if (item.number === activeNumber && !item.active) {
                    item.active = true;
                }
                item.draw();
            });
        } else if (activeNumber === 26){
            let trainEvent = new CustomEvent('train');
            canvas.dispatchEvent(trainEvent);
            activeNumber++;
        } else if (activeNumber === 27){
            cursor.draw();
        }
    }
    function boardLoop(){
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawPoints();
        requestAnimationFrame(boardLoop);
    }
    boardLoop();
});