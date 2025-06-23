import { vec2d } from "../../types";

export default class Vec {
    static add(a: vec2d, b: vec2d) {
        return {
            x: a.x + b.x,
            y: a.y + b.y
        }
    }
    static magnitude(a: vec2d) {
        return Math.sqrt(a.x * a.x + a.y * a.y);
    }
    static normalize(a: vec2d) {
        return {
            x: a.x / Vec.magnitude(a),
            y: a.y / Vec.magnitude(a)
        }
    }
    static distance(a: vec2d, b: vec2d) {
        return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
    }
    static dot(a: vec2d, b: vec2d) {
        return a.x * b.x + a.y * b.y;
    }
    static cross(a: vec2d, b: vec2d) {
        return a.x * b.y - a.y * b.x;
    }
    static scale(a: vec2d, b: number) {
        const c = Vec.normalize(a);
        return {
            x: b * c.x,
            y: b * c.y
        }
    }
    static sub(a: vec2d, b: vec2d) {
        return {
            x: a.x - b.x,
            y: a.y - b.y
        }
    }
    static mid(a: vec2d, b: vec2d) {
        return {
            x: (a.x + b.x) / 2,
            y: (a.y + b.y) / 2
        }
    }
    static lerp(a: vec2d, b: vec2d, t: number) {
        return {
            x: a.x + (b.x - a.x) * t,
            y: a.y + (b.y - a.y) * t
        }
    }
    static angle(a: vec2d, b: vec2d) {
        return Math.atan2(b.y - a.y, b.x - a.x);
    }
    static rotate(a: vec2d, angle: number) {
        return {
            x: a.x * Math.cos(angle) - a.y * Math.sin(angle),
            y: a.x * Math.sin(angle) + a.y * Math.cos(angle)
        }
    }
}

export class Line {
    static segmentIntersects(a: vec2d, b: vec2d, c: vec2d, d: vec2d) {
        const denominator = (b.y - a.y) * (d.x - c.x) - (b.x - a.x) * (d.y - c.y);
        const numerator1 = (a.y - c.y) * (d.x - c.x) - (a.x - c.x) * (d.y - c.y);
        const numerator2 = (a.y - c.y) * (b.x - a.x) - (a.x - c.x) * (b.y - a.y);
        return numerator1 / denominator > 0 && numerator1 / denominator < 1 && numerator2 / denominator > 0 && numerator2 / denominator < 1
    }
    static isPointOnLine(a: vec2d, b: vec2d, c: vec2d) {
        return a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y) === 0;
    }
    static shortestDistance(point: vec2d, a: vec2d, b: vec2d) {
        const ap = Vec.sub(a, point);
        const ab = Vec.sub(b, a);
        const c1 = Vec.dot(ap, ab);
        if (c1 <= 0) {
            return Vec.distance(point, a);
        }
        const c2 = Vec.dot(ab, ab);
        if (c2 <= c1) {
            return Vec.distance(point, b);
        }
        const barycentric = c1 / c2;
        const p = Vec.add(a, Vec.scale(ab, barycentric));
        return Vec.distance(point, p);
    }
}
export class Rect {
    static containsPoint(point: vec2d, rect: vec2d, size: vec2d) {
        return point.x > rect.x && point.x < rect.x + size.x && point.y > rect.y && point.y < rect.y + size.y;
    }
    static toLines(rect: vec2d, size: vec2d) {
        return [
            {a: {x: rect.x, y: rect.y}, b: {x: rect.x + size.x, y: rect.y}},
            {a: {x: rect.x + size.x, y: rect.y}, b: {x: rect.x + size.x, y: rect.y + size.y}},
            {a: {x: rect.x + size.x, y: rect.y + size.y}, b: {x: rect.x, y: rect.y + size.y}},
            {a: {x: rect.x, y: rect.y + size.y}, b: {x: rect.x, y: rect.y}}
        ]
    }
    static getCenter(start: vec2d, size: vec2d) {
        return {
            x: start.x + size.x / 2,
            y: start.y + size.y / 2
        }
    }
    static getMatrix() {
        return [
            [-1,-1],
            [1,-1],
            [1,1],
            [-1,1]
        ]
    }
}

export class Arc {
    static containsPoint(point:vec2d, x:number, y:number, r:number){
        return (point.x - x) * (point.x - x) + (point.y - y) * (point.y - y) <= r * r
    }
    static getAngleAtDistance(x: number, y: number, r: number, distance: number) {
        return Math.atan2(distance, r) + Math.atan2(y, x);
    }
}