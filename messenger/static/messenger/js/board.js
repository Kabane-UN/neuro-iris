$(document).ready(function() {
    const canvas = document.getElementById('board');
    let canvasSelector = $('#board');
    const context = canvas.getContext('2d');
    canvas.width = canvas.getBoundingClientRect().width;
    canvas.height = canvas.getBoundingClientRect().height;
    function Button(x, y, width, name, leftNeighbour, rightNeighbour, topNeighbor, bottomNeighbor){
        this.x = x - width / 2;
        this.y = y - width / 2;
        this.width = width;
        this.path = undefined;
        this.selected = false;
        this.name = name;
        this.leftNeighbour = leftNeighbour;
        this.rightNeighbour = rightNeighbour;
        this.topNeighbor = topNeighbor;
        this.bottomNeighbor = bottomNeighbor;
        this.timer = undefined;
    }
    Button.prototype.draw = function (){
        this.path = new Path2D();
        this.path.rect(this.x,this.y,this.name === 'Space' ? this.width*6 : this.width,this.width);
        this.path.closePath();

        if (this.selected){
            context.fillStyle = "rgb(115,115,115)";
        } else {
            context.fillStyle = "rgb(147,144,144)";
        }
        context.fill(this.path);
        context.lineWidth = 3;
        context.strokeStyle = "#939090";
        context.font = "bold 44px verdana, sans-serif";
        context.textAlign = "center"
        context.textBaseline = "center";
        context.fillStyle = "#000000"
        context.fillText(this.name, this.x+this.width/2*(this.name === 'Space' ? 6 : 1), this.y+this.width/2)
        context.stroke(this.path);
    }
    let capital = false;
    Button.prototype.forSelected = function (){
        let nowTime = new Date();
        if (this.timer === undefined){
            this.timer = nowTime;
        } else if (nowTime.getTime()-this.timer.getTime()>3000){
            let toPrint = this.name;
            switch (toPrint) {
                case 'Space':
                    toPrint = ' ';
                    break;
                case 'Enter':
                    toPrint = '\n';
                    break;
                case 'Shift':
                    toPrint = '';
                    break;
                default:
                    if (capital){
                        toPrint = toPrint.charAt(0).toUpperCase();
                    }
            }
            let printEvent = new CustomEvent('print', {
                detail: {
                    'text': toPrint,
                }
            });
            document.getElementById("notepad").dispatchEvent(printEvent);
            this.timer = undefined;
        }
    }
    function Keyboard(){
        this.codes = {
            'й': 0,
            'ц': 1,
            'у': 2,
            'к': 3,
            'е': 4,
            'н': 5,
            'г': 6,
            'ш': 7,
            'щ': 8,
            'з': 9,
            'х': 10,
            'ъ': 11,

            'ф': 12,
            'ы': 13,
            'в': 14,
            'а': 15,
            'п': 16,
            'р': 17,
            'о': 18,
            'л': 19,
            'д': 20,
            'ж': 21,
            'э': 22,
            'Enter': 23,

            'я': 24,
            'ч': 25,
            'с': 26,
            'м': 27,
            'и': 28,
            'т': 29,
            'ь': 30,
            'б': 31,
            'ю': 32,
            'Shift': 33,
            'Space': 34,
        }
        this.buttons = [
            new Button(
                canvas.width*0.075, canvas.height*0.15, 120,'й',
                undefined, 1, undefined, 12),
            new Button(
                canvas.width*0.075*2, canvas.height*0.15, 120,'ц',
                0, 2, undefined, 13),
            new Button(
                canvas.width*0.075*3, canvas.height*0.15, 120,'у',
                1, 3, undefined, 14),
            new Button(
                canvas.width*0.075*4, canvas.height*0.15, 120,'к',
                2, 4, undefined, 15),
            new Button(
                canvas.width*0.075*5, canvas.height*0.15, 120,'е',
                3, 5, undefined, 16),
            new Button(
                canvas.width*0.075*6, canvas.height*0.15, 120,'н',
                4, 6, undefined, 17),
            new Button(
                canvas.width*0.075*7, canvas.height*0.15, 120,'г',
                5, 7, undefined, 18),
            new Button(
                canvas.width*0.075*8, canvas.height*0.15, 120,'ш',
                6, 8, undefined, 19),
            new Button(
                canvas.width*0.075*9, canvas.height*0.15, 120,'щ',
                7, 9, undefined, 20),
            new Button(
                canvas.width*0.075*10, canvas.height*0.15, 120,'з',
                8, 10, undefined, 21),
            new Button(
                canvas.width*0.075*11, canvas.height*0.15, 120,'х',
                9, 11, undefined, 22),
            new Button(
                canvas.width*0.075*12, canvas.height*0.15, 120,'ъ',
                10, undefined, undefined, 23),

            new Button(
                canvas.width*0.075, canvas.height*0.2*2, 120,'ф',
                undefined, 13, 0, 24),
            new Button(
                canvas.width*0.075*2, canvas.height*0.2*2, 120,'ы',
                12, 14, 1, 25),
            new Button(
                canvas.width*0.075*3, canvas.height*0.2*2, 120,'в',
                13, 15, 2, 26),
            new Button(
                canvas.width*0.075*4, canvas.height*0.2*2, 120,'а',
                14, 16, 3, 27),
            new Button(
                canvas.width*0.075*5, canvas.height*0.2*2, 120,'п',
                15, 17, 4, 28),
            new Button(
                canvas.width*0.075*6, canvas.height*0.2*2, 120,'р',
                16, 18, 5, 29),
            new Button(
                canvas.width*0.075*7, canvas.height*0.2*2, 120,'о',
                17, 19, 6, 30),
            new Button(
                canvas.width*0.075*8, canvas.height*0.2*2, 120,'л',
                18, 20, 7, 31),
            new Button(
                canvas.width*0.075*9, canvas.height*0.2*2, 120,'д',
                19, 21, 8, 32),
            new Button(
                canvas.width*0.075*10, canvas.height*0.2*2, 120,'ж',
                20, 22, 9, 33),
            new Button(
                canvas.width*0.075*11, canvas.height*0.2*2, 120,'э',
                21, 23, 10, 34),
            new Button(
                canvas.width*0.075*12, canvas.height*0.2*2, 120,'Enter',
                22, undefined, 11, 35),


            new Button(
                canvas.width*0.075, canvas.height*0.217*3, 120,'я',
                undefined, 25, 12, 36),
            new Button(
                canvas.width*0.075*2, canvas.height*0.217*3, 120,'ч',
                24, 26, 13, 36),
            new Button(
                canvas.width*0.075*3, canvas.height*0.217*3, 120,'с',
                25, 27, 14, 36),
            new Button(
                canvas.width*0.075*4, canvas.height*0.217*3, 120,'м',
                26, 28, 15, 36),
            new Button(
                canvas.width*0.075*5, canvas.height*0.217*3, 120,'и',
                27, 29, 16, 36),
            new Button(
                canvas.width*0.075*6, canvas.height*0.217*3, 120,'т',
                28, 30, 17, 36),
            new Button(
                canvas.width*0.075*7, canvas.height*0.217*3, 120,'ь',
                29, 31, 18, 36),
            new Button(
                canvas.width*0.075*8, canvas.height*0.217*3, 120,'б',
                30, 32, 19, 36),
            new Button(
                canvas.width*0.075*9, canvas.height*0.217*3, 120,'ю',
                31, 33, 20, 36),
            new Button(
                canvas.width*0.075*10, canvas.height*0.217*3, 120,'ж',
                32, 34, 21, 36),
            new Button(
                canvas.width*0.075*11, canvas.height*0.217*3, 120,'.',
                33, 35, 22, 36),
            new Button(
                canvas.width*0.075*12, canvas.height*0.217*3, 120,'Shift',
                34, undefined, 23, 36),


            new Button(
                canvas.width*0.075*5, canvas.height*0.22*4, 100,'Space',
                undefined, undefined, 30, undefined),
        ];
        this.buttons[0].selected = true;
        this.selectedNow = 0;
    }
    Keyboard.prototype.draw = function (){
        this.buttons.forEach(function (item, i, arr) {
            item.draw();
        });
        this.buttons[this.selectedNow].forSelected();
    }
    Keyboard.prototype.changeSelection = function (kind){
        if(kind === 'left'){
            let selectedNow = this.buttons[this.selectedNow].leftNeighbour;
            if (selectedNow !== undefined) {
                this.buttons[this.selectedNow].selected = false;
                this.buttons[this.selectedNow].timer = undefined;
                this.buttons[selectedNow].selected = true;
                this.selectedNow = selectedNow;
            }

        } else if(kind === 'right'){
            let selectedNow = this.buttons[this.selectedNow].rightNeighbour;
            if (selectedNow !== undefined) {
                this.buttons[this.selectedNow].selected = false;
                this.buttons[this.selectedNow].timer = undefined;
                this.buttons[selectedNow].selected = true;
                this.selectedNow = selectedNow;
            }
        } else if(kind === 'top'){
            let selectedNow = this.buttons[this.selectedNow].topNeighbor;
            if (selectedNow !== undefined) {
                this.buttons[this.selectedNow].selected = false;
                this.buttons[this.selectedNow].timer = undefined;
                this.buttons[selectedNow].selected = true;
                this.selectedNow = selectedNow;
            }
        } else if(kind === 'bottom'){
            let selectedNow = this.buttons[this.selectedNow].bottomNeighbor;
            if (selectedNow !== undefined) {
                this.buttons[this.selectedNow].selected = false;
                this.buttons[this.selectedNow].timer = undefined;
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