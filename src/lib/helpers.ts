function centerOfRectangle(x: number, y: number, w: number, h: number) {
    return {
        x: x + w / 2,
        y: y + h / 2
    }
}
function rectangleFromCenter(x: number, y: number, w: number, h: number) {
    return {
        x: x - w / 2,
        y: y - h / 2,
        w: w,
        h: h
    }
}

export { centerOfRectangle, rectangleFromCenter }
