import Vector from './vector.js';
import Drawer from "./drawer.js";

const ctx = document.getElementById('surface').getContext('2d');

const imageData = ctx.createImageData(800, 600); // [red_0, green_0, blue_0, alpha_0, т.д.]

const drawer = new Drawer(imageData.data, imageData.width, imageData.height);

class Cube {
    static vertices = [
        new Vector(-1, 1, 1), // 0 вершина
        new Vector(-1, 1, -1), // 1 вершина
        new Vector(1, 1, -1), // 2 вершина
        new Vector(1, 1, 1), // 3 вершина
        new Vector(-1, -1, 1), // 4 вершина
        new Vector(-1, -1, -1), // 5 вершина
        new Vector(1, -1, -1), // 6 вершина
        new Vector(1, -1, 1), // 7 вершина
        new Vector(0, 0, -1)
    ];

    static edges = [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0],

        [0, 4],
        [1, 5],
        [2, 6],
        [3, 7],

        [4, 5],
        [5, 6],
        [6, 7],
        [7, 4],

        [1,8],
        [2,8],
        [5,8],
        [6,8],
    ];
}

let drawCoords = () => {
    const center = new Vector(400, -300, 0)
    drawer.drawLine(
        center.x, center.y,
        center.x, center.y + 120,
        100, 100, 100
    );

    drawer.drawLine(
        center.x, center.y,
        center.x + 120, center.y,
        100, 100, 100
    );
}

let _i = 0;
let _iSpeed = 0;
let _j = 0;
let _jSpeed = 0;
let _k = 0;
let _kSpeed = 0;

setInterval(() => {
    drawer.clearSurface();

    drawCoords();

    const sceneVertices = [];
    for (let i = 0; i < Cube.vertices.length; i++) {
        let vertex = Cube.vertices[i]
            .toQuaternion()
            .rotate(_i * Math.PI / 6, new Vector(1,0,0))
            .rotate(_j * Math.PI / 6, new Vector(0,1,0))
            .rotate(_k * Math.PI / 6, new Vector(0,0,1))
            .scale(new Vector(100,100,100))
            .translate(new Vector(400,-300,0))
            .toVector();
        sceneVertices.push(vertex);
    }

    for (let i = 0; i < Cube.edges.length; i++) {
        const e = Cube.edges[i];

        drawer.drawLine(
            sceneVertices[e[0]].x,
            sceneVertices[e[0]].y,
            sceneVertices[e[1]].x,
            sceneVertices[e[1]].y,
            0, 0, 255
        );
    }

    ctx.putImageData(imageData, 0, 0);
    _i += _iSpeed;
    _j += _jSpeed;
    _k += _kSpeed;
}, 1000 / 24);



document.forms[0].elements.iSpeed.addEventListener('input', () => {
    let input = document.forms[0].elements.iSpeed;
    _iSpeed = input.value / 20;
});
document.forms[0].elements.jSpeed.addEventListener('input', () => {
    let input = document.forms[0].elements.jSpeed;
    _jSpeed = input.value / 20;
});
document.forms[0].elements.kSpeed.addEventListener('input', () => {
    let input = document.forms[0].elements.kSpeed;
    _kSpeed = input.value / 20;
});
