export type action_types =  "draw"|"none"|"edit"
export type tool_types = "circle"| "line"| "rectangle"|"none" 
export type basic_object = {x: number, y: number, rx: number, ry: number, type: tool_types}