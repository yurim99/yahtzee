document.addEventListener("DOMContentLoaded", function () {
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
    function updateScoreSection(btn, num) {
        if (!btn) return 0;

        if (btn.classList.contains('save')) return parseInt(btn.textContent) || 0;

        const count = document.querySelectorAll(`.num__0${num}`).length;
        const score = count * num;
        btn.textContent = `${score}점`;

        return score;
    }

    updateScoreSection(btnAces, 1);
    updateScoreSection(btnTwos, 2);
    updateScoreSection(btnThrees, 3);
    updateScoreSection(btnFours, 4);
    updateScoreSection(btnFives, 5);
    updateScoreSection(btnSixes, 6);

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

    // 각 자리별 주사위 눈값 추출
    const diceResults = Array.from(document.querySelectorAll('[id^="diceN"]'));
    //console.log(diceResults);

    // 모든 주사위 총합
    function chance() {
        let total = 0;

        diceResults.forEach(dice => {
            const match = dice.className.match(/num__(\d+)/);
            if (match) {
                total += parseInt(match[1], 10);
            }
        });

        // 버튼에 총합 표시
        if (btnChance.classList.contains('save')) {
            return parseInt(btnChance.textContent) || 0;
        }

        btnChance.textContent = `${total}점`;
        return total;
    }

    // 중복 되는 주사위 갯수 확인 
    function getClassNumber(dice) {
        if (!dice) return 0;
        const match = dice.className.match(/num__(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
    }

    function checkKind(countRequired, btn, fixedScore = false) {
        if (btn.classList.contains('save')) {
            return;
        }

        const numbers = Array.from(dices).map(dice => getClassNumber(dice));
        let countMap = numbers.reduce((acc, num) => {
            acc[num] = (acc[num] || 0) + 1;
            return acc;
        }, {});

        const isKind = Object.values(countMap).some(count => count >= countRequired);
        const totalScore = chance();

        btn.textContent = isKind ? `${fixedScore || totalScore}점` : '0점';
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
        if (btnYahtzee.textContent.trim() === '50점' && checkKind(5, btnYahtzee)) {
            txtYahtzeeBonus.textContent = `100점`
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
        if (isNaN(topSum)) topSum = 0;
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

    function initScore(resetFix = false) {
        [btnAces, btnTwos, btnThrees, btnFours, btnFives, btnSixes].forEach((btn, i) => {
            if (!btn.classList.contains('save')) updateScoreSection(btn, i + 1);
        });

        [
            [btnChance, chance],
            [btn3OfAKind, () => checkKind(3, btn3OfAKind)],
            [btn4OfAKind, () => checkKind(4, btn4OfAKind)],
            [btnYahtzee, () => checkKind(5, btnYahtzee, 50)],
            [btnFullHouse, fullHouse],
            [btnStraightS, () => checkStraight(4, btnStraightS)],
            [btnStraightL, () => checkStraight(5, btnStraightL)],
        ].forEach(([btn, func]) => {
            if (!btn.classList.contains('save')) func();
        });

        yahtzeeBonus();

        if (resetFix) {
            document.querySelectorAll('.score__btn:not(.save)').forEach(btn => btn.classList.remove('fix'));
        }

        updateScore();
    }

    // 클릭 횟수 설정
    let clickCount = 1;
    const rollingBtn = document.getElementById('btnRolling');
    const rollingCount = document.querySelector('.rolling__chance > span');
    const maxLolling = 3;
    let isRolling = false;

    function rollDice() {
        if (clickCount >= maxLolling || isRolling) return;

        isRolling = true;
        rollingCount.textContent = ++clickCount;
        let rollingComplete = 0;

        dices.forEach(dice => {
            if (!dice.classList.contains('fix')) {
                dice.classList.add('rolling');

                setTimeout(() => {
                    let randomNumber = Math.floor(Math.random() * 6) + 1;
                    dice.classList.remove('rolling');
                    dice.className = `dice num__0${randomNumber}`;

                    rollingComplete++;

                    initScore(true);
                    isRolling = false;
                    // if (rollingComplete === dices.length) {
                    // }
                }, 900);
            }
        });

        setTimeout(() => {
            if (clickCount >= maxLolling) {
                rollingBtn.disabled = true;
            }
        }, 1000);
    }

    rollingBtn.addEventListener('click', rollDice);



    // 점수 버튼 설정
    const scoreBtns = document.querySelectorAll('.score__btn');
    scoreBtns.forEach(scoreBtn => {
        scoreBtn.addEventListener('click', function () {
            if (!scoreBtn.classList.contains('save')) {
                scoreBtn.classList.toggle('fix');
                initScore();
            }
        });
    });

    // 턴 저장
    let lastClickedScoreBtn = null;

    document.body.addEventListener('click', function (e) {
        if (e.target.classList.contains('score__btn')) {
            if (!e.target.classList.contains('save')) {

                if (lastClickedScoreBtn && lastClickedScoreBtn !== e.target) {
                    lastClickedScoreBtn.classList.remove('fix');
                }

                e.target.classList.add('fix');
                lastClickedScoreBtn = e.target;
                updateScore();
            } else {

            }
        }
    });


    const btnTurnSave = document.getElementById('btnTurnSave');
    let currTurn = 1;
    let maxTurn = 14;

    //턴 저장
    btnTurnSave.addEventListener('click', function (event) {
        if (lastClickedScoreBtn) {
            lastClickedScoreBtn.classList.add('save');
            lastClickedScoreBtn = null;

            dices.forEach(dice => dice.classList.remove('fix'));

            clickCount = 0;
            rollingCount.textContent = clickCount;
            rollingBtn.disabled = false;

            setTimeout(() => {
                rollDice();
            }, 500);

            if (currTurn < maxTurn) {
                ++currTurn;
                document.documentElement.style.setProperty('--progress', `calc(100% / ${maxTurn} * ${currTurn})`);
            }

            const total = parseInt(AllScore.textContent.trim()) || 0;
            if (currTurn == maxTurn) {
                initPopBody(`게임이 종료되었습니다!<br>최종 점수는 ${total}점 입니다`)
                initPopFoot(event);
                openPop()
                rollingBtn.disabled = false;
            }
        } else {
            initPopBody(`점수를 선택해주세요.`);
            initPopFoot(event);
            openPop()
        }

    });

});

window.addEventListener("beforeunload", function (event) {
    event.preventDefault();
});