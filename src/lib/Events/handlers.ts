import { distance, Settings } from "..";
import { tool_types, vec2d } from "../../types";

export function handleSelectCircle(settings: Settings) {
  settings.current_tool = "circle";
  settings.current_action = "draw";
}
export function handleCanvasClick(e: MouseEvent, settings: Settings) {
  if (settings.current_action === "draw" && settings.current_tool !== "none") {
    if (settings.current_tool === "path") {
      if (settings.current_object == null) {
        settings.current_object = {
          x: 0,
          y: 0,
          rx: 0,
          ry: 0,
          paths: [{ x: e.offsetX, y: e.offsetY }],
          type: settings.current_tool
        }
        return
      }
      if (settings.current_object.paths) {
        let pointB = { x: e.offsetX, y: e.offsetY };
        if (settings.current_object.paths.length > 1) {
          let pointA = settings.current_object.paths[0];
          const dist = distance(pointB, pointA);
          if (dist < 10) {
            settings.current_object.paths.push(pointA);
            settings.objects.push(settings.current_object);
            settings.current_object = null;
            settings.current_action = "none";
            settings.current_tool = "none";
            return;
          }
          settings.current_object.paths.push(pointB);
        } else {
          settings.current_object.paths.push(pointB);
        }
      }

    } else {
      if (settings.current_object == null) {
        settings.current_object = {
          x: settings.sticky_point ? settings.sticky_point.x : e.offsetX,
          y: settings.sticky_point ? settings.sticky_point.y : e.offsetY,
          rx: 0,
          ry: 0,
          type: settings.current_tool
        }
      } else {
        settings.current_object.rx = e.offsetX;
        settings.current_object.ry = e.offsetY;
        settings.current_object.r = distance({ x: settings.current_object.x, y: settings.current_object.y }, { x: settings.current_object.rx, y: settings.current_object.ry });
        settings.objects.push(settings.current_object);
        settings.current_object = null;
        settings.current_action = "none";
        settings.current_tool = "none";
      }
    }
  }
}

export function resizeWindow(canvas: HTMLCanvasElement) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
export function handleEscapeKey(e: KeyboardEvent, settings: Settings) {
  // e.preventDefault();
  if (e.key === "Escape") {
    if (settings.current_action === "draw") {
      settings.current_tool = "none";
      settings.current_action = "none";
      if (settings.current_object != null) {
        settings.current_object = null;
      }
    }
    settings.current_action = "none";
  }
}
export function handleHotKeyDraw(e: KeyboardEvent, settings:Settings) {
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
    settings.current_tool = isValidKey;
    settings.current_action = "draw";
  }
  if (e.key === "z" && settings.objects.length > 0 && e.ctrlKey) {
    settings.objects.pop();
  }
}
export function handleCanvasMouseMove(e: MouseEvent, mouse: vec2d, settings:Settings) {
  mouse.x = e.offsetX;
  mouse.y = e.offsetY;
  if (distance(mouse, settings.canvas_center) < 10) {
    settings.sticky_point = settings.canvas_center
  } else {
    settings.sticky_point = null
  }
  if (settings.objects.length > 0) {
    let closest_object = settings.objects[0];
    let closest_distance = distance(mouse, closest_object);
    for (let i = 0; i < settings.objects.length; i++) {
      let b = { x: settings.objects[i].x, y: settings.objects[i].y, rx: settings.objects[i].rx, ry: settings.objects[i].ry };
      let distance1 = distance(mouse, b);
      if (distance1 < closest_distance) {
        closest_distance = distance1;
        closest_object = settings.objects[i];
      }
    }
  }
}

export function handleDragObject(e: MouseEvent, mouse: vec2d & { click: boolean }, settings: Settings) {
  if (!mouse.click) return
  if (settings.selected_object != null) {
    settings.selected_object.x = settings.sticky_point ? settings.sticky_point.x : e.offsetX;
    settings.selected_object.y = settings.sticky_point ? settings.sticky_point.y : e.offsetY;
  }
}
export function handleCanvasMouseDown(e: MouseEvent, mouse: vec2d & { click: boolean }) {
  mouse.click = true;
}
export function handleCanvasMouseUp(e: MouseEvent, mouse: vec2d & { click: boolean }) {
  mouse.click = false;
}