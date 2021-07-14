let cvs = document.querySelectorAll('canvas').item(0);
let ctx = cvs.getContext('2d');

let depth = 5; // степень многочлена
let speed = 0.01; // скорость обучения
let epochs = 2500; // число эпох обучения
let logger_window = 100;

let approximation = 1000;

let points = []; // [{x, y}] x и y как на экране, но деленые на 100

async function learn() {
    document.querySelector('#log').innerHTML = "";

    let num_of_points = points.length;
    let x_v = [];
    let y_v = [];

    let _i = 0;
    for (let point of points) {
        x_v[_i] = point.x;
        y_v[_i] = point.y;
        _i++;
    }

    let alpha_v = [];
    for (let i = 0; i < depth; i++) {
        alpha_v[i] = Math.random();
    }

    let poly = (x) => {
        let res = 0;
        for (let i = 0; i < depth; i++) {
            res += alpha_v[i] * Math.pow(x, i);
        }
        return res;
    }

    let loss = () => {
        let res = 0;
        for (let i = 0; i < num_of_points; i++) {
            res += (poly(x_v[i]) - y_v[i]) * (poly(x_v[i]) - y_v[i]);
        }
        return res;
    }

    // let grad = () => {
    //     let grad_ = [];
    //     for (let i = 0; i < depth; i++) {
    //         grad_[i] = 0;
    //         for (let j = 0; j < num_of_points; j++) {
    //             grad_[i] += 2 * (poly(x_v[j]) - y_v[j]) * Math.pow(x_v[j], i);
    //         }
    //     }
    //     return grad_;
    // }

    for (let epoch = 1; epoch <= epochs; epoch++) {

        for (let i = 0; i < depth; i++) {
            let grad_i = 0;
            for (let j = 0; j < num_of_points; j++) {
                grad_i += 2 * (poly(x_v[j]) - y_v[j]) * Math.pow(x_v[j], i);
            }
            alpha_v[i] = alpha_v[i] - speed * grad_i;
        }
        setTimeout(() => {

        }, 0);
        await learn_log(epoch, alpha_v, loss());
    }

    let draw = () => {
        ctx.save();
        ctx.translate(50, cvs.height - 50);

        ctx.strokeStyle = "green";
        ctx.beginPath();

        function min_x() {
            let min = points[0].x;
            for (let i = 0; i < points.length; i++) {
                if (points[i].x < min) {
                    min = points[i].x;
                }
            }
            return min;
        }

        function max_x() {
            let max = points[0].x;
            for (let i = 0; i < points.length; i++) {
                if (points[i].x > max) {
                    max = points[i].x;
                }
            }
            return max;
        }

        for (let _x = min_x() - 0.01 ; _x <= max_x() + 0.01; _x += 0.01) {
            let _y = poly(_x);

            if (_x === 0) {
                ctx.moveTo(_x * approximation, -_y * approximation);
            } else {
                ctx.lineTo(_x * approximation, -_y * approximation);
            }
        }
        ctx.stroke();

        ctx.restore();
    }

    draw();
    document.querySelector('#loss').innerHTML = `Сумма квадратов ошибок равна ${loss().toFixed(4)}`;
}

async function learn_log(epoch, alpha_v, loss) {
    console.log(`${epoch}/${epochs}`);

    if (epoch % logger_window === 0 || epoch === 1) {
        document.querySelector('#log').innerHTML += `epoch ${epoch}, loss: ${loss} <br>`;
    }
}



cvs.addEventListener('mousedown', async (e) => {

    function getCursorPosition(e) {
        const rect = cvs.getBoundingClientRect();
        const x = e.clientX - rect.left - 50;
        const y = cvs.height - (e.clientY - rect.top) - 50;
        return {x, y};
    }

    let cursorPosition = getCursorPosition(e);

    points.push(
        {x : cursorPosition.x / approximation, y: cursorPosition.y / approximation}
    );

    clear_canvas();
    draw_coords();
    draw_points();
    if (points.length >= 1) {
        setTimeout(() => {
            learn();
        }, 0)
    }

    console.log(points);
});

document.addEventListener('keydown', async function(event) {
    if (event.code === 'KeyZ') {
        clear_canvas();
        draw_coords();
        draw_points();
        await learn();
    }
});

function draw_points() {
    for (let i = 0; i < points.length; i++) {
        draw_point(points[i]);
    }
}

function draw_point(point) {
    ctx.save();
    ctx.translate(50, cvs.height - 50);

    let x = point.x * approximation;
    let y = -(point.y * approximation);

    ctx.strokeStyle = "blue";
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 5, y);
    ctx.moveTo(x, y);
    ctx.lineTo(x + 5, y);
    ctx.moveTo(x, y);
    ctx.lineTo(x, y - 5);
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + 5);
    ctx.stroke();

    ctx.restore();
}

function draw_coords() {
    ctx.save();
    ctx.translate(50, cvs.height - 50);

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(cvs.width - 100, 0);
    ctx.lineTo(cvs.width - 120, 5);
    ctx.moveTo(cvs.width - 120, -5);
    ctx.lineTo(cvs.width - 100, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, - (cvs.height - 100));
    ctx.lineTo(-5, - (cvs.height - 120));
    ctx.moveTo(5, - (cvs.height - 120));
    ctx.lineTo(0, - (cvs.height - 100));
    ctx.stroke();

    ctx.restore();
}
draw_coords();

function clear_canvas() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0,0,cvs.width,cvs.height);
}

document.querySelector('#depth').addEventListener('input', () => {
    depth = document.querySelector('#depth').value;
});
document.querySelector('#speed').addEventListener('input', () => {
    speed = document.querySelector('#speed').value;
});
document.querySelector('#epochs').addEventListener('input', () => {
    epochs = document.querySelector('#epochs').value;
});
document.querySelector('#depth').addEventListener('input', () => {
    approximation = document.querySelector('#approximation').value;
});
document.querySelector('#logger_window').addEventListener('input', () => {
    logger_window = document.querySelector('#logger_window').value;
});