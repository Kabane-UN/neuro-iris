$(document).ready(function() {
    $('#word').text(word);
    let oldTime;
    function timerLoop(){
        $('#timer').text(((new Date()).getTime()-oldTime)/1000)
        timer = $('#timer').text()
        requestAnimationFrame(timerLoop);
    }
    $('#timer').on('trackingReady', function () {
        oldTime = (new Date()).getTime();
        timerLoop();
    });

});