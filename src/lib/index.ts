import { action_types, basic_object, tool_types } from "../types";
import Canvas, { c, canvas, canvas_background, grid_dots, helper_line_color } from "./Canvas";
import EventMap from "./Events";
import mouse from "./Mouse";

function distance(a:{x: number, y: number}, b:{x: number, y: number}){
    return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
}
const settings:{
    current_tool: tool_types,
    current_action: action_types,
    current_object: null | basic_object,
    objects: basic_object[],
    selected_object: null | basic_object
} = {
    current_tool: "circle",
    current_action: "none",
    current_object: null,
    objects: [],
    selected_object: null
}

export { c, Canvas, canvas, canvas_background, distance, EventMap, grid_dots, helper_line_color, mouse, settings };

