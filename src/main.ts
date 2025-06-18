import { c, canvas, canvas_background, EventMap, mouse, settings } from "./lib";
import "./styles/common.css";
import { basic_object, tool_types } from "./types";


const circleButton = document.querySelector("#circle") as HTMLButtonElement;
let { current_tool, current_action, current_object } = settings;
const circleClickEvent = EventMap<MouseEvent>(circleButton, "click", [handleSelectCircle]);
const canvasClickEvent = EventMap<MouseEvent>(canvas, "click", [handleCanvasClick]);
const resizeEvent = EventMap<Event>(window, "resize", [resizeWindow]);
const keyDoenEvent = EventMap<KeyboardEvent>(window, "keydown", [handleEscapeKey, handleHotKeyDraw]);
const canvasMouseMoveEvent = EventMap<MouseEvent>(canvas, "mousemove", [handleCanvasMouseMove]);
const objects: basic_object[] = [];

function handleCanvasMouseMove(e: MouseEvent) {
  mouse.x = e.offsetX;
  mouse.y = e.offsetY;
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
  if (e.key === "c") {
    isValidKey = "circle"
  } else if (e.key === "r") {
    isValidKey = "rectangle"
  } else if (e.key === "l") {
    isValidKey = "line"
  } else if (e.key === "p") {
    isValidKey = "path"
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
      console.log("path")
      if (current_object == null) {
        current_object = {
          x: 0,
          y: 0,
          rx: 0,
          ry: 0,
          paths: [{ x: e.offsetX, y: e.offsetY }],
          type: current_tool
        }
        console.log("ADDED:", current_object)
        return
      }
      if (current_object.paths) {
        let pointB = { x: e.offsetX, y: e.offsetY };
        if (current_object.paths.length > 1) {
          let pointA = current_object.paths[0];
          let distance = Math.sqrt((pointB.x - pointA.x) * (pointB.x - pointA.x) + (pointB.y - pointA.y) * (pointB.y - pointA.y));
          if (distance < 10) {
            console.log("FINISHING: ", current_object.paths)
            current_object.paths.push(pointA);
            objects.push(current_object);
            current_object = null;
            current_action = "none";
            current_tool = "none";
            return;
          }
          current_object.paths.push(pointB);
        } else {
          console.log("CONTINUING: ", current_object.paths)
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
        objects.push(current_object);
        current_object = null;
        current_action = "none";
        current_tool = "none";
      }
    }
  }
}

function animation() {
  requestAnimationFrame(animation);
  c.fillStyle = canvas_background;
  c.fillRect(0, 0, canvas.width, canvas.height);
  c.strokeStyle = "rgba(255,255,255,0.1)";
  for (let i = 10; i < window.innerWidth + 100; i += 50) {
    for (let j = 10; j < window.innerHeight + 100; j += 50) {
      c.beginPath();
      c.arc(i, j, 1, 0, 2 * Math.PI);
      c.stroke();
      c.closePath();
    }
  }
  if (current_action === "draw" && objects.length > 0) {
    
      let closest_object = objects[0];
      let closest_distance = Math.sqrt((mouse.x - closest_object.x) * (mouse.x - closest_object.x) + (mouse.y - closest_object.y) * (mouse.y - closest_object.y));
      for (let i = 0; i < objects.length; i++) {
        let b = { x: objects[i].x, y: objects[i].y, rx: objects[i].rx, ry: objects[i].ry };
        let distance1 = Math.sqrt((mouse.x - b.x) * (mouse.x - b.x) + (mouse.y - b.y) * (mouse.y - b.y));
        if (distance1 < closest_distance) {
          closest_distance = distance1;
          closest_object = objects[i];
        }
      }
      c.beginPath();
      c.arc(closest_object.x, closest_object.y, 2, 0, 2 * Math.PI);
      c.rect(closest_object.x, closest_object.y, mouse.x - closest_object.x, mouse.y - closest_object.y);
      c.strokeStyle = "rgba(166, 105, 105, 0.68)";
      c.stroke();
      c.closePath();
      c.strokeStyle = "rgba(255,255,255,0.1)";
    
  }
  if (current_action === "draw" && current_object != null) {
    if (current_tool === "circle") {
      const dist = Math.sqrt((mouse.x - current_object.x) ** 2 + (mouse.y - current_object.y) ** 2);
      c.beginPath();
      c.arc(current_object.x, current_object.y, dist, 0, 2 * Math.PI);
      c.stroke();
      c.closePath();
    } else if (current_tool === "rectangle") {
      c.beginPath();
      c.rect(current_object.x, current_object.y, mouse.x - current_object.x, mouse.y - current_object.y);
      c.stroke();
      c.closePath();
    } else if (current_tool === "line") {
      c.beginPath();
      c.moveTo(current_object.x, current_object.y);
      c.lineTo(mouse.x, mouse.y);
      c.stroke();
      c.closePath();
    } else if (current_tool === "path") {
      if (current_object.paths) {
        let prev = current_object.paths[0];
        for (let i = 1; i < current_object.paths.length; i++) {
          c.beginPath();
          c.moveTo(prev.x, prev.y);
          c.lineTo(current_object.paths[i].x, current_object.paths[i].y);
          prev = current_object.paths[i];
          c.stroke();
          c.closePath();
        }
        c.beginPath();
        let p = current_object.paths[current_object.paths.length - 1]
        c.moveTo(p.x, p.y);
        c.lineTo(mouse.x, mouse.y);
        c.stroke();
        c.closePath();
      }
    }
  }
  for (let i = 0; i < objects.length; i++) {
    c.beginPath();
    const o = objects[i];
    if (objects[i].type === "circle") {
      const dist = Math.sqrt((o.x - o.rx) ** 2 + (o.y - o.ry) ** 2);
      c.arc(o.x, o.y, dist, 0, 2 * Math.PI);
      c.stroke();
    }
    else if (objects[i].type === "rectangle") {
      c.rect(o.x, o.y, o.rx - o.x, o.ry - o.y);
      c.stroke();
    }
    else if (objects[i].type === "line") {
      c.moveTo(o.x, o.y);
      c.lineTo(o.rx, o.ry);
      c.stroke();
    }
    else if (objects[i].type === "path") {
      c.beginPath();
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
      c.stroke();
    }
    c.closePath();
  }
}

animation();