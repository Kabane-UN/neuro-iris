$(document).ready(function() {
    $('#coordTable').on('data', function (e) {
        $('#rightIdeal').text(e.detail.rightIdeal);
        $('#rightNow').text(e.detail.rightNow);
        if (e.detail.rightNow <= e.detail.rightIdeal){
            $('#rightNow').css('color', 'red');
        } else {
            $('#rightNow').css('color', 'black');
        }
        $('#leftIdeal').text(e.detail.leftIdeal);
        $('#leftNow').text(e.detail.leftNow);
        if (e.detail.leftNow <= e.detail.leftIdeal){
            $('#leftNow').css('color', 'red');
        } else {
            $('#leftNow').css('color', 'black');
        }
        $('#topIdeal').text(e.detail.topIdeal);
        $('#topNow').text(e.detail.topNow);
        if (e.detail.topNow <= e.detail.topIdeal){
            $('#topNow').css('color', 'red');
        } else {
            $('#topNow').css('color', 'black');
        }
        $('#bottomIdeal').text(e.detail.bottomIdeal);
        $('#bottomNow').text(e.detail.bottomNow);
        if (e.detail.bottomNow <= e.detail.bottomIdeal){
            $('#bottomNow').css('color', 'red');
        } else {
            $('#bottomNow').css('color', 'black');
        }
    });
});