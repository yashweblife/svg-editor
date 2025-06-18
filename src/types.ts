export type action_types =  "draw"|"none"|"edit"
export type tool_types = "circle"| "line"| "rectangle"|"path"|"none" 
export type basic_object = {x: number, y: number, rx: number, ry: number,paths?:{x: number, y: number}[], type: tool_types}