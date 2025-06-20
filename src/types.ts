export type action_types =  "draw"|"none"|"edit"
export type tool_types = "circle"| "line"| "rectangle"|"path"|"none" 
export type vec2d = {x: number, y: number}
export type basic_object = {x: number, y: number, rx: number, ry: number,paths?: vec2d[], type: tool_types,r?:number}