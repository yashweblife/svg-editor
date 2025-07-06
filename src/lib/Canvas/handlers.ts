import Canvas, { grid_dots, helper_line_color } from ".";
import { Arc, distance, Settings } from "..";
import { basic_object, vec2d } from "../../types";
import { rectangleFromCenter } from "../helpers";
import Vec, { Path, Rect } from "../Vector";
export function clearCanvas(c: CanvasRenderingContext2D) {
  Canvas.fillCanvas(c);
}

export function drawGrid(c: CanvasRenderingContext2D) {
  c.strokeStyle = grid_dots;
  Canvas.drawOrigin(c);
  for (let i = 10; i < window.innerWidth + 100; i += 50) {
    for (let j = 10; j < window.innerHeight + 100; j += 50) {
      Canvas.arc(c, i, j, 1, 0, 2 * Math.PI);
    }
  }
}

export function drawMouseTool(
  c: CanvasRenderingContext2D,
  mouse: vec2d,
  settings: Settings
) {
  if (settings.current_action === "none") return
  if (settings.current_tool === "none") return
  const dist = distance(mouse, {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
  });
  const pos = { ...mouse }
  if (dist < 20) {
    mouse.x = window.innerWidth / 2;
    mouse.y = window.innerHeight / 2
  }
  if (Math.abs(mouse.y - window.innerHeight / 2) < 5) {
    c.strokeStyle = helper_line_color
    Canvas.line(
      c,
      0,
      window.innerHeight / 2,
      window.innerWidth,
      window.innerHeight / 2
    )
    settings.sticky_point = {
      x: mouse.x,
      y: window.innerHeight / 2
    }
  }
  if (Math.abs(mouse.x - window.innerWidth / 2) < 5) {
    c.strokeStyle = helper_line_color
    Canvas.line(
      c,
      window.innerWidth / 2
      , 0
      , window.innerWidth / 2
      , window.innerHeight
    )
    settings.sticky_point = {
      x: window.innerWidth / 2,
      y: mouse.y
    }
  }
  c.beginPath();
  if (settings.current_tool === "circle") {
    c.arc(pos.x, pos.y, 5, 0, 2 * Math.PI);
  } else if (settings.current_tool === "rectangle") {
    const val = rectangleFromCenter(pos.x, pos.y, 10, 10)
    c.rect(val.x, val.y, val.w, val.h);
  } else if (settings.current_tool === "line") {
    c.moveTo(mouse.x + 10, mouse.y - 10);
    c.lineTo(mouse.x - 10, mouse.y + 10);
  } else if (settings.current_tool === "path") {
    c.moveTo(mouse.x + 10, mouse.y - 10);
    c.lineTo(mouse.x - 10, mouse.y + 10);
    c.arc(mouse.x, mouse.y, 5, 0, 2 * Math.PI);
  }

  c.strokeStyle = helper_line_color;
  c.stroke();
  c.closePath();
}

export function checkMouseOnTop(obj: basic_object, mouse: vec2d) {
  if (obj.type === "circle") {
    const dist = distance(mouse, { x: obj.x, y: obj.y });
    let rad = obj.r ?? 10;
    if (dist < rad + 10) {
      return true
    }
  }
  else if (obj.type === "rectangle") {
    Rect.containsPoint(mouse, { x: obj.x, y: obj.y }, { x: obj.rx, y: obj.ry });
  }
  else if (obj.type === "path") {
    return Path.isPointInPolygon(mouse, obj.paths!)
  }
  return false
}

