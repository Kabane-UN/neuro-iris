$(document).ready(function() {
    let storName = localStorage.getItem('name');
    let storSurname = localStorage.getItem('surname');
    let storPatronymic = localStorage.getItem('patronymic');
    let storAge = localStorage.getItem('age');
    let storGender = localStorage.getItem('gender');
    if (storName !== null){
        $('#name').val(storName);
    }
    if (storSurname !== null){
        $('#surname').val(storSurname);
    }
    if (storPatronymic !== null){
        $('#patronymic').val(storPatronymic);
    }
    if (storAge !== null){
        $('#age').val(storAge);
    }
    if (storGender !== null){
        $('#gender option').prop('selected', false);
        $(`#gender option:contains(${storGender})`).prop('selected', true);

    }
    $('#subButton').on('click', function (e) {
        let nameIdVar = $('#name').val();
        let surnameIdVar = $('#surname').val();
        let patronymicIdVar = $('#patronymic').val();
        let ageIdVar = $('#age').val();
        let genderIdVar = $('#gender option:selected').text();
        let marginsIdVar = $('#margins option:selected').text();
        let wordIdVar = $('#word option:selected').text();
        localStorage.setItem('name', nameIdVar);
        localStorage.setItem('surname', surnameIdVar);
        localStorage.setItem('patronymic', patronymicIdVar);
        localStorage.setItem('age', ageIdVar);
        localStorage.setItem('gender', genderIdVar);
        let a = document.createElement("a");
        a.href = "calibration?margins=" + marginsIdVar +
            "&word="+wordIdVar;
        a.click();
    });
});