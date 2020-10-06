let cvs = document.querySelectorAll('canvas').item(0);
let ctx = cvs.getContext('2d');

ctx.fillRect(0,0,cvs.width, cvs.height);


// ДАННЫЕ О МИРЕ

const BALL_FRAME_RATE = 10;
const SPRITE_X0 = 0;
const SPRITE_Y0 = 50;
const SPRITE_W = 50;
const SPRITE_H = 50;
const SPRITE_COUNT = 10;
const BALLS_IMG = new Image();
BALLS_IMG.src = 'img/balls1.png';


let spriteIndex = 0;

class Ball {
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

    draw() {
        ctx.drawImage(
            BALLS_IMG,
            SPRITE_X0 + spriteIndex * SPRITE_W, SPRITE_Y0, // положение выреза на исходном изображении
            SPRITE_W, SPRITE_H, // высота и ширина выреза
            boxPos.x + this.pos.x, boxPos.y + this.pos.y, // где рисовать на canvas
            SPRITE_W, SPRITE_H // размер рисуемого изображения
        );
    }

    changePosition(timeFromAnimationStartInSeconds, boxSpriteSize) {
        let nowPosX = this.startPos.x + this.SPEED.vx * timeFromAnimationStartInSeconds;
        let nowPosY = this.startPos.y + this.SPEED.vy * timeFromAnimationStartInSeconds;

        let countOfInverseX = Math.floor(Math.abs(nowPosX) / boxSpriteSize.w);
        let countOfInverseY = Math.floor(Math.abs(nowPosY) / boxSpriteSize.h);

        if (countOfInverseX % 2 === 1) {
            nowPosX = boxSpriteSize.w - (Math.abs(nowPosX) % boxSpriteSize.w);
        }
        if (countOfInverseY % 2 === 1) {
            nowPosY = boxSpriteSize.h - (Math.abs(nowPosY) % boxSpriteSize.h);
        }

        this.pos = {x: Math.abs(nowPosX % boxSpriteSize.w), y: Math.abs(nowPosY % boxSpriteSize.h)};
    }
}

let getRndInRange = (min, max) => Math.floor(Math.random() * (max - min)) + min;
let getRndSign = () => Math.floor(Math.random() * 2) === 0 ? -1 : 1;


let boxSize = {w: 800, h: 600};
let boxPos = {x: (cvs.width / 2) - (boxSize.w / 2), y: (cvs.height / 2) - (boxSize.h / 2)};


// Создаем массив шариков
let listOfBalls = [];
for (let i = 0; i <= getRndInRange(10, 20); i++) {
    listOfBalls.push(
        new Ball(
            getRndInRange(150, boxSize.w - 150),
            getRndInRange(100, boxSize.h - 100),
            getRndSign() * getRndInRange(100, 250),
            getRndSign() * getRndInRange(100, 250)
        )
    );
}



// ФУНКЦИИ, КОТОРЫЕ МОЖНО МЕНЯТЬ


// Рисуем контейнер, где будут кататься шарики
let drawBox = () => {
    ctx.strokeRect((cvs.width / 2) - (boxSize.w / 2), (cvs.height / 2) - (boxSize.h / 2), boxSize.w, boxSize.h);
}


// !!!
// функция, которая рисут на канвасе
function draw() {
    clearCanvas();

    drawBox();

    listOfBalls.forEach((ball) => {
        ball.draw();
    });
}


// !!!
// функция, которая меняет состояние мира
function step(timeFromAnimationStart) {
    listOfBalls.forEach((ball) => {
        ball.changePosition(timeFromAnimationStart / 1000, {w: boxSize.w - SPRITE_W, h: boxSize.h - SPRITE_H});
    });

    spriteIndex = Math.floor(timeFromAnimationStart / (1000 / BALL_FRAME_RATE)) % SPRITE_COUNT;
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