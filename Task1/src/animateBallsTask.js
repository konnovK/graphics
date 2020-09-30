let cvs = document.querySelectorAll('canvas').item(0);
let ctx = cvs.getContext('2d');



// ДАННЫЕ О МИРЕ



const ballFrameRate = 10;

const SPRITE_X0 = 0;
const SPRITE_Y0 = 50;
const SPRITE_W = 50;
const SPRITE_H = 50;
const SPRITE_COUNT = 10;

let spriteIndex = 0;

let ballsImg = new Image();
ballsImg.src = 'src/img/balls1.png';

class BallImg {
    constructor(startPosX, startPosY, speedX, speedY) {
        this.SPEED = {
            vx: speedX,
            vy: speedY
        };

        this.startPos = {
            x: startPosX,
            y: startPosY
        }

        this.pos = {
            x: startPosX,
            y: startPosY
        };

        this.RADIUS = Math.max(SPRITE_W / 2, SPRITE_H / 2);

    }
}

let getRndInRange = (min, max) => Math.floor(Math.random() * (max - min)) + min;
let getRndSign = () => Math.floor(Math.random() * 2) === 0 ? -1 : 1;


let boxSize = {w: 800, h: 600};
let boxPos = {x: (cvs.width / 2) - (boxSize.w / 2), y: (cvs.height / 2) - (boxSize.h / 2)};


let listOfBallsImg = [];
for (let i = 0; i <= getRndInRange(5, 20); i++) {
    listOfBallsImg.push(new BallImg(
        getRndInRange(150, boxSize.w - 150),
        getRndInRange(100, boxSize.h - 100),
        getRndSign() * getRndInRange(100, 250),
        getRndSign() * getRndInRange(100, 250),
        )
    );
}



// ФУНКЦИИ, КОТОРЫЕ МОЖНО МЕНЯТЬ

let findPos = (timeFromAnimationStartInSeconds, ball, boxSize) => {
    let nowPosX = ball.startPos.x + ball.SPEED.vx * timeFromAnimationStartInSeconds;
    let nowPosY = ball.startPos.y + ball.SPEED.vy * timeFromAnimationStartInSeconds;

    let countOfInverseX = Math.floor(Math.abs(nowPosX) / boxSize.w);
    let countOfInverseY = Math.floor(Math.abs(nowPosY) / boxSize.h);

    if (countOfInverseX % 2 === 1) {
        nowPosX = boxSize.w - (Math.abs(nowPosX) % boxSize.w);
    }
    if (countOfInverseY % 2 === 1) {
        nowPosY = boxSize.h - (Math.abs(nowPosY) % boxSize.h);
    }

    return {x: Math.abs(nowPosX % boxSize.w), y: Math.abs(nowPosY % boxSize.h)};
}


// Рисуем контейнер, где будут кататься шарики
let drawBox = () => {
    ctx.strokeRect((cvs.width / 2) - (boxSize.w / 2), (cvs.height / 2) - (boxSize.h / 2), boxSize.w, boxSize.h);
}


// Рисуем сам шар
let drawBallImg = (pos) => {
    ctx.drawImage(
        ballsImg,
        SPRITE_X0 + spriteIndex * SPRITE_W, SPRITE_Y0, // положение выреза на исходном изображении
        SPRITE_W, SPRITE_H, // высота и ширина выреза
        boxPos.x + pos.x, boxPos.y + pos.y, // где рисовать на canvas
        SPRITE_W, SPRITE_H // размер рисуемого изображения
    );
}


// !!!
// функция, которая рисут на канвасе
function draw() {
    clearCanvas();

    drawBox();

    listOfBallsImg.forEach((ballImg) => {
        drawBallImg(ballImg.pos);
    });
}


// !!!
// функция, которая меняет состояние мира
function step(timeFromAnimationStart) {

    listOfBallsImg.forEach((ball) => {
        ball.pos = findPos(timeFromAnimationStart / 1000, ball, {w: boxSize.w - SPRITE_W, h: boxSize.h - SPRITE_H});
    });

    spriteIndex = Math.floor(timeFromAnimationStart / (1000 / ballFrameRate)) % SPRITE_COUNT;
}



// УНИВЕРСАЛЬНЫЕ ПОНЯТИЯ



const clearCanvas = () => {
    ctx.fillStyle = 'white';
    ctx.fillRect(0,0,cvs.width,cvs.height);
}


let currentTime = () => new Date().getTime();
let animationStart = currentTime();


// функция, делающая что-то раз в интервал (60 fps)
function tick() {
    let timeFromAnimationStart = currentTime() - animationStart;
    draw();
    step(timeFromAnimationStart);
    requestAnimationFrame(tick);
}
tick();