export function drawHelperGuides(
  c: CanvasRenderingContext2D,
  mouse: vec2d,
  settings: Settings
) {
  if (
    settings.current_action === "draw" &&
    settings.objects.length > 0
  ) {
    let closest_object = settings.objects[0];
    let closest_distance = distance(mouse, closest_object);
    const x = settings.objects[0].x;
    const y = settings.objects[0].y;
    const rx = settings.objects[0].rx;
    const ry = settings.objects[0].ry;
    for (let i = 0; i < settings.objects.length; i++) {
      let b = {
        x,
        y,
        rx,
        ry
      };
      let distance1 = distance(mouse, b);
      if (distance1 < closest_distance) {
        closest_distance = distance1;
        closest_object = settings.objects[i];
      }
    }
    c.beginPath();
    if (closest_object.type === "circle") {
      if (
        closest_distance <= closest_object.r! + 20 &&
        closest_distance >= closest_object.r! - 20
      ) {
        const angle = Vec.angle(closest_object, mouse);
        const point = Arc.getPointAtAngle(
          closest_object.x,
          closest_object.y,
          closest_object.r!,
          angle
        )
        settings.sticky_point = point
        Canvas.arc(c, point.x, point.y, 5, 0, 2 * Math.PI);
      } else {
        settings.sticky_point = null
        if (
          settings.current_object != null &&
          settings.current_object.type === "circle" &&
          Math.abs(distance(mouse, settings.current_object) - closest_object.r!) < 10) {
          const angle = Vec.angle(closest_object, mouse);
          const point = Arc.getPointAtAngle(
            settings.current_object.x,
            settings.current_object.y,
            closest_object.r!,
            angle
          )
          settings.sticky_point = point
          c.arc(
            settings.current_object.x,
            settings.current_object.y,
            closest_object.r!,
            0,
            2 * Math.PI);
        }
      }
    }
    else if (closest_object.type === "line") {

    }
    else if (closest_object.type === "rectangle") {

    }
    else if (closest_object.type === "path") {
      let closest_point = settings.objects[0].paths![0];
      let closest_distance = distance(mouse, closest_point);
      for (let i = 0; i < settings.objects[0].paths!.length; i++) {
        let b = settings.objects[0].paths![i];
        let distance1 = distance(mouse, b);
        if (distance1 < closest_distance) {
          closest_distance = distance1;
          closest_point = b;
        }
      }
      settings.sticky_point = closest_point
    }
    c.strokeStyle = helper_line_color;
    c.stroke();
    c.closePath();
  }
}

export function drawPhantomObject(
  c: CanvasRenderingContext2D,
  mouse: vec2d,
  settings: Settings
) {
  if (
    settings.current_action === "draw" &&
    settings.current_object != null
  ) {
    const dist = distance(mouse, settings.current_object);
    c.beginPath();
    switch (settings.current_tool) {
      case "circle":
        c.arc(
          settings.current_object.x,
          settings.current_object.y,
          dist,
          0,
          2 * Math.PI
        );
        break;
      case "rectangle":
        c.rect(
          settings.current_object.x,
          settings.current_object.y,
          mouse.x - settings.current_object.x,
          mouse.y - settings.current_object.y
        );
        break;
      case "line":
        Canvas.manyLine(
          c,
          settings.current_object.x,
          settings.current_object.y,
          mouse.x, mouse.y);
        break;
      case "path":
        if (settings.current_object.paths) {
          let prev = settings.current_object.paths[0];
          c.beginPath();
          for (let i = 1; i < settings
            .current_object
            .paths
            .length; i++) {
            c.moveTo(prev.x, prev.y);
            c.lineTo(
              settings.current_object.paths[i].x,
              settings.current_object.paths[i].y);
            prev = settings.current_object.paths[i];
            c.stroke();
          }
          let p = settings
            .current_object
            .paths[settings.current_object.paths.length - 1]
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
export function drawObjects(
  c: CanvasRenderingContext2D,
  mouse: vec2d,
  settings: Settings
) {
  if (settings.sticky_point != null) {
    c.strokeStyle = "rgb(255, 100, 100)"
    Canvas.arc(c,
      settings.sticky_point.x,
      settings.sticky_point.y,
      5,
      0,
      2 * Math.PI
    );
  }
  for (let i = 0; i < settings.objects.length; i++) {
    c.beginPath();
    const o = settings.objects[i];
    switch (o.type) {
      case "circle":
        Canvas.arc(c, o.x, o.y, o.r ?? 10, 0, 2 * Math.PI);
        break;
      case "rectangle":
        Canvas.rect(c, o.x, o.y, o.rx - o.x, o.ry - o.y);
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
      settings.selected_object = o
    } else {
      settings.selected_object = null
      c.strokeStyle = grid_dots
    }
    c.stroke();
    c.closePath();
  }
}
