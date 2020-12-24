// let nav = document.querySelector("#navbar");
// document.body.removeChild(document.querySelector("#navbar"));

// !!! параметры мира
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(76, window.innerWidth / window.innerHeight, 0.1, 10000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);


// !!! параметры фигуры
let now_pos = {x: Math.round(Math.random() * 10) - 5, y: 0, z: 2};
let now_color = 0xbbbbbb;
const colors = [0xbbbbbb, 0x880000, 0x008800, 0x000088];
let now_angle = {x: Math.PI / 2, y: 0, z: 0};
let vect = {sign: "-", coord: "x"};
let pos_stack = [];
const step = 0.2;
const size = 0.16;
let sphere_flag = false;

// !!! параметры камеры
// camera.position.set(0, 2, 9);
camera.position.set(9, 1.6, 8);
camera.rotation.y = Math.PI / 6;



// !!! схема системы координат
const drawCoords = () => {
    // Ox
    let line_geom1 = new THREE.Geometry();
    line_geom1.vertices.push(new THREE.Vector3(1, 0, 0));
    line_geom1.vertices.push(new THREE.Vector3(0, 0, 0));
    let line1 = new THREE.Line(line_geom1, new THREE.LineBasicMaterial({color: 0x00ff00}));
    scene.add(line1);

    // Oy
    let line_geom2 = new THREE.Geometry();
    line_geom2.vertices.push(new THREE.Vector3(0, 1, 0));
    line_geom2.vertices.push(new THREE.Vector3(0, 0, 0));
    let line2 = new THREE.Line(line_geom2, new THREE.LineBasicMaterial({color: 0xff0000}));
    scene.add(line2);

    // Oz
    let line_geom3 = new THREE.Geometry();
    line_geom3.vertices.push(new THREE.Vector3(0, 0, 1));
    line_geom3.vertices.push(new THREE.Vector3(0, 0, 0));
    let line3 = new THREE.Line(line_geom3, new THREE.LineBasicMaterial({color: 0x0000ff}));
    scene.add(line3);

    renderer.render(scene, camera);
}
drawCoords();



