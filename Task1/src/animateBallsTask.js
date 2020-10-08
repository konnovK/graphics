let cvs = document.querySelectorAll('canvas').item(0);
let ctx = cvs.getContext('2d');

ctx.fillRect(0,0,cvs.width, cvs.height);


// ДАННЫЕ О МИРЕ

const BALL_FRAME_RATE = 10;
const BALL_SPRITE_X0 = 0;
const BALL_SPRITE_Y0 = 50;
const BALL_SPRITE_W = 50;
const BALL_SPRITE_H = 50;
const BALL_SPRITE_COUNT = 10;
const BALL_IMG = new Image();
BALL_IMG.src = 'img/balls1.png';
let ballSpriteIndex = 0;

const BANG_FRAME_RATE = 10;
const BANG_SPRITE_X0 = 0;
const BANG_SPRITE_Y0 = 0;
const BANG_SPRITE_W = 140;
const BANG_SPRITE_H = 140;
const BANG_SPRITE_COUNT = 7;
const BANG_IMG = new Image();
BANG_IMG.src = 'img/bang.png';


let idCounter = 0;

class Bang {
    constructor(BangStartTime, pos) {
        this.BangStartTime = BangStartTime;
        this.pos = pos;

        this.drawable = true;
    }

    findBangSpriteIndex() {
        let timeFromBangStart = currentTime() - this.BangStartTime;
        let index = Math.floor(timeFromBangStart / (1000 / BANG_FRAME_RATE));
        this.drawable = index <= BANG_SPRITE_COUNT;
        return index;
    }

    draw() {
        if (this.drawable)
            ctx.drawImage(
                BANG_IMG,
                BANG_SPRITE_X0 + this.findBangSpriteIndex() * BANG_SPRITE_W, BANG_SPRITE_Y0, // положение выреза на исходном изображении
                BANG_SPRITE_W, BANG_SPRITE_H, // высота и ширина выреза
                boxPos.x + this.pos.x, boxPos.y + this.pos.y, // где рисовать на canvas
                BANG_SPRITE_W, BANG_SPRITE_H // размер рисуемого изображения
            );
    }
}

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

        this.RADIUS = Math.max(BALL_SPRITE_W / 2, BALL_SPRITE_H / 2);

        this.id = idCounter;
        idCounter++;
    }

    draw() {
        ctx.drawImage(
            BALL_IMG,
            BALL_SPRITE_X0 + ballSpriteIndex * BALL_SPRITE_W, BALL_SPRITE_Y0, // положение выреза на исходном изображении
            BALL_SPRITE_W, BALL_SPRITE_H, // высота и ширина выреза
            boxPos.x + this.pos.x, boxPos.y + this.pos.y, // где рисовать на canvas
            BALL_SPRITE_W, BALL_SPRITE_H // размер рисуемого изображения
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

    isCursorInside = (CursorPosition)  => {
        let radius = 1.5 * this.RADIUS;
        return (CursorPosition.x >= this.pos.x - radius)
        && (CursorPosition.x <= this.pos.x + radius)
        && (CursorPosition.y >= this.pos.y - radius)
        && (CursorPosition.y <= this.pos.y + radius);
    }

    boom() {
        listOfBangs.push(
            new Bang(currentTime(), {
                x: this.pos.x + this.RADIUS - (BANG_SPRITE_W / 2),
                y: this.pos.y + this.RADIUS - (BANG_SPRITE_H / 2)
            })
        );
        return this.id;
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


let listOfBangs = [];


// ФУНКЦИИ, КОТОРЫЕ МОЖНО МЕНЯТЬ

function getCursorPosition(e) {
    const rect = cvs.getBoundingClientRect();
    const x = e.clientX - rect.left - boxPos.x;
    const y = e.clientY - rect.top - boxPos.y;
    return {x, y};
}

cvs.addEventListener('mousedown', (e) => {
    let idOfBoom = [];
    let cursorPosition = getCursorPosition(e);

    listOfBalls.forEach((ball) => {
        if (ball.isCursorInside(cursorPosition))
            idOfBoom.push(ball.boom());
    });

    idOfBoom.forEach(_id => {
        listOfBalls = listOfBalls.filter(ball => ball.id !== _id);
    });
})

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

    listOfBangs = listOfBangs.filter(bang => bang.drawable);
    listOfBangs.forEach((bang) => {
        bang.draw();
    });
}


// !!!
// функция, которая меняет состояние мира
function step(timeFromAnimationStart) {
    listOfBalls.forEach((ball) => {
        ball.changePosition(timeFromAnimationStart / 1000, {w: boxSize.w - BALL_SPRITE_W, h: boxSize.h - BALL_SPRITE_H});
    });

    ballSpriteIndex = Math.floor(timeFromAnimationStart / (1000 / BALL_FRAME_RATE)) % BALL_SPRITE_COUNT;
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