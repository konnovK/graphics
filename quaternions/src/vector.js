import Quaternion from "./quaternion.js";

export default class Vector {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    add(v) {
        return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
    }

    static add(v, u) {
        return new Vector(u.x + v.x, u.y + v.y, u.z + v.z);
    }

    scalarMul(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    static scalarMul(v, u) {
        return u.x * v.x + u.y * v.y + u.z * v.z;
    }

    static mulByScalar(v, n) {
        return new Vector(v.x * n, v.y * n, v.z * n);
    }

    norm() {
        return Math.sqrt(Vector.scalarMul(this, this));
    }

    static norm(v) {
        return Math.sqrt(Vector.scalarMul(v, v));
    }

    normalize() {
        const length = this.norm();

        this.x /= length;
        this.y /= length;
        this.z /= length;

        return this;
    }

    toQuaternion() {
        return new Quaternion(0, this.x, this.y, this.z);
    }

    static toQuaternion(v) {
        return new Quaternion(0, v.x, v.y, v.z);
    }

    translate(vector) {
        return Vector.add(this, vector);
    }

    rotate(angle, axis) { // поворот на angle (по часовой) вокруг оси axis
        let analogQuaternion = this.toQuaternion();
        let rotateQuaternion = Quaternion.fromVector(Math.cos(angle / 2), Vector.mulByScalar(axis, Math.sin(angle / 2)));

        return (rotateQuaternion.mul(analogQuaternion)).mul(rotateQuaternion.conjugate()).toVector();
    }

    toString() {
        return `(${this.x},${this.y},${this.z})`;
    }
}