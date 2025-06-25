import { Arc, c, Canvas, canvas, distance, EventMap, grid_dots, helper_line_color, mouse, settings } from "./lib";
import { rectangleFromCenter } from "./lib/helpers";
import Vec from "./lib/Vector";
import "./styles/common.css";
import { basic_object, tool_types, vec2d } from "./types";

const circleButton = document.querySelector("#circle") as HTMLButtonElement;

let { current_tool, current_action, current_object, objects, selected_object, sticky_point, canvas_center } = settings;

EventMap<MouseEvent>(circleButton, "click", [()=>{handleSelectCircle(current_tool, current_action)}]);
EventMap<MouseEvent>(canvas, "click", [(e: MouseEvent)=>{handleCanvasClick(e, current_action, current_tool, current_object, objects)}]);
EventMap<Event>(window, "resize", [()=>{resizeWindow(canvas)}]);
EventMap<KeyboardEvent>(window, "keydown", [(e: KeyboardEvent)=>{handleEscapeKey(e, current_action, current_object)}, (e: KeyboardEvent)=>{handleHotKeyDraw(e, current_action, current_tool, objects)}]);
EventMap<MouseEvent>(canvas, "mousemove", [(e: MouseEvent)=>{handleCanvasMouseMove(e)}, (e: MouseEvent)=>{handleDragObject(e, mouse, selected_object, sticky_point)}]);
EventMap<MouseEvent>(canvas, "mousedown", [(e: MouseEvent)=>{handleCanvasMouseDown(e, mouse)}]);
EventMap<MouseEvent>(canvas, "mouseup", [(e: MouseEvent)=>{handleCanvasMouseUp(e, mouse)}]);

