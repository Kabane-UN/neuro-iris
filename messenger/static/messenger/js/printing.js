$(document).ready(function() {
    $('#notepad').on('print', function (e) {
        let text = $('#notepad').text();
        $('#notepad').text(text+e.detail.text);
        text = $('#notepad').text();
        if (text === word){
            saveData();
        }
    });

    $('#notepad').on('delChar', function () {
        let text = $('#notepad').text();
        text = text.slice(0, text.length-1)
        $('#notepad').text(text);
        text = $('#notepad').text();
        if (text === word){
            saveData();
        }
    });
    function saveData () {
            $.ajax({
              data: {
                  name: localStorage.getItem('name'),
                  surname: localStorage.getItem('surname'),
                  patronymic: localStorage.getItem('patronymic'),
                  age: localStorage.getItem('age'),
                  gender: localStorage.getItem('gender'),
                  margins: margins,
                  word: word,
                  time: timer.toString(),
              },
              type: 'POST',
              url: saveURL,
              success: function (response) {
                  let a = document.createElement("a");
                  a.href = "success_screen";
                  a.click();
              },
              error: function (response) {
                  let a = document.createElement("a");
                  a.href = "fail_screen";
                  a.click();
              }
            });
    }
});