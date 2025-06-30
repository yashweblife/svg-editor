import { basic_object } from "../../types";

export default class Camera {
    public zoom = 0;
    constructor(public x: number, public y: number) { }
    pan(x: number, y: number) {
        this.x += x;
        this.y += y;
    }
    applyTranslation(obj:basic_object){
        obj.x += this.x;
        obj.y += this.y;
    }
}