import EventMap from "./lib/Events";
import "./styles/common.css";
import { action_types, basic_object, tool_types } from "./types";



const canvas = document.createElement("canvas") as HTMLCanvasElement;
const circleButton = document.querySelector("#circle") as HTMLButtonElement;
const c = canvas.getContext("2d") as CanvasRenderingContext2D;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
(document.querySelector("#app") as HTMLDivElement).appendChild(canvas);
const canvas_background = "rgb(18,18,18)";


let current_tool: tool_types = "circle";
let current_action: action_types = "none";
let current_object: null | basic_object = null;


const mouse = {
  x: 0,
  y: 0,
  click: false,
}
const circleClickEvent = EventMap<MouseEvent>(circleButton, "click", [handleSelectCircle]);
const canvasClickEvent = EventMap<MouseEvent>(canvas, "click", [handleCanvasClick]);
const resizeEvent = EventMap<Event>(window, "resize", [resizeWindow]);
const keyDoenEvent = EventMap<KeyboardEvent>(window, "keydown", [handleEscapeKey, handleHotKeyDraw]);
const canvasMouseMoveEvent = EventMap<MouseEvent>(canvas, "mousemove", [handleCanvasMouseMove]);

function handleCanvasMouseMove(e: MouseEvent) {
  mouse.x = e.offsetX;
  mouse.y = e.offsetY;
}
function resizeWindow() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
function handleEscapeKey(e: KeyboardEvent) {
  e.preventDefault();
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
  e.preventDefault();
  let isValidKey: tool_types = "none"
  if (e.key === "c") {
    isValidKey = "circle"
  } else if (e.key === "r") {
    isValidKey = "rectangle"
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
const objects: basic_object[] = [];

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
  if (current_action === "draw" && current_object != null) {
    if( current_tool === "circle"){
      const dist = Math.sqrt((mouse.x - current_object.x) ** 2 + (mouse.y - current_object.y) ** 2);
      c.beginPath();
      c.arc(current_object.x, current_object.y, dist, 0, 2 * Math.PI);
      c.stroke();
      c.closePath();
    }else if( current_tool === "rectangle"){
      c.beginPath();
      c.rect(current_object.x, current_object.y, mouse.x - current_object.x, mouse.y - current_object.y);
      c.stroke();
      c.closePath();
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
    else if(objects[i].type === "rectangle"){
      c.rect(o.x, o.y, o.rx - o.x, o.ry - o.y);
      c.stroke();  
    }
    c.closePath();
  }
}

animation();