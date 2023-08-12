$(document).ready(function() {
    const canvas = document.getElementById('calibrationScreen');
    let canvasSelector = $('#calibrationScreen');
    const context = canvas.getContext('2d');
    canvas.width = canvas.getBoundingClientRect().width;
    canvas.height = canvas.getBoundingClientRect().height;


    function CalibrationAnimation(){
        this.startTime = undefined;
        this.status = undefined;
        this.rightData = [];
        this.leftData = [];
        this.topData = [];
        this.bottomData = [];
    }
    CalibrationAnimation.prototype.saveData = function (paramsData) {
        if (this.status !== undefined){
            switch (this.status){
                case 'right':
                    this.rightData.push(paramsData.right);
                    break;
                case 'left':
                    this.leftData.push(paramsData.left);
                    break;
                case 'top':
                    this.topData.push(paramsData.top);
                    break;
                case 'bottom':
                    this.bottomData.push(paramsData.bottom);
                    break;
            }
        }
    }
    CalibrationAnimation.prototype.processing = function (){
        let rightDist;
        let leftDist;
        let topDist;
        let bottomDist;
        function compareNumeric(a, b) {
            if (a > b) return 1;
            if (a === b) return 0;
            if (a < b) return -1;
        }
        this.rightData.sort(compareNumeric);
        this.leftData.sort(compareNumeric);
        this.topData.sort(compareNumeric);
        this.bottomData.sort(compareNumeric);
        const average = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;
        rightDist = average(this.rightData.slice(Math.floor(this.rightData.length*0.1), Math.floor(this.rightData.length*0.9)));
        leftDist = average(this.leftData.slice(Math.floor(this.leftData.length*0.1), Math.floor(this.leftData.length*0.9)));
        topDist = average(this.topData.slice(Math.floor(this.topData.length*0.1), Math.floor(this.topData.length*0.9)));
        bottomDist = average(this.bottomData.slice(Math.floor(this.bottomData.length*0.1), Math.floor(this.bottomData.length*0.9)));
        let a = document.createElement("a");
        a.href = "../?r=" + rightDist.toFixed(6) +
            "&l="+leftDist.toFixed(6)+
            "&t="+topDist.toFixed(6)+
            "&b="+bottomDist.toFixed(6);
        a.click();

    }
    CalibrationAnimation.prototype.animate =  function (){
        if (this.startTime === undefined){
            this.startTime = new Date();
        }
        let nowTime = new Date();
        if (nowTime.getTime() - this.startTime.getTime() < 5000){
            context.font = "bold 44px verdana, sans-serif";
            context.textAlign = "center"
            context.textBaseline = "center";
            context.fillStyle = "#000000";
            context.fillText('Калибровка алгоритма', canvas.width*0.5, canvas.height*0.40);
            context.fillText('Пожалуйста поворачивайте глаза туда куда будет сказано', canvas.width*0.5, canvas.height*0.5);
            context.fillText('Это не займет много времени', canvas.width*0.5, canvas.height*0.60);

        } else if (nowTime.getTime() - this.startTime.getTime() < 6000){

        } else if (nowTime.getTime() - this.startTime.getTime() < 9000){
            context.font = "bold 44px verdana, sans-serif";
            context.textAlign = "center"
            context.textBaseline = "center";
            context.fillStyle = "#000000";
            context.fillText('Смотрите вправо', canvas.width*0.5, canvas.height*0.5);
            this.status = 'right';
        } else if (nowTime.getTime() - this.startTime.getTime() < 10000){
            this.status = undefined;
        }
        else if (nowTime.getTime() - this.startTime.getTime() < 13000){
            context.font = "bold 44px verdana, sans-serif";
            context.textAlign = "center"
            context.textBaseline = "center";
            context.fillStyle = "#000000";
            context.fillText('Смотрите влево', canvas.width*0.5, canvas.height*0.5);
            this.status = 'left';
        } else if (nowTime.getTime() - this.startTime.getTime() < 14000){
            this.status = undefined;
        } else if (nowTime.getTime() - this.startTime.getTime() < 17000){
            context.font = "bold 44px verdana, sans-serif";
            context.textAlign = "center"
            context.textBaseline = "center";
            context.fillStyle = "#000000";
            context.fillText('Смотрите вверх', canvas.width*0.5, canvas.height*0.5);
            this.status = 'top';
        } else if (nowTime.getTime() - this.startTime.getTime() < 18000){
            this.status = undefined;

        } else if (nowTime.getTime() - this.startTime.getTime() < 21000){
            context.font = "bold 44px verdana, sans-serif";
            context.textAlign = "center"
            context.textBaseline = "center";
            context.fillStyle = "#000000";
            context.fillText('Смотрите вниз', canvas.width*0.5, canvas.height*0.5);
            this.status = 'bottom';
        } else if (nowTime.getTime() - this.startTime.getTime() >= 21000){
            this.status = undefined;
            animation.processing();
        }
    }
    let animation = new CalibrationAnimation();

    canvasSelector.on('eyeParam', function (e) {
        animation.saveData(e.detail);
    });
    function screenLoop(){
        context.clearRect(0, 0, canvas.width, canvas.height);
        animation.animate()
        requestAnimationFrame(screenLoop);
    }
    canvasSelector.on('trackingReady', function () {
        screenLoop();
    });
});