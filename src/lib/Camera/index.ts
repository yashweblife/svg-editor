import { basic_object } from "../../types";

export default class Camera {
    constructor(
        public x: number = window.innerWidth / 2, 
        public y: number = window.innerHeight / 2
    ) { }
    pan(x: number, y: number) {
        this.x += x;
        this.y += y;
    }
    applyTranslation(obj: basic_object) {
        obj.x += this.x;
        obj.y += this.y;
    }
    set zoom(val: number) {
        this.zoom = val > 100 ? 100 : val < 0 ? 0 : val
    }
    get zoom(): number {
        return this.zoom
    }
}