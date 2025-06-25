import { action_types, basic_object, tool_types, vec2d } from "../types";
import Canvas, { c, canvas, canvas_background, grid_dots, helper_line_color } from "./Canvas";
import EventMap from "./Events";
import mouse from "./Mouse";
import { Arc, Line, Rect } from "./Vector";

function distance(a: vec2d, b: vec2d) {
    return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
}
const settings: {
    current_tool: tool_types,
    current_action: action_types,
    current_object: null | basic_object,
    objects: basic_object[],
    selected_object: null | basic_object,
    closest_object: null | basic_object,
    sticky_point: null | vec2d,
    canvas_center: vec2d

} = {
    current_tool: "circle",
    current_action: "none",
    current_object: null,
    objects: [],
    selected_object: null,
    closest_object: null,
    sticky_point: null,
    canvas_center: { x: canvas.width / 2, y: canvas.height / 2 }
}

export { Arc, c, Canvas, canvas, canvas_background, distance, EventMap, grid_dots, helper_line_color, Line, mouse, Rect, settings };

