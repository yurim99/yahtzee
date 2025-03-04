document.addEventListener("DOMContentLoaded", function () {
    const homeBtn = document.querySelector('.btn__home');
    homeBtn.addEventListener('click', function () {
        const moveHome = confirm('게임을 그만두고 돌아가시겠습니까?');
        if (moveHome) {
            window.location.href = 'intro.html';
        }
    })

    const dices = document.querySelectorAll('.dice');
    dices.forEach(dice => {
        let resetClass = `dice num__0${Math.floor(Math.random() * 6) + 1}`;
        dice.className = resetClass;

        dice.addEventListener('click', function () {
            dice.classList.toggle('fix')
        })
    })

    const num01 = document.querySelectorAll('.num__01');
    const num02 = document.querySelectorAll('.num__02');
    const num03 = document.querySelectorAll('.num__03');
    const num04 = document.querySelectorAll('.num__04');
    const num05 = document.querySelectorAll('.num__05');
    const num06 = document.querySelectorAll('.num__06');
    const acesCount = num01.length;
    const twosCount = num02.length;
    const threesCount = num03.length;
    const foursCount = num04.length;
    const fivesCount = num05.length;
    const sixesCount = num06.length;
    const btnAces = document.getElementById('btnAces');
    const btnTwos = document.getElementById('btnTwos');
    const btnThrees = document.getElementById('btnThrees');
    const btnFours = document.getElementById('btnFours');
    const btnFives = document.getElementById('btnFives');
    const btnChance = document.getElementById('btnChance');
    const btn3OfAKind = document.getElementById('btn3OfAKind');
    const btn4OfAKind = document.getElementById('btn4OfAKind');
    const btnFullHouse = document.getElementById('btnFullHouse');
    const btnStraightS = document.getElementById('btnStraightS');
    const btnStraightL = document.getElementById('btnStraightL');

    function aces() {
        btnAces.textContent = acesCount + `점`;
    }
    function twos() {
        btnTwos.textContent = (twosCount * 2) + `점`;
    }
    function threes() {
        btnThrees.textContent = (threesCount * 3) + `점`;
    }
    function fours() {
        btnFours.textContent = (foursCount * 4) + `점`;
    }
    function fives() {
        btnFives.textContent = (fivesCount * 5) + `점`;
    }
    function sixes() {
        const btnSixes = document.getElementById('btnSixes');
        btnSixes.textContent = (sixesCount * 6) + `점`;
    }

    const allFacesOfDiec = (acesCount * 1) + (twosCount * 2) + (threesCount * 3) + (foursCount * 4) + (fivesCount * 5) + (sixesCount * 6);
    function chance() {
        btnChance.textContent = allFacesOfDiec + `점`;
    }

    const diceN1 = document.getElementById('diceN1');
    const diceN2 = document.getElementById('diceN2');
    const diceN3 = document.getElementById('diceN3');
    const diceN4 = document.getElementById('diceN4');
    const diceN5 = document.getElementById('diceN5');
    const diceResults = [diceN1, diceN2, diceN3, diceN4, diceN5];

    // getClassNumber 수정
    function getClassNumber(el) {
        const match = el.className.match(/\d+/);  // className에서 숫자 추출
        return match ? parseInt(match[0], 10) : null;
    }

    function checkKind(kind, countRequired) {
        const numbers = diceResults.map(dice => getClassNumber(dice));

        let countMap = numbers.reduce((acc, num) => {
            acc[num] = (acc[num] || 0) + 1;
            return acc;
        }, {});

        const isKind = Object.values(countMap).some(count => count >= countRequired);

        const button = kind === 3 ? btn3OfAKind : btn4OfAKind;

        if (isKind) {
            button.textContent = `${allFacesOfDiec} 점`;
        } else {
            button.textContent = '0점';
        }
    }

    function threeOfAKind() {
        checkKind(3, 3);
    }

    function fourOfAKind() {
        checkKind(4, 4);
    }
    // console.log(threeOfAKind())
    // console.log(fourOfAKind())


    function fullHowse() { }
    function straughtS() { }
    function StraughtL() { }
    function yahtzee() { }
    function yahtzeeBonus() { }
    function topScore() { }
    function lastScore() { }

    function initScore() {
        aces()
        twos()
        threes()
        fours()
        fives()
        sixes()
        chance()
        chance()
        threeOfAKind()
        fourOfAKind()
        fullHowse()
        straughtS()
        StraughtL()
        yahtzee()
        yahtzeeBonus()
        topScore()
        lastScore()
    }

    initScore()

    let clickCount = 1;
    const rollingBtn = document.querySelector('.btn__rolling');
    const rollingCount = document.querySelector('.rolling__chance > span');
    rollingBtn.addEventListener('click', function () {
        clickCount++;
        rollingCount.textContent = clickCount;

        initScore()
        dices.forEach(dice => {
            const activeDice = !(dice.classList.contains('fix'));
            if (activeDice) {
                dice.classList.add('rolling')

                setTimeout(function () {
                    let randomClass = `rolling dice num__0${Math.floor(Math.random() * 6) + 1}`;
                    if (!(dice.classList.contains('fix')))
                        dice.className = ''
                    dice.className = randomClass;
                    dice.classList.remove('rolling')
                }, 900)
            }
        })
        const observer = new MutationObserver(() => {
            dices.forEach(el => observer.observe(el, { attributes: true, attributeFilter: ['class'] }));
        })
    });

    const scoreBtns = document.querySelectorAll('.score__btn');
    scoreBtns.forEach(scoreBtn => {      
        scoreBtn.addEventListener('click', function() {
            scoreBtn.classList.toggle('fix')
        })
    })
});