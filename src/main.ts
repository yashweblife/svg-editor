import { Canvas, EventMap, mouse, settings as s } from "./lib";
import { clearCanvas, drawGrid, drawHelperGuides, drawMouseTool, drawObjects, drawPhantomObject } from "./lib/Canvas";
import { handleCanvasClick, handleCanvasMouseDown, handleCanvasMouseMove, handleCanvasMouseUp, handleDragObject, handleEscapeKey, handleHotKeyDraw, handleSelectCircle } from "./lib/Events";
import { resizeWindow } from "./lib/Events/handlers";
import "./styles/common.css";

const circleButton = document.querySelector("#circle") as HTMLButtonElement;
const { c, canvas } = Canvas.makeCanvas("#app");
const settings = { ...s }
EventMap<MouseEvent>(circleButton, "click", [
  () => { handleSelectCircle(settings) }
]);
EventMap<MouseEvent>(canvas, "click", [
  (e: MouseEvent) => { handleCanvasClick(e, settings) }
]);
EventMap<Event>(window, "resize", [
  () => { resizeWindow(canvas) }
]);
EventMap<KeyboardEvent>(window, "keydown", [
  (e: KeyboardEvent) => { handleEscapeKey(e, settings) },
  (e: KeyboardEvent) => { handleHotKeyDraw(e, settings); }]);
EventMap<MouseEvent>(canvas, "mousemove", [
  (e: MouseEvent) => { handleCanvasMouseMove(e, mouse, settings) },
  (e: MouseEvent) => { handleDragObject(e, mouse, settings) }]);
EventMap<MouseEvent>(canvas, "mousedown", [
  (e: MouseEvent) => { handleCanvasMouseDown(e, mouse) }
]);
EventMap<MouseEvent>(canvas, "mouseup", [
  (e: MouseEvent) => { handleCanvasMouseUp(e, mouse) }
]);


function animation() {
  requestAnimationFrame(animation);
  clearCanvas(c);
  drawGrid(c);
  drawMouseTool(c, mouse, settings);
  drawHelperGuides(c, mouse, settings);
  drawPhantomObject(c, mouse, settings);
  drawObjects(c, mouse, settings);
}

animation();