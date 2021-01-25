import Vector from "./vector.js";

export default class Quaternion {
    constructor(a, b, c, d) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
    }

    add(q) {
        return new Quaternion(this.a + q.a, this.b + q.b, this.c + q.c, this.d + q.d);
    }

    static add(q, p) {
        return new Quaternion(q.a + p.a, q.b + p.b, q.c + p.c, q.d + p.d);
    }

    mul(q) {
        let a = this.a;
        let b = this.b;
        let c = this.c;
        let d = this.d;
        let e = q.a;
        let f = q.b;
        let g = q.c;
        let h = q.d;

        let __a = a*e - b*f - c*g - d*h;
        let __b = a*f + b*e + c*h - d*g;
        let __c = a*g - b*h + c*e + d*f;
        let __d = a*h + b*g - c*f + d*e;

        return new Quaternion(__a, __b, __c, __d);
    }

    static mul(q, p) {
        let a = q.a;
        let b = q.b;
        let c = q.c;
        let d = q.d;
        let e = p.a;
        let f = p.b;
        let g = p.c;
        let h = p.d;

        let __a = a*e - b*f - c*g - d*h;
        let __b = a*f + b*e + c*h - d*g;
        let __c = a*g - b*h + c*e + d*f;
        let __d = a*h + b*g - c*f + d*e;

        return new Quaternion(__a, __b, __c, __d);
    }

    conjugate() {
        return new Quaternion(this.a, -this.b, -this.c, -this.d);
    }

    static fromVector(scalar, vector) {
        return new Quaternion(scalar, vector.x, vector.y, vector.z);
    }

    toVector() {
        if (this.a <= 10E-15) {
            return new Vector(this.b, this.c, this.d);
        } else {
            throw new Error();
            // return null;
        }
    }

    translate(vector) {
        return Quaternion.add(this, Quaternion.fromVector(0, vector));
    }

    rotate(angle, axis) {
        let rotateQuaternion = Quaternion.fromVector(Math.cos(angle / 2), Vector.mulByScalar(axis, Math.sin(angle / 2)));
        return (rotateQuaternion.mul(this)).mul(rotateQuaternion.conjugate());
    }

    scale(vector) {
        return new Quaternion(this.a, this.b * vector.x, this.c * vector.y, this.d * vector.z);
    }
}