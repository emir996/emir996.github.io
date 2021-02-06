document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const doodler = document.createElement('div');
    const resetBtn = document.createElement('BUTTON');
    let doodlerLeftSpace = 50;
    let startPoint = 150;
    let doodlerBottomSpace = startPoint;
    let isGameOver = false;
    let score = 0;
    let platformCount = 5;
    let platforms = [];
    let upTimerId;
    let downTimerId;
    let isJumping = true;
    let isGoingLeft = false;
    let isGoingRight = false;
    let leftTimerId;
    let rightTimerId;
    

    function createDoodler(){
        grid.appendChild(doodler);
        doodler.classList.add('doodler');
        doodler.style.bottom = doodlerBottomSpace + 'px';
        doodlerLeftSpace = platforms[0].left;
        doodler.style.left = doodlerLeftSpace + 'px';
    }

    class Platform {
        constructor(newPlatBottom){
            this.bottom = newPlatBottom;
            this.left = Math.random() * 315;
            this.visual = document.createElement('div');

            const visual = this.visual;
            visual.classList.add('platform');
            visual.style.bottom = this.bottom + 'px';
            visual.style.left = this.left + 'px';
            grid.appendChild(visual);
        }
    }

    function createPlatforms(){
        for(i = 0; i < platformCount; i++){
            let platGap = 600 / platformCount;
            let newPlatBottom = 100 + i * platGap;
            let newPlatform = new Platform(newPlatBottom);
            platforms.push(newPlatform);
        }
    }

    function movePlatforms(){
        if(doodlerBottomSpace > 90){
            platforms.forEach(platform => {
                platform.bottom -= 4;
                let visual = platform.visual;
                visual.style.bottom = platform.bottom + 'px';

                if(platform.bottom < 10){
                    let firstPlatform = platforms[0].visual;
                    firstPlatform.classList.remove('platform');
                    platforms.shift();
                    console.log(platforms);
                    let newPlatform = new Platform(600)
                    platforms.push(newPlatform);
                    score++
                }

            });
        }
    }

    function jump(){
        clearInterval(downTimerId);
        isJumping = true;
        upTimerId = setInterval(function(){
            doodlerBottomSpace += 20;
            doodler.style.bottom = doodlerBottomSpace + 'px';
            if(doodlerBottomSpace > startPoint + 200 || doodlerBottomSpace > 500){
                fall();
            }
        }, 30);
    }

    function fall(){
        clearInterval(upTimerId);
        isJumping = false;
        downTimerId = setInterval(function(){
            doodlerBottomSpace -= 7;
            doodler.style.bottom = doodlerBottomSpace + 'px';

            if(doodlerBottomSpace <= 0){
                gameOver();
            }

            platforms.forEach(platform => {
                if(
                    (doodlerBottomSpace >= platform.bottom) &&
                    (doodlerBottomSpace <= (platform.bottom + 15)) &&
                    ((doodlerLeftSpace + 60) >= platform.left) &&
                    (doodlerLeftSpace <= (platform.left + 85)) &&
                     !isJumping)

                {
                    // console.log(doodlerLeftSpace + 60, platform.left)
                    // console.log(doodlerLeftSpace, platform.left + 85)
                    console.log('landed');
                    startPoint = doodlerBottomSpace;
                    jump();
                    isJumping = true;
                }
            })

            

        }, 30)
    }

    

    function control(e){
    if(!isGameOver){
        if(e.key === "ArrowLeft"){
            moveLeft();
        } else if(e.key === "ArrowRight"){
            //move right
            moveRight();
        } else if(e.key === "ArrowUp"){
            moveStraight();
            //move straight
        }
    }
    }

    function moveLeft(){
        if(isGoingRight){
            clearInterval(rightTimerId);
            isGoingRight = false;
        }
        isGoingLeft = true;
        leftTimerId = setInterval(function(){
            if(doodlerLeftSpace > 0){
            doodlerLeftSpace -= 5;
            doodler.style.left = doodlerLeftSpace + 'px';
            } else moveRight()
        }, 20)
    }

    function moveRight(){
        if(isGoingLeft){
            clearInterval(leftTimerId);
            isGoingLeft = false;
        }
        isGoingRight = true;
        rightTimerId = setInterval(function(){
            if(doodlerLeftSpace <= 313){
            doodlerLeftSpace += 5;
            doodler.style.left = doodlerLeftSpace + 'px';
            } else moveLeft();
        }, 20)
        
    }

    function moveStraight(){
        isGoingLeft = false;
        isGoingRight = false;
        clearInterval(leftTimerId);
        clearInterval(rightTimerId);
    }

    function gameOver(){
        isGameOver = true;
        clearInterval(downTimerId);
        clearInterval(upTimerId);
        clearInterval(leftTimerId);
        clearInterval(rightTimerId);
        
        doodler.classList.remove('doodler');
        platforms.forEach(platform => {
            let removePlatform = platform.visual;
            removePlatform.classList.remove('platform');
        })
        grid.innerHTML = score;
        console.log('game over');
        resetGame();
    }

    function resetGame(){
        
        resetBtn.classList.add('resetBtn');
        resetBtn.innerHTML = 'RESET GAME';
        resetBtn.style.left = 140 + 'px';
        resetBtn.style.bottom = 150 + 'px';
        resetBtn.addEventListener('click', playAgain);
        grid.appendChild(resetBtn);
    }

    function playAgain(){
        //confirm('Are u sure');
        location.reload();
    }

    function start(){
        if(!isGameOver){
            createPlatforms();
            createDoodler();
            setInterval(movePlatforms, 30);
            jump();
            document.addEventListener('keyup', control)
        }
    }

    start();

})