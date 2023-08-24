$(document).ready(function() {
    $('#notepad').on('print', function (e) {
        let text = $('#notepad').text();
        $('#notepad').text(text+e.detail.text);
    });
    $('#notepad').on('delChar', function () {
        let text = $('#notepad').text();
        text = text.slice(0, text.length-1)
        $('#notepad').text(text);
    });
});