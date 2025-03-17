document.addEventListener("DOMContentLoaded", function () {
    const dim = document.querySelector('.dim');
    const popup = document.querySelector('.popup');
    const popOpenBtn = document.querySelector('.btn__open');
    const popCloseBtns = document.querySelectorAll('.btn__close');

    function closePop() {
        dim.classList.remove('active');
        popup.classList.remove('active');
    }
    if(popOpenBtn) {
        popOpenBtn.addEventListener('click', function () {
            dim.classList.toggle('active');
            popup.classList.toggle('active');
        })
    }

    dim.addEventListener('click', function () { closePop() });
    popCloseBtns.forEach(btn => {
        btn.addEventListener('click', function () { closePop() });
    });

    // 페이지 이동 설정
    const homeBtn = document.getElementById('goToHome');
    if(homeBtn) {
        homeBtn.addEventListener('click', function () {
            closePop()
            window.location.href = 'intro.html';
        })
    }
});