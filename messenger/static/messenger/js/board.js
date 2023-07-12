$(document).ready(function() {
    const canvas = document.getElementById('board');
    let canvasSelector = $('#board');
    const context = canvas.getContext('2d');
    canvas.width = canvas.getBoundingClientRect().width;
    canvas.height = canvas.getBoundingClientRect().height;
    function Button(x, y, width, leftNeighbour, rightNeighbour, topNeighbor, bottomNeighbor){
        this.x = x;
        this.y = y;
        this.width = width;
        this.path = undefined;
        this.selected = false;
        this.leftNeighbour = leftNeighbour;
        this.rightNeighbour = rightNeighbour;
        this.topNeighbor = topNeighbor;
        this.bottomNeighbor = bottomNeighbor;
    }
    Button.prototype.draw = function (){
        this.path = new Path2D();
        this.path.rect(this.x,this.y,this.width,this.width);
        this.path.closePath();

        if (this.selected){
            context.fillStyle = "rgb(40,40,40)";
        } else {
            context.fillStyle = "rgba(124,124,124,0.5)";
        }
        context.fill(this.path);
        // context.lineWidth = 3;
        // context.strokeStyle = "#ffc71e";
        // context.font = "bold 44px verdana, sans-serif";
        // context.textAlign = "center"
        // context.textBaseline = "center";
        // context.fillStyle = "#ffffff"
        // const nowTime = new Date();
        // if (this.name !== "button2"){
        //     context.fillText(this.name, 25 + this.plusX + this.width / 2, 25 + this.width / 2)
        // } else if (!this.selected){
        //     context.fillText('print', 25 + this.plusX + this.width / 2, 25 + this.width / 2)
        // } else {
        //     context.fillText((nowTime.getSeconds() - this.timer.getSeconds()).toFixed(0), 25 + this.plusX + this.width / 2, 25 + this.width / 2)
        // }
        context.stroke(this.path);
    }
    function Keyboard(){
        this.buttons = [
            new Button(
                canvas.width*0.25-50, canvas.height*0.25, 100,
                undefined, 1, undefined, 5),
            new Button(
                canvas.width*0.50-50, canvas.height*0.25, 100,
                0, 2, undefined, 4),
            new Button(
                canvas.width*0.75-50, canvas.height*0.25, 100,
                1, undefined, undefined, 3),
            new Button(
                canvas.width*0.75-50, canvas.height*0.5, 100,
                4, undefined, 2, 8),
            new Button(
                canvas.width*0.50-50, canvas.height*0.5, 100,
                5, 3, 1, 7),
            new Button(
                canvas.width*0.25-50, canvas.height*0.5, 100,
                undefined, 4, 0, 6),
            new Button(
                canvas.width*0.25-50, canvas.height*0.75, 100,
                undefined, 7, 5, undefined),
            new Button(
                canvas.width*0.50-50, canvas.height*0.75, 100,
                6, 8, 4, undefined),
            new Button(
                canvas.width*0.75-50, canvas.height*0.75, 100,
                7, undefined, 3, undefined),
        ];
        this.buttons[0].selected = true;
        this.selectedNow = 0;
    }
    Keyboard.prototype.draw = function (){
        this.buttons.forEach(function (item, i, arr) {
            item.draw();
        });
    }
    Keyboard.prototype.changeSelection = function (kind){
        if(kind === 'left'){
            let selectedNow = this.buttons[this.selectedNow].leftNeighbour;
            if (selectedNow !== undefined) {
                this.buttons[this.selectedNow].selected = false;
                this.buttons[selectedNow].selected = true;
                this.selectedNow = selectedNow;
            }

        } else if(kind === 'right'){
            let selectedNow = this.buttons[this.selectedNow].rightNeighbour;
            if (selectedNow !== undefined) {
                this.buttons[this.selectedNow].selected = false;
                this.buttons[selectedNow].selected = true;
                this.selectedNow = selectedNow;
            }
        } else if(kind === 'top'){
            let selectedNow = this.buttons[this.selectedNow].topNeighbor;
            if (selectedNow !== undefined) {
                this.buttons[this.selectedNow].selected = false;
                this.buttons[selectedNow].selected = true;
                this.selectedNow = selectedNow;
            }
        } else if(kind === 'bottom'){
            let selectedNow = this.buttons[this.selectedNow].bottomNeighbor;
            if (selectedNow !== undefined) {
                this.buttons[this.selectedNow].selected = false;
                this.buttons[selectedNow].selected = true;
                this.selectedNow = selectedNow;
            }
        }
    }
    canvasSelector.on('eyeGesture', function (e) {
        console.log(e.detail.kind)
        keyboard.changeSelection(e.detail.kind);

    });
    let keyboard = new Keyboard();
    function boardLoop(){
        context.clearRect(0, 0, canvas.width, canvas.height);
        keyboard.draw();
        requestAnimationFrame(boardLoop);
    }
    boardLoop();
});