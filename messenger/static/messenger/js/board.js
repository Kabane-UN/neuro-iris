$(document).ready(function() {
    const canvas = document.getElementById('board');
    let canvasSelector = $('#board');
    const context = canvas.getContext('2d');
    canvas.width = canvas.getBoundingClientRect().width;
    canvas.height = canvas.getBoundingClientRect().height;
    function Cursor (){
        this.x = canvas.width/2;
        this.y = canvas.height/2;
        this.radius = 15;
    }
    Cursor.prototype.draw = function (){
        context.beginPath();
        context.fillStyle = '#245488';
        context.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
        context.fill();
        context.closePath();
    }
    Cursor.prototype.move = function (x, y){
        if (this.x + x -this.radius>=0 && this.x + x +this.radius<=canvas.width){
            this.x+=x;
        }
        if (this.y + y - this.radius>=0 && this.y+y+this.radius<=canvas.height){
            this.y+=y;
        }
    }
    let cursor = new Cursor();

    canvasSelector.on('coordinates', function (e) {
        const coord = e.detail;
        cursor.move(coord.x*canvas.width, coord.y*canvas.height);
    });

    function boardLoop(){
        context.clearRect(0, 0, canvas.width, canvas.height);
        cursor.draw();
        requestAnimationFrame(boardLoop);
    }
    boardLoop();
});