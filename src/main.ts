import { c, canvas, canvas_background, distance, EventMap, grid_dots, helper_line_color, mouse, settings } from "./lib";
import "./styles/common.css";
import { basic_object, tool_types } from "./types";

const circleButton = document.querySelector("#circle") as HTMLButtonElement;

let { current_tool, current_action, current_object, objects, selected_object } = settings;

EventMap<MouseEvent>(circleButton, "click", [handleSelectCircle]);
EventMap<MouseEvent>(canvas, "click", [handleCanvasClick]);
EventMap<Event>(window, "resize", [resizeWindow]);
EventMap<KeyboardEvent>(window, "keydown", [handleEscapeKey, handleHotKeyDraw]);
EventMap<MouseEvent>(canvas, "mousemove", [handleCanvasMouseMove, handleDragObject]);
EventMap<MouseEvent>(canvas, "mousedown", [handleCanvasMouseDown]);
EventMap<MouseEvent>(canvas, "mouseup", [handleCanvasMouseUp]);

function handleCanvasMouseMove(e: MouseEvent) {
  mouse.x = e.offsetX;
  mouse.y = e.offsetY;
}
function handleCanvasMouseDown(e: MouseEvent) {
  mouse.click = true;
}
function handleCanvasMouseUp(e: MouseEvent) {
  mouse.click = false;
}
function resizeWindow() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
function handleEscapeKey(e: KeyboardEvent) {
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
function handleHotKeyDraw(e: KeyboardEvent) {
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
function handleSelectCircle() {
  current_tool = "circle";
  current_action = "draw";
}
function handleCanvasClick(e: MouseEvent) {
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
          x: e.offsetX,
          y: e.offsetY,
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
function handleDragObject(e: MouseEvent) {
  if(!mouse.click) return
  console.log(selected_object)
  if (selected_object != null) {
    selected_object.x = e.offsetX;
    selected_object.y = e.offsetY;
  }
}

function clearCanvas() {
  c.fillStyle = canvas_background;
  c.fillRect(0, 0, canvas.width, canvas.height);
}
function drawGrid() {
  c.strokeStyle = grid_dots;
  const center = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
  }
  c.beginPath();
  c.moveTo(center.x, 0);
  c.lineTo(center.x, window.innerHeight);
  c.stroke();
  c.closePath();
  c.beginPath();
  c.moveTo(0, center.y);
  c.lineTo(window.innerWidth, center.y);
  c.stroke();
  c.closePath();
  for (let i = 10; i < window.innerWidth + 100; i += 50) {
    for (let j = 10; j < window.innerHeight + 100; j += 50) {
      c.beginPath();
      c.arc(i, j, 1, 0, 2 * Math.PI);
      c.stroke();
      c.closePath();
    }
  }
}
function drawMouseTool() {
  const dist = distance(mouse, { x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const pos = { ...mouse }
  if (dist < 20) {
    mouse.x = window.innerWidth / 2;
    mouse.y = window.innerHeight / 2
  }
  c.beginPath();
  c.arc(pos.x, pos.y, 5, 0, 2 * Math.PI);
  c.strokeStyle = helper_line_color;
  c.stroke();
  c.closePath();
}
function checkMouseOnTop(obj:basic_object){
    if(obj.type === "circle"){
      const dist = distance(mouse, { x: obj.x, y: obj.y });
      let rad = obj.r??10;
      if (dist < rad+10) {
        return true
      }
      return false
    }
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
    c.arc(closest_object.x, closest_object.y, 2, 0, 2 * Math.PI);
    c.rect(closest_object.x, closest_object.y, mouse.x - closest_object.x, mouse.y - closest_object.y);
    c.strokeStyle = helper_line_color;
    c.stroke();
    c.closePath();
    c.strokeStyle = grid_dots;
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
        c.moveTo(current_object.x, current_object.y);
        c.lineTo(mouse.x, mouse.y);
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
  for (let i = 0; i < objects.length; i++) {
    c.beginPath();
    const o = objects[i];
    switch (o.type) {
      case "circle":
        c.arc(o.x, o.y, o.r??10, 0, 2 * Math.PI);
        break;
      case "rectangle":
        c.rect(o.x, o.y, o.rx - o.x, o.ry - o.y);
        break;
      case "line":
        c.moveTo(o.x, o.y);
        c.lineTo(o.rx, o.ry);
        break;
      case "path":
        const paths = o.paths;
        if (!paths || paths.length === 0) {
          continue;
        }
        let prev = paths[0];
        for (let i = 1; i < paths.length; i++) {
          c.moveTo(prev.x, prev.y);
          c.lineTo(paths[i].x, paths[i].y);
          prev = paths[i];
        }
        break;
    }
    if(checkMouseOnTop(o)){
      c.strokeStyle = "red"
      selected_object = o
      console.log(o)
    }else{
      selected_object = null
      c.strokeStyle = grid_dots
    }
    c.stroke();
    c.closePath();
  }
}

function animation() {
  requestAnimationFrame(animation);
  clearCanvas();
  drawGrid();
  drawMouseTool();
  drawHelperGuides();
  drawPhantomObject();
  drawObjects();
}

animation();