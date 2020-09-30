let cvs = document.querySelectorAll('canvas').item(0);
let ctx = cvs.getContext('2d');



// ДАННЫЕ О МИРЕ



const COLORS = ['IndianRed', 'Pink', 'Orange', 'Khaki', 'Plum', 'BurlyWood', 'Teal', 'DarkOliveGreen', 'LightGreen', 'RoyalBlue'];

class Ball {
    constructor(startPosX, startPosY, speedX, speedY, radius = 30) {
        this.SPEED = {
            vx: speedX,
            vy: speedY
        };

        this.pos = {
            x: startPosX,
            y: startPosY
        };

        this.RADIUS = radius;

        this.COLOR = COLORS[getRndInRange(0, COLORS.length) % COLORS.length]; // random color
    }
}


let getRndInRange = (min, max) => Math.floor(Math.random() * (max - min)) + min;
let getRndSign = () => Math.floor(Math.random() * 2) === 0 ? -1 : 1;


let boxSize = {w: 800, h: 600};
let boxPos = {x: (cvs.width / 2) - (boxSize.w / 2), y: (cvs.height / 2) - (boxSize.h / 2)};



let listOfBalls = [];
for (let i = 0; i <= getRndInRange(10, 15); i++) {
    listOfBalls.push(new Ball(
        getRndInRange(150, boxSize.w - 150),
        getRndInRange(100, boxSize.h - 100),
        getRndSign() * getRndInRange(60, 100),
        getRndSign() * getRndInRange(60, 100),
        getRndInRange(10, 50),
        )
    );
}



// ФУНКЦИИ, КОТОРЫЕ МОЖНО МЕНЯТЬ



// Рисуем контейнер, где будут кататься шарики
let drawBox = () => {
    ctx.strokeRect((cvs.width / 2) - (boxSize.w / 2), (cvs.height / 2) - (boxSize.h / 2), boxSize.w, boxSize.h);
}

// Изменяем направление шара при контакте со стенами
let changeDirection = (pos, radius, speed) => {
    let realPosOfBall = {x: boxPos.x + pos.x, y: boxPos.y + pos.y};
    speed.vy = (realPosOfBall.y + radius >= boxPos.y + boxSize.h) || (realPosOfBall.y - radius <= boxPos.y) ? -speed.vy : speed.vy;
    speed.vx = (realPosOfBall.x + radius >= boxPos.x + boxSize.w) || (realPosOfBall.x - radius <= boxPos.x) ? -speed.vx : speed.vx;
}

// Рисуем сам шар
let drawBall = (pos, radius, color) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(boxPos.x + pos.x, boxPos.y + pos.y, radius, 0, Math.PI * 2);
    ctx.fill();
}



// !!!
// функция, которая рисут на канвасе
function draw() {
    clearCanvas();

    drawBox();

    listOfBalls.forEach((ball) => {
        drawBall(ball.pos, ball.RADIUS, ball.COLOR);
        changeDirection(ball.pos, ball.RADIUS, ball.SPEED);
    });
}



// !!!
// функция, которая меняет состояние мира
function step(timeFromAnimationStart, timeFromLastFrame) {
    listOfBalls.forEach((ball) => {
        ball.pos.x += ball.SPEED.vx * (timeFromLastFrame / 1000);
        ball.pos.y += ball.SPEED.vy * (timeFromLastFrame / 1000);
    });
}



// УНИВЕРСАЛЬНЫЕ ПОНЯТИЯ



const clearCanvas = () => {
    ctx.fillStyle = 'white';
    ctx.fillRect(0,0,cvs.width,cvs.height);
}

let currentTime = () => new Date().getTime();
let animationStart = currentTime();
let lastFrameTime = currentTime();

// функция, делающая что-то раз в интервал (60 fps)
function tick() {
    let now = currentTime();
    let timeFromAnimationStart = currentTime() - animationStart;
    let timeFromLastFrame = now - lastFrameTime;
    lastFrameTime = now;
    draw();
    step(timeFromAnimationStart,timeFromLastFrame);
    requestAnimationFrame(tick);
}
tick();