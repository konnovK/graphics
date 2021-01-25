export default class Drawer {
    surface = null
    width = 0
    height = 0

    constructor(surface, width, height) {
        this.surface = surface;
        this.width = width;
        this.height = height;
    }

    drawPixel(x, y, r, g, b, a=255)  {
        const offset = (this.width * -y + x) * 4;

        if (x >= 0 && x < this.width && -y >= 0 && y < this.height) {
            this.surface[offset] = r;
            this.surface[offset + 1] = g;
            this.surface[offset + 2] = b;
            this.surface[offset + 3] = a;
        }
    }

    drawLine(x1, y1, x2, y2, r, g, b, a=255) {
        const c1 = y2 - y1;
        const c2 = x2 - x1;

        const length = Math.sqrt(c1 * c1 + c2 * c2);

        const xStep = c2 / length;
        const yStep = c1 / length;

        for (let i = 0; i < length; i++) {
            this.drawPixel(Math.trunc(x1 + xStep * i), Math.trunc(y1 + yStep * i), r, g, b, a);
        }
    }

    clearSurface() {
        const surfaceSize = this.width * this.height * 4;
        for (let i = 0; i < surfaceSize; i++) {
            this.surface[i] = 0;
        }
    }
}