// !!! виртуальные границы
const drawMap = () => {
    {
        let line_geom1 = new THREE.Geometry();
        line_geom1.vertices.push(new THREE.Vector3(5, -5, 5));
        line_geom1.vertices.push(new THREE.Vector3(25, -5, -15));
        let line1 = new THREE.Line(line_geom1, new THREE.LineBasicMaterial({color: 0xffff00}));
        scene.add(line1);

        let line_geom2 = new THREE.Geometry();
        line_geom2.vertices.push(new THREE.Vector3(-5, -5, 5));
        line_geom2.vertices.push(new THREE.Vector3(-25, -5, -15));
        let line2 = new THREE.Line(line_geom2, new THREE.LineBasicMaterial({color: 0xffff00}));
        scene.add(line2);

        let line_geom3 = new THREE.Geometry();
        line_geom3.vertices.push(new THREE.Vector3(5, -5, 5));
        line_geom3.vertices.push(new THREE.Vector3(-5, -5, 5));
        let line3 = new THREE.Line(line_geom3, new THREE.LineBasicMaterial({color: 0xffff00}));
        scene.add(line3);

        let line_geom4 = new THREE.Geometry();
        line_geom4.vertices.push(new THREE.Vector3(25, -5, -15));
        line_geom4.vertices.push(new THREE.Vector3(-25, -5, -15));
        let line4 = new THREE.Line(line_geom4, new THREE.LineBasicMaterial({color: 0xffff00}));
        scene.add(line4);
    }
    {
        let line_geom1 = new THREE.Geometry();
        line_geom1.vertices.push(new THREE.Vector3(5, 5, 5));
        line_geom1.vertices.push(new THREE.Vector3(25, 5, -15));
        let line1 = new THREE.Line(line_geom1, new THREE.LineBasicMaterial({color: 0xffff00}));
        scene.add(line1);

        let line_geom2 = new THREE.Geometry();
        line_geom2.vertices.push(new THREE.Vector3(-5, 5, 5));
        line_geom2.vertices.push(new THREE.Vector3(-25, 5, -15));
        let line2 = new THREE.Line(line_geom2, new THREE.LineBasicMaterial({color: 0xffff00}));
        scene.add(line2);

        let line_geom3 = new THREE.Geometry();
        line_geom3.vertices.push(new THREE.Vector3(5, 5, 5));
        line_geom3.vertices.push(new THREE.Vector3(-5, 5, 5));
        let line3 = new THREE.Line(line_geom3, new THREE.LineBasicMaterial({color: 0xffff00}));
        scene.add(line3);

        let line_geom4 = new THREE.Geometry();
        line_geom4.vertices.push(new THREE.Vector3(25, 5, -15));
        line_geom4.vertices.push(new THREE.Vector3(-25, 5, -15));
        let line4 = new THREE.Line(line_geom4, new THREE.LineBasicMaterial({color: 0xffff00}));
        scene.add(line4);
    }
    {
        let line_geom5 = new THREE.Geometry();
        line_geom5.vertices.push(new THREE.Vector3(5, -5, 5));
        line_geom5.vertices.push(new THREE.Vector3(5, 5, 5));
        let line5 = new THREE.Line(line_geom5, new THREE.LineBasicMaterial({color: 0xffff00}));
        scene.add(line5);
    }
    {
        let line_geom5 = new THREE.Geometry();
        line_geom5.vertices.push(new THREE.Vector3(-5, -5, 5));
        line_geom5.vertices.push(new THREE.Vector3(-5, 5, 5));
        let line5 = new THREE.Line(line_geom5, new THREE.LineBasicMaterial({color: 0xffff00}));
        scene.add(line5);
    }
    {
        let line_geom5 = new THREE.Geometry();
        line_geom5.vertices.push(new THREE.Vector3(25, -5, -15));
        line_geom5.vertices.push(new THREE.Vector3(25, 5, -15));
        let line5 = new THREE.Line(line_geom5, new THREE.LineBasicMaterial({color: 0xffff00}));
        scene.add(line5);
    }
    {
        let line_geom5 = new THREE.Geometry();
        line_geom5.vertices.push(new THREE.Vector3(-25, -5, -15));
        line_geom5.vertices.push(new THREE.Vector3(-25, 5, -15));
        let line5 = new THREE.Line(line_geom5, new THREE.LineBasicMaterial({color: 0xffff00}));
        scene.add(line5);
    }

    renderer.render(scene, camera);
}
// drawMap();


// LIGHT Hi
{
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
}

// LIGHT Lo
{
    const color = 0xFFFFFF;
    const intensity = 0.25;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(1, -2, -4);
    scene.add(light);
}


// !!! для построения удлинения цилиндрика
let i = 0;
let j = 0;
const updateNowPos = () => {

    // пересечение границ
    {
        if (now_pos.z >= 5) {
            // drawVerySmallSphere();
            now_pos.z = -15;
            changeColor();
            // drawSmallSphere();
            i = 0;
        } else if (now_pos.z <= -15) {
            // drawVerySmallSphere();
            now_pos.z = 5;
            changeColor();
            // drawSmallSphere();
            i = 0;
        }
        if (now_pos.x >= 10 - now_pos.z) {
            // drawVerySmallSphere();
            // now_pos.x = -10 + now_pos.z;
            now_pos.x = 0;
            changeColor();
            // drawSmallSphere();
            i = 0;
        } else if (now_pos.x <= -10 + now_pos.z) {
            // drawVerySmallSphere();
            // now_pos.x = 10 - now_pos.z;
            now_pos.x = 0;
            changeColor();
            // drawSmallSphere();
            i = 0;
        }
        if (now_pos.y >= 5) {
            // drawVerySmallSphere();
            now_pos.y = -5;
            changeColor();
            // drawSmallSphere();
            i = 0;
        } else if (now_pos.y <= -5) {
            // drawVerySmallSphere();
            now_pos.y = 5;
            changeColor();
            // drawSmallSphere();
            i = 0;
        }
    }

    // calcAngle
    {
        if (vect.coord === 'x') {
            now_angle.x = 0;
            now_angle.y = 0;
            now_angle.z = Math.PI / 2;
        }
        if (vect.coord === 'y') {
            now_angle.x = 0;
            now_angle.y = Math.PI / 2;
            now_angle.z = 0;
        }
        if (vect.coord === 'z') {
            now_angle.x = Math.PI / 2;
            now_angle.y = 0;
            now_angle.z = 0;
        }
    }


    i += step;
    if (i >= 1) {

        // подбрасываем кубик для изменения направления
        // changeDirection();

        lookAhead();

        savePos();

        i = 0;
        j++;
        // console.log(j);
    } else {
        // само движение
        if (vect.sign === "-") {
            now_pos[vect.coord] -= step;
        } else {
            now_pos[vect.coord] += step;
        }
    }


    // очистить экран
    if (j >= 500) {
        j = 0;
        location.reload();
    }
}



