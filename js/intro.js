document.addEventListener("DOMContentLoaded", function () {
    const dim = document.querySelector('.dim');
    const popup = document.querySelector('.popup');
    const guideBtn = document.querySelector('.btn__guide');
    const popCloseBtn = document.querySelector('.btn__close');

    function closePop() {
        dim.classList.remove('active');
        popup.classList.remove('active');
    }
    guideBtn.addEventListener('click', function () {
        dim.classList.toggle('active');
        popup.classList.toggle('active');
    })

    dim.addEventListener('click', function () { closePop() });
    popCloseBtn.addEventListener('click', function () { closePop() });

});