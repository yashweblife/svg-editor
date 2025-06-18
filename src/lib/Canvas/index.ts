export default class Canvas {
    canvas: HTMLCanvasElement;
    c: CanvasRenderingContext2D;
    constructor() {
        this.canvas = document.createElement("canvas") as HTMLCanvasElement;
        this.c = this.canvas.getContext("2d") as CanvasRenderingContext2D;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        (document.querySelector("#app") as HTMLDivElement).appendChild(this.canvas);
    }
}