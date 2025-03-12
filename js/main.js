document.addEventListener("DOMContentLoaded", function () {
    // 페이지 이동 설정
    const homeBtn = document.querySelector('.btn__home');
    homeBtn.addEventListener('click', function () {
        const moveHome = confirm('게임을 그만두고 돌아가시겠습니까?');
        if (moveHome) {
            window.location.href = 'intro.html';
        }
    })

    // 주사위 굴리기 설정
    const dices = document.querySelectorAll('.dice');
    dices.forEach(dice => {
        let resetClass = `dice num__0${Math.floor(Math.random() * 6) + 1}`;
        dice.className = resetClass;

        dice.addEventListener('click', function () {
            dice.classList.toggle('fix')
        })
    })


    // 1. 각 영역별 점수 설정

    // 변수 설정
    const btnAces = document.getElementById('btnAces');
    const btnTwos = document.getElementById('btnTwos');
    const btnThrees = document.getElementById('btnThrees');
    const btnFours = document.getElementById('btnFours');
    const btnFives = document.getElementById('btnFives');
    const btnSixes = document.getElementById('btnSixes');

    // 1.1 상단 1 ~ 6 주사위 총합
    function calculateUpperSection(num, btn) {
        if (!btn) {
            console.warn(`⚠ 버튼이 존재하지 않음: btn${num}Aces`);
            return 0; // 버튼이 없으면 0 반환
        }
        const count = document.querySelectorAll(`.num__0${num}`).length;
        const score = count * num;
        btn.textContent = `${score}점`;

        return score;
    }

    calculateUpperSection(1, btnAces);
    calculateUpperSection(2, btnTwos);
    calculateUpperSection(3, btnThrees);
    calculateUpperSection(4, btnFours);
    calculateUpperSection(5, btnFives);
    calculateUpperSection(6, btnSixes);

    const btnChance = document.getElementById('btnChance');
    const btn3OfAKind = document.getElementById('btn3OfAKind');
    const btn4OfAKind = document.getElementById('btn4OfAKind');
    const btnYahtzee = document.getElementById('btnYahtzee');
    const btnFullHouse = document.getElementById('btnFullHouse');
    const btnStraightS = document.getElementById('btnStraightS');
    const btnStraightL = document.getElementById('btnStraightL');
    const txtYahtzeeBonus = document.getElementById('txtYahtzeeBonus');
    const btnTopScore = document.getElementById('btnTopScore');
    const AllScore = document.getElementById('AllScore');
    // 1.2 하단 점수 설정

    // 모든 주사위 총합
    function chance() {
        const total =
            calculateUpperSection(1, btnAces) +
            calculateUpperSection(2, btnTwos) +
            calculateUpperSection(3, btnThrees) +
            calculateUpperSection(4, btnFours) +
            calculateUpperSection(5, btnFives) +
            calculateUpperSection(6, btnSixes);
        btnChance.textContent = `${total}점`;
        return total;
    }

    // 각 자리별 주사위 눈값 추출
    const diceN1 = document.getElementById('diceN1');
    const diceN2 = document.getElementById('diceN2');
    const diceN3 = document.getElementById('diceN3');
    const diceN4 = document.getElementById('diceN4');
    const diceN5 = document.getElementById('diceN5');
    const diceResults = Array.from(document.querySelectorAll('[id^="diceN"]'));

    // 중복 되는 주사위 갯수 확인 
    function getClassNumber(dice) {
        if (!dice) return 0;
        const match = dice.className.match(/num__(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
    }

    function checkKind(countRequired, btn, fixedScore = false) {
        const numbers = diceResults.map(dice => getClassNumber(dice));
        let countMap = numbers.reduce((acc, num) => {
            acc[num] = (acc[num] || 0) + 1;
            return acc;
        }, {});

        const isKind = Object.values(countMap).some(count => count >= countRequired);
        const totalScore = chance();  // ✅ 수정된 부분
        btn.textContent = isKind ? `${fixedScore ? fixedScore : totalScore}점` : '0점';
    }

    checkKind(3, btn3OfAKind);
    checkKind(4, btn4OfAKind);
    checkKind(5, btnYahtzee, 50);

    function fullHouse() {
        const numbers = diceResults.map(dice => getClassNumber(dice));
        let countMap = numbers.reduce((acc, num) => {
            acc[num] = (acc[num] || 0) + 1;
            return acc;
        }, {});

        const counts = Object.values(countMap);
        const hasThreeOfKind = counts.includes(3);
        const hasPair = counts.includes(2);

        btnFullHouse.textContent = (hasThreeOfKind && hasPair) ? '25점' : '0점';
    }

    //스트라이트
    function checkStraight(length, button) {
        const uniqueNumbers = [...new Set(diceResults.map(dice => getClassNumber(dice)))].sort((a, b) => a - b);
        let consecutiveCount = 1;
        for (let i = 1; i < uniqueNumbers.length; i++) {
            if (uniqueNumbers[i] === uniqueNumbers[i - 1] + 1) {
                consecutiveCount++;
            } else {
                consecutiveCount = 1;
            }

            if (consecutiveCount >= length) {
                button.textContent = `${length === 4 ? 30 : 40}점`;
                return;
            }
        }
        button.textContent = '0점';
    }

    function straughtS() {
        checkStraight(4, btnStraightS);
    }

    function straughtL() {
        checkStraight(5, btnStraightL);
    }

    // 야찌 보너스
    function yahtzeeBonus() {
        if (document.getElementById('btnYahtzee').textContent.trim() === '50점') {

        } else {
            txtYahtzeeBonus.textContent = `0점`
        }
    }

    // 2. 총 스코어
    function getSumFromButtons(selector) {
        const buttons = document.querySelectorAll(selector);
        if (!buttons.length) return 0;

        return Array.from(buttons).reduce((sum, btn) => {
            if (!btn || !btn.textContent) return sum;
            const number = btn.textContent.trim().match(/\d+/);
            return sum + (number ? parseInt(number[0], 10) : 0);
        }, 0);
    }


    function topScore() {
        const topSum = getSumFromButtons('.score__btn.top.fix') || 0;
        if (isNaN(topSum)) topSum = 0; // NaN 방지
        btnTopScore.textContent = `${topSum}점`;
        lastScore(topSum);
    }

    function lastScore(topSum = 0) {
        const bottomSum = getSumFromButtons('.score__bottom.fix') || 0;
        const totalSum = (topSum || 0) + bottomSum;
        AllScore.textContent = `${totalSum}점`;
    }

    // 기본 점수 0으로 설정
    btnTopScore.textContent = `0점`;
    AllScore.textContent = `0점`;

    function updateScore() {
        const topSum = getSumFromButtons('.score__btn.top.fix') || 0;
        const bottomSum = getSumFromButtons('.score__bottom.fix') || 0;
        const totalSum = topSum + bottomSum;

        btnTopScore.textContent = `${topSum}점`;
        AllScore.textContent = `${totalSum}점`;
    }

    function initScore() {
        [1, 2, 3, 4, 5, 6].forEach(num => {
            const btn = document.getElementById(`btn${num}Aces`);
            if (btn) calculateUpperSection(num, btn);
        });

        chance();
        checkKind(3, btn3OfAKind);
        checkKind(4, btn4OfAKind);
        checkKind(5, btnYahtzee, 50);
        fullHouse();
        straughtS()
        straughtL()
        checkStraight(4, btnStraightS);
        checkStraight(5, btnStraightL);
        yahtzeeBonus();

        updateScore()
    }

    document.body.addEventListener('click', function (e) {
        if (e.target.classList.contains('score__btn')) {
            e.target.classList.toggle('fix');
            updateScore();
        }
    });

    // 클릭 횟수 설정
    let clickCount = 1;
    const rollingBtn = document.querySelector('.btn__rolling');
    const rollingCount = document.querySelector('.rolling__chance > span');
    const maxLolling = 3;

    rollingBtn.addEventListener('click', function () {
        if (clickCount < maxLolling) {
            rollingCount.textContent = ++clickCount;
            dices.forEach(dice => {
                if (!dice.classList.contains('fix')) {
                    dice.classList.add('rolling');

                    setTimeout(() => {
                        let randomNumber = Math.floor(Math.random() * 6) + 1;
                        dice.classList.remove('rolling');
                        dice.className = `dice num__0${randomNumber}`;

                        initScore(); // ✅ 주사위 굴릴 때 점수 업데이트
                    }, 900);
                }
            });
        }

        rollingBtn.disabled = clickCount >= maxLolling;
    });

    // 점수 초기화
    initScore()

    // 점수 버튼 설정
    const scoreBtns = document.querySelectorAll('.score__btn');
    scoreBtns.forEach(scoreBtn => {
        scoreBtn.addEventListener('click', function () {
            scoreBtn.classList.toggle('fix')
            topScore()
            lastScore()
        })
    })
});

