document.addEventListener("DOMContentLoaded", function () {
    window.dim = document.querySelector('.dim');
    window.popup = document.querySelector('.popup');
    window.popOpenBtn = document.querySelector('.btn__open');
    window.popCloseBtns = document.querySelectorAll('.btn__close');
    window.popBody = document.getElementById('popBody');
    window.popFoot = document.getElementById('popFoot');

    window.closePop = function() {
        dim.classList.remove('active');
        popup.classList.remove('active');
    }
    window.openPop = function() {
        dim.classList.add('active');
        popup.classList.add('active');
    }

    window.createEl = function(tag, className = '', txt = '', id = '') {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (txt) element.innerText = txt;
        if (id) element.id = id;
        return element;
    }

    window.initPopBody = function(message) {
        popBody.innerHTML = `<p class="txt__center">${message}</p>`;
    }

    window.goToHomeBtn = createEl('button', 'btn btn__blue', '이동', 'goToHome');
    window.closeBtn = createEl('button', 'btn btn__red btn__close', '닫기', 'popClose');

    window.createBtn = function(btnName) {
        if (btnName instanceof Node) {
            popFoot.appendChild(btnName);
        }
    }

    window.initPopFoot = function(event) {
        window.popFoot.innerHTML = '';
        if (event.target && event.target.classList.contains('btn__home')) {
            window.createBtn(window.goToHomeBtn);
        }
        window.createBtn(window.closeBtn);
    }

    dim.addEventListener('click', function() {
        closePop();
    });

    popCloseBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            closePop();
        });
    });

    const btnHomePop = document.querySelector('.btn__home');
    if (btnHomePop) {
        btnHomePop.addEventListener('click', function(event) {
            
            initPopBody(`게임을 그만두고 홈화면으로 돌아가시겠습니까?`)
            initPopFoot(event);
            openPop();
        });
    }
    
    if (popFoot) {
        popFoot.addEventListener('click', function(event) {
            if (event.target && event.target.id === 'goToHome') {
                closePop();
                window.location.href = 'index.html';
            }
    
            if (event.target && event.target.id === 'popClose') {
                closePop();
            }
        });
    }
});
