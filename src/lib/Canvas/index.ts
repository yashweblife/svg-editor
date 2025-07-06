import { vec2d } from "../../types";
import {
    canvas_background,
    grid_dots,
    helper_line_color
} from "./colors";
import {
    clearCanvas,
    drawGrid,
    drawHelperGuides,
    drawMouseTool,
    drawObjects,
    drawPhantomObject
} from "./handlers";
export default class Canvas {
    static arc(
        c: CanvasRenderingContext2D,
        x: number,
        y: number,
        r: number,
        startAngle: number,
        endAngle: number
    ) {
        c.beginPath();
        c.arc(x, y, r, startAngle, endAngle);
        c.stroke();
        c.closePath();
    }
    static rect(
        c: CanvasRenderingContext2D,
        x: number,
        y: number,
        w: number,
        h: number
    ) {
        c.beginPath();
        c.rect(x, y, w, h);
        c.stroke();
        c.closePath();
    }
    static path(c: CanvasRenderingContext2D, points: vec2d[]) {
        let prev = points[0];
        for (let i = 1; i < points.length; i++) {
            c.moveTo(prev.x, prev.y);
            c.lineTo(points[i].x, points[i].y);
            prev = points[i];
        }
    }
    static manyArc(
        c: CanvasRenderingContext2D,
        x: number,
        y: number,
        r: number
    ) {
        c.arc(x, y, r, 0, 2 * Math.PI);
    }
    static manyLine(
        c: CanvasRenderingContext2D,
        x1: number,
        y1: number,
        x2: number,
        y2: number
    ) {
        c.moveTo(x1, y1);
        c.lineTo(x2, y2);
    }
    static manyRect(
        c: CanvasRenderingContext2D,
        x: number,
        y: number,
        w: number,
        h: number
    ) {
        c.rect(x, y, w, h);
    }
    static stroke(c: CanvasRenderingContext2D) {
        c.stroke();
    }
    static fill(c: CanvasRenderingContext2D) {
        c.fill();
    }
    static clear(
        c: CanvasRenderingContext2D,
        x: number = 0,
        y: number = 0,
        w: number = window.innerWidth,
        h: number = window.innerHeight
    ) {
        c.clearRect(x, y, w, h);
    }
    static fillCanvas(
        c: CanvasRenderingContext2D,
        w: number = window.innerWidth,
        h: number = window.innerHeight
    ) {
        c.fillStyle = canvas_background;
        c.fillRect(0, 0, w, h);
    }
    static drawOrigin(
        c: CanvasRenderingContext2D,
        x: number = window.innerWidth / 2,
        y: number = window.innerHeight / 2
    ) {
        c.beginPath();
        c.moveTo(x, 0);
        c.lineTo(x, window.innerHeight);
        c.moveTo(0, y);
        c.lineTo(window.innerWidth, y);
        c.stroke();
        c.closePath();
    }
    static line(
        c: CanvasRenderingContext2D,
        x1: number,
        y1: number,
        x2: number,
        y2: number
    ) {
        c.beginPath();
        c.moveTo(x1, y1);
        c.lineTo(x2, y2);
        c.stroke();
        c.closePath();
    }
    static makeCanvas(parent = "#app") {
        const canvas = document.createElement("canvas") as HTMLCanvasElement;
        console.log(canvas)
        const c = canvas.getContext("2d") as CanvasRenderingContext2D;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        (document.querySelector(parent) as HTMLElement).appendChild(canvas);
        return { c, canvas }
    }
}
export {
    canvas_background,
    clearCanvas,
    drawGrid,
    drawHelperGuides,
    drawMouseTool,
    drawObjects,
    drawPhantomObject,
    grid_dots,
    helper_line_color
};

