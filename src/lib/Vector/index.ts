import { vec2d } from "../../types";

export default class Vec{
    static add(a:vec2d,b:vec2d){
        return {
            x: a.x + b.x,
            y: a.y + b.y
        }
    }
    static magnitude(a:vec2d){
        return Math.sqrt(a.x * a.x + a.y * a.y);
    }
    static normalize(a:vec2d){
        return {
            x: a.x / Vec.magnitude(a),
            y: a.y / Vec.magnitude(a)
        }
    }
    static distance(a:vec2d,b:vec2d){
        return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
    }
    static dot(a:vec2d,b:vec2d){
        return a.x * b.x + a.y * b.y;
    }
    static cross(a:vec2d,b:vec2d){
        return a.x * b.y - a.y * b.x;
    }
    static scale(a:vec2d, b:number){
        const c = Vec.normalize(a);
        return {
            x: b* c.x,
            y: b* c.y
        }
    }
    static sub(a:vec2d,b:vec2d){
        return {
            x: a.x - b.x,
            y: a.y - b.y
        }
    }
    static mid(a:vec2d,b:vec2d){
        return {
            x: (a.x + b.x) / 2,
            y: (a.y + b.y) / 2
        }
    }
    static lerp(a:vec2d,b:vec2d,t:number){
        return {
            x: a.x + (b.x - a.x) * t,
            y: a.y + (b.y - a.y) * t
        }
    }
    static angle(a:vec2d,b:vec2d){
        return Math.atan2(b.y - a.y, b.x - a.x);
    }
    static rotate(a:vec2d,angle:number){
        return {
            x: a.x * Math.cos(angle) - a.y * Math.sin(angle),
            y: a.x * Math.sin(angle) + a.y * Math.cos(angle)
        }
    }
}