const savePos = () => {
    let pos = "" + Math.round(now_pos.x) + ";" + Math.round(now_pos.y) + ";" + Math.round(now_pos.z);
    pos_stack.push(pos);
}



const checkPos = (pos) => {
    let checkedPos = "" + Math.round(pos.x) + ";" + Math.round(pos.y) + ";" + Math.round(pos.z);
    return pos_stack.includes(checkedPos);
}



const changeDirection = () => {

    let old_vect = Object.assign({}, vect);

    let new_vect_coord = vect.coord;
    switch (Math.round(Math.random() * 5) + 1) {
        case 1: {
            new_vect_coord = 'x';
            break;
        }
        case 2: {
            new_vect_coord = 'y';
            break;
        }
        case 3: {
            new_vect_coord = 'z';
            break;
        }
        default:
            break;
    }

    let new_vect_sign = vect.sign;
    switch (Math.round(Math.random() * 3) + 1) {
        case 1: {
            new_vect_sign = '-';
            break;
        }
        case 2: {
            new_vect_sign = '+';
            break;
        }
        default:
            break;
    }

    if (new_vect_coord === old_vect.coord) {
        vect = old_vect;
    } else {
        vect = {sign: new_vect_sign, coord: new_vect_coord};
        sphere_flag = true;
        // drawVerySmallSphere();
    }
}



const lookAhead = () => {
    let counter = 0;
    while (true) {
        changeDirection();
        let pos = {x: Math.round(now_pos.x), y: Math.round(now_pos.y), z: Math.round(now_pos.z)};

        let look_ahead_pos = Object.assign({}, pos);
        if (vect.sign === "-") {
            look_ahead_pos[vect.coord] -= 1;
        } else {
            look_ahead_pos[vect.coord] += 1;
        }

        if (!checkPos(look_ahead_pos)) {
            if (sphere_flag) drawVerySmallSphere();
            sphere_flag = false;
            break;
        }
        counter++;
        if (counter >= 10) {
            //перемещаем на рандомную позицию, ну или забиваем болт, как сделано сейчас
            break;
        }
    }
}


const drawSmallSphere = () => {
    let geometry = new THREE.SphereGeometry(size + 0.04,20,20);
    let material = new THREE.MeshPhongMaterial({color: now_color});
    let sphere = new THREE.Mesh( geometry, material );
    sphere.position.x = now_pos.x;
    sphere.position.y = now_pos.y;
    sphere.position.z = now_pos.z;
    scene.add( sphere );
}
// drawSmallSphere();



const drawVerySmallSphere = () => {
    let geometry = new THREE.SphereGeometry(size + 0.03,20,20);
    let material = new THREE.MeshPhongMaterial({color: now_color});
    let sphere = new THREE.Mesh( geometry, material );
    sphere.position.x = now_pos.x;
    sphere.position.y = now_pos.y;
    sphere.position.z = now_pos.z;
    scene.add( sphere );
}
// drawVerySmallSphere();



const changeColor = () => {
    now_color = colors[Math.round(Math.random() * 4)];
}



const animate = () => {
    requestAnimationFrame(animate);

    updateNowPos();
    // console.log(now_pos);

    {
        let geometry = new THREE.CylinderBufferGeometry(size, size, step, 18);
        const material = new THREE.MeshPhongMaterial({color: now_color});
        let mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = now_pos.x;
        mesh.position.y = now_pos.y;
        mesh.position.z = now_pos.z;
        mesh.rotation.x = now_angle.x;
        mesh.rotation.y = now_angle.y;
        mesh.rotation.z = now_angle.z;
        scene.add(mesh);
    }

    renderer.render(scene, camera);

};
animate();

document.body.appendChild( renderer.domElement );

// document.body.appendChild(nav);
