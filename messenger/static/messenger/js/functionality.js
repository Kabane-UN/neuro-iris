$(document).ready(function() {
    $('#calibrationIcon').on("click",function () {
        let a = document.createElement("a");
        a.href = "calibration?margins=" + margins +
            "&word="+word;
        a.click();
    });
    $('#settingsIcon').on("click",function () {
        let a = document.createElement("a");
        a.href = "settings"
        a.click();
    });
});