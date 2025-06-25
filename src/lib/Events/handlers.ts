import { distance } from "..";
import { basic_object, tool_types, vec2d } from "../../types";

export function handleSelectCircle(current_tool: string, current_action: string) {
  current_tool = "circle";
  current_action = "draw";
}
export function handleCanvasClick(e: MouseEvent, current_action: string, current_tool: tool_types, current_object: basic_object | null,sticky_point: vec2d | null, objects: basic_object[]) {
  if (current_action === "draw" && current_tool !== "none") {
    if (current_tool === "path") {
      if (current_object == null) {
        current_object = {
          x: 0,
          y: 0,
          rx: 0,
          ry: 0,
          paths: [{ x: e.offsetX, y: e.offsetY }],
          type: current_tool
        }
        return
      }
      if (current_object.paths) {
        let pointB = { x: e.offsetX, y: e.offsetY };
        if (current_object.paths.length > 1) {
          let pointA = current_object.paths[0];
          const dist = distance(pointB, pointA);
          if (dist < 10) {
            current_object.paths.push(pointA);
            objects.push(current_object);
            current_object = null;
            current_action = "none";
            current_tool = "none";
            return;
          }
          current_object.paths.push(pointB);
        } else {
          current_object.paths.push(pointB);
        }
      }

    } else {
      if (current_object == null) {
        current_object = {
          x: sticky_point ? sticky_point.x : e.offsetX,
          y: sticky_point ? sticky_point.y : e.offsetY,
          rx: 0,
          ry: 0,
          type: current_tool
        }
      } else {
        current_object.rx = e.offsetX;
        current_object.ry = e.offsetY;
        current_object.r = distance({ x: current_object.x, y: current_object.y }, { x: current_object.rx, y: current_object.ry });
        objects.push(current_object);
        current_object = null;
        current_action = "none";
        current_tool = "none";
      }
    }
  }
}

export function resizeWindow(canvas: HTMLCanvasElement) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
export function handleEscapeKey(e: KeyboardEvent, current_action: string, current_tool: tool_types, current_object: basic_object | null) {
  // e.preventDefault();
  if (e.key === "Escape") {
    if (current_action === "draw") {
      current_tool = "none";
      current_action = "none";
      if (current_object != null) {
        current_object = null;
      }
    }
    current_action = "none";
  }
}
export function handleHotKeyDraw(e: KeyboardEvent,current_tool: string, current_action: string, objects: basic_object[]) {
  // e.preventDefault();
  let isValidKey: tool_types = "none"
  switch ((e.key).toLowerCase()) {
    case "c":
      isValidKey = "circle"
      break;
    case "r":
      isValidKey = "rectangle"
      break;
    case "l":
      isValidKey = "line"
      break;
    case "p":
      isValidKey = "path"
      break;
    default:
      isValidKey = "none"
      break
  }
  if (isValidKey !== "none") {
    current_tool = isValidKey;
    current_action = "draw";
  }
  if (e.key === "z" && objects.length > 0 && e.ctrlKey) {
    objects.pop();
  }
}
export function handleCanvasMouseMove(e: MouseEvent, mouse:vec2d, sticky_point: vec2d | null, canvas_center: vec2d, objects: basic_object[]) {
  mouse.x = e.offsetX;
  mouse.y = e.offsetY;
  if (distance(mouse, canvas_center) < 10) {
    sticky_point = canvas_center
  } else {
    sticky_point = null
  }
  if (objects.length > 0) {
    let closest_object = objects[0];
    let closest_distance = distance(mouse, closest_object);
    for (let i = 0; i < objects.length; i++) {
      let b = { x: objects[i].x, y: objects[i].y, rx: objects[i].rx, ry: objects[i].ry };
      let distance1 = distance(mouse, b);
      if (distance1 < closest_distance) {
        closest_distance = distance1;
        closest_object = objects[i];
      }
    }
  }
}

export function handleDragObject(e: MouseEvent, mouse:vec2d&{click: boolean}, selected_object: basic_object | null, sticky_point: vec2d | null) {
  if (!mouse.click) return
  console.log(selected_object)
  if (selected_object != null) {
    selected_object.x = sticky_point ? sticky_point.x : e.offsetX;
    selected_object.y = sticky_point ? sticky_point.y : e.offsetY;
  }
}
export function handleCanvasMouseDown(e: MouseEvent, mouse:vec2d&{click: boolean}) {
  mouse.click = true;
}
export function handleCanvasMouseUp(e: MouseEvent, mouse:vec2d&{click: boolean}) {
  mouse.click = false;
}