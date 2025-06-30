export default class Camera {
    public zoom = 0;
    constructor(public x: number, public y: number) { }
    pan(x: number, y: number) {
        this.x += x;
        this.y += y;
    }
}