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
    const btnYahtzee = document.getElementById('btnYahtzee');
    const btnFullHouse = document.getElementById('btnFullHouse');
    const btnStraightS = document.getElementById('btnStraightS');
    const btnStraightL = document.getElementById('btnStraightL');
    const txtYahtzeeBonus = document.getElementById('txtYahtzeeBonus');
    const btnTopScore = document.getElementById('btnTopScore');

    // 1.1 상단 1 ~ 6 주사위 총합
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


    // 1.2 하단 점수 설정
    
    // 모든 주사위 총합
    const allFacesOfDiec = (acesCount * 1) + (twosCount * 2) + (threesCount * 3) + (foursCount * 4) + (fivesCount * 5) + (sixesCount * 6);
    function chance() {
        btnChance.textContent = allFacesOfDiec + `점`;
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
        if (match) {
            return parseInt(match[1], 10);
        } else {
            console.warn("⚠ 숫자 추출 실패:", dice.className);
            return 0;
        }
    }

    function checkKind(kind, countRequired) {
        const numbers = diceResults.map(dice => {
            const num = getClassNumber(dice);
            return num;
        });
        
        let countMap = numbers.reduce((acc, num) => {
            acc[num] = (acc[num] || 0) + 1;
            return acc;
        }, {});
    
        // 풀하우스일 경우 추가
        if (kind === 'fullHouse') {
            const countValues = Object.values(countMap);
            const hasThreeOfKind = countValues.includes(3);
            const hasPair = countValues.includes(2);

            const button = btnFullHouse;
            button.textContent = (hasThreeOfKind && hasPair) ? '25점' : '0점';

            return (hasThreeOfKind && hasPair) ? 25 : 0;
        }

        const isKind = Object.values(countMap).some(count => count >= countRequired);    
        const button = kind === 3 ? btn3OfAKind : kind === 4 ? btn4OfAKind : kind === 5 ? btnYahtzee : null;
        
        button.textContent = isKind ? `${allFacesOfDiec} 점` : '0점';
        return isKind ? allFacesOfDiec : 0;
    }
    
    function threeOfAKind() {
        return checkKind(3, 3);
    }
    
    function fourOfAKind() {
        return checkKind(4, 4);
    }
    function yahtzee() { 
        return checkKind(5, 5);
    }
    
    function fullHouse() {
        return checkKind('fullHouse', 0);
    }

    //스트라이트
    function checkStraight(length, button) {
        const numbers = diceResults.map(dice => getClassNumber(dice)).sort((a, b) => a - b); // 주사위 숫자 오름차순 정렬
        
        let consecutiveCount = 1;
        for (let i = 1; i < numbers.length; i++) {
            if (numbers[i] === numbers[i - 1] + 1) {
                consecutiveCount++;
            } else if (numbers[i] !== numbers[i - 1]) {
                consecutiveCount = 1;
            }
    
            if (consecutiveCount === length) {
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
            txtYahtzeeBonus.textContent =`0점`
        }
    }  

    // 2. 총 스코어
    function topScore() {
        const topScoreBtns = document.querySelectorAll('.score__btn.top.fix');

        const totalSum = Array.from(topScoreBtns).reduce((sum, topScoreBtn) => {
            const buttonText = topScoreBtn.textContent.trim();
            const number = buttonText.match(/\d+/);
        
            if (number) {
                sum += parseInt(number[0], 10);
            }
        
            return sum;
        }, 0)

        btnTopScore.textContent = totalSum+`점`;
    }

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
        fullHouse()
        straughtS()
        straughtL()
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
            topScore()
        })
    })
});