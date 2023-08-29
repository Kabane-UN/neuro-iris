$(document).ready(function() {
    $('#toStartButton').on("click",function () {
        let a = document.createElement("a");
        a.href = "settings";
        a.click();
    });
});