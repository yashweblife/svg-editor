export default class Canvas {
    canvas: HTMLCanvasElement;
    c: CanvasRenderingContext2D;
    constructor() {
        this.canvas = document.createElement("canvas") as HTMLCanvasElement;
        this.c = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    }
}