function handleCanvasMouseMove(e: MouseEvent) {
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
function handleCanvasMouseDown(e: MouseEvent, mouse:vec2d&{click: boolean}) {
  mouse.click = true;
}
function handleCanvasMouseUp(e: MouseEvent, mouse:vec2d&{click: boolean}) {
  mouse.click = false;
}
function resizeWindow(canvas: HTMLCanvasElement) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
function handleEscapeKey(e: KeyboardEvent, current_action: string, current_object: basic_object | null) {
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
function handleHotKeyDraw(e: KeyboardEvent, current_action: string, current_tool: string, objects: basic_object[]) {
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
function handleSelectCircle(current_tool: string, current_action: string) {
  current_tool = "circle";
  current_action = "draw";
}
function handleCanvasClick(e: MouseEvent, current_action: string, current_tool: tool_types, current_object: basic_object | null, objects: basic_object[]) {
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
function handleDragObject(e: MouseEvent, mouse:vec2d&{click: boolean}, selected_object: basic_object | null, sticky_point: vec2d | null) {
  if (!mouse.click) return
  console.log(selected_object)
  if (selected_object != null) {
    selected_object.x = sticky_point ? sticky_point.x : e.offsetX;
    selected_object.y = sticky_point ? sticky_point.y : e.offsetY;
  }
}

function clearCanvas(c: CanvasRenderingContext2D) {
  Canvas.fillCanvas(c);
}
function drawGrid(c: CanvasRenderingContext2D) {
  c.strokeStyle = grid_dots;
  Canvas.drawOrigin(c);
  for (let i = 10; i < window.innerWidth + 100; i += 50) {
    for (let j = 10; j < window.innerHeight + 100; j += 50) {
      Canvas.arc(c, i, j, 1, 0, 2 * Math.PI);
    }
  }
}
function drawMouseTool(c: CanvasRenderingContext2D, mouse: vec2d, current_action: string, current_tool: tool_types) {
  if (current_action === "none") return
  if (current_tool === "none") return
  const dist = distance(mouse, { x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const pos = { ...mouse }
  if (dist < 20) {
    mouse.x = window.innerWidth / 2;
    mouse.y = window.innerHeight / 2
  }
  c.beginPath();
  if (current_tool === "circle") {
    c.arc(pos.x, pos.y, 5, 0, 2 * Math.PI);
  } else if (current_tool === "rectangle") {
    const val = rectangleFromCenter(pos.x, pos.y, 10, 10)
    c.rect(val.x, val.y, val.w, val.h);
  } else if (current_tool === "line") {
    c.moveTo(mouse.x + 10, mouse.y - 10);
    c.lineTo(mouse.x - 10, mouse.y + 10);
  } else if (current_tool === "path") {
    c.moveTo(mouse.x + 10, mouse.y - 10);
    c.lineTo(mouse.x - 10, mouse.y + 10);
    c.arc(mouse.x, mouse.y, 5, 0, 2 * Math.PI);
  }

  c.strokeStyle = helper_line_color;
  c.stroke();
  c.closePath();
}
function checkMouseOnTop(obj: basic_object, mouse: vec2d) {
  if (obj.type === "circle") {
    const dist = distance(mouse, { x: obj.x, y: obj.y });
    let rad = obj.r ?? 10;
    if (dist < rad + 10) {
      return true
    }
  }
  return false
}
function drawHelperGuides() {
  if (current_action === "draw" && objects.length > 0) {
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
    c.beginPath();
    if (closest_object.type === "circle") {
      if (closest_distance <= closest_object.r! + 20 && closest_distance >= closest_object.r! - 20) {
        const angle = Vec.angle(closest_object, mouse);
        const point = Arc.getPointAtAngle(
          closest_object.x,
          closest_object.y,
          closest_object.r!,
          angle
        )
        sticky_point = point
        Canvas.arc(c, point.x, point.y, 5, 0, 2 * Math.PI);
      } else {
        sticky_point = null
        if (current_object != null && current_object.type === "circle" && Math.abs(distance(mouse, current_object) - closest_object.r!) < 10) {
          const angle = Vec.angle(closest_object, mouse);
          const point = Arc.getPointAtAngle(
            current_object.x,
            current_object.y,
            closest_object.r!,
            angle
          )
          sticky_point = point
          c.arc(current_object.x, current_object.y, closest_object.r!, 0, 2 * Math.PI);
        }
      }
    }
    else if (closest_object.type === "line") {

    }
    c.strokeStyle = helper_line_color;
    c.stroke();
    c.closePath();
  }
}
function drawPhantomObject() {
  if (current_action === "draw" && current_object != null) {
    const dist = distance(mouse, current_object);
    c.beginPath();
    switch (current_tool) {
      case "circle":
        c.arc(current_object.x, current_object.y, dist, 0, 2 * Math.PI);
        break;
      case "rectangle":
        c.rect(current_object.x, current_object.y, mouse.x - current_object.x, mouse.y - current_object.y);
        break;
      case "line":
        Canvas.manyLine(c, current_object.x, current_object.y, mouse.x, mouse.y);
        break;
      case "path":
        if (current_object.paths) {
          let prev = current_object.paths[0];
          c.beginPath();
          for (let i = 1; i < current_object.paths.length; i++) {
            c.moveTo(prev.x, prev.y);
            c.lineTo(current_object.paths[i].x, current_object.paths[i].y);
            prev = current_object.paths[i];
            c.stroke();
          }
          let p = current_object.paths[current_object.paths.length - 1]
          c.moveTo(p.x, p.y);
          c.lineTo(mouse.x, mouse.y);
          c.stroke();
          c.closePath();
        }
        break;
    }
    c.stroke();
    c.closePath();
  }
}
function drawObjects() {
  if (sticky_point != null) {
    c.beginPath();
    c.strokeStyle = "rgb(255, 100, 100)"
    Canvas.arc(c, sticky_point.x, sticky_point.y, 5, 0, 2 * Math.PI);
    c.closePath();
  }
  for (let i = 0; i < objects.length; i++) {
    c.beginPath();
    const o = objects[i];
    switch (o.type) {
      case "circle":
        c.arc(o.x, o.y, o.r ?? 10, 0, 2 * Math.PI);
        break;
      case "rectangle":
        c.rect(o.x, o.y, o.rx - o.x, o.ry - o.y);
        break;
      case "line":
        Canvas.manyLine(c, o.x, o.y, o.rx, o.ry);
        break;
      case "path":
        const points = o.paths;
        if (!points || points.length === 0) {
          continue;
        }
        Canvas.path(c, points);
        break;
    }
    if (checkMouseOnTop(o, mouse)) {
      c.strokeStyle = "rgb(255, 100, 100)"
      selected_object = o
    } else {
      selected_object = null
      c.strokeStyle = grid_dots
    }
    c.stroke();
    c.closePath();
  }
}

function animation() {
  requestAnimationFrame(animation);
  clearCanvas(c);
  drawGrid(c);
  drawMouseTool(c,mouse, current_action, current_tool);
  drawHelperGuides();
  drawPhantomObject();
  drawObjects();
}

animation();