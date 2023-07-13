$(document).ready(function() {
    $('#notepad').on('print', function (e) {
        let text = $('#notepad').text();
        $('#notepad').text(text+e.detail.text);
    });
});