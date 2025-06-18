import { action_types, basic_object, tool_types } from "../types";
import Canvas, { c, canvas, canvas_background, grid_dots, helper_line_color } from "./Canvas";
import EventMap from "./Events";
import mouse from "./Mouse";
const settings:{
    current_tool: tool_types,
    current_action: action_types,
    current_object: null | basic_object
} = {
    current_tool: "circle",
    current_action: "none",
    current_object: null
}

export { c, Canvas, canvas, canvas_background, EventMap, grid_dots, helper_line_color, mouse, settings };

