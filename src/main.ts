import "./styles/common.css";
const canvas = document.createElement("canvas") as HTMLCanvasElement;
const c = canvas.getContext("2d") as CanvasRenderingContext2D;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
(document.querySelector("#app") as HTMLDivElement).appendChild(canvas);
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
})

const canvas_background = "rgb(18,18,18)";
function animation(){
  requestAnimationFrame(animation);
  c.fillStyle = canvas_background;
  c.fillRect(0, 0, canvas.width, canvas.height);
  c.strokeStyle = "rgba(255,255,255,0.1)";
  for(let i=10;i<window.innerWidth+100; i+=50){
    for(let j=10;j<window.innerHeight+100; j+=50){
      c.beginPath();
      c.arc(i,j,1,0,2*Math.PI);
      c.stroke();
      c.closePath();
    }
  }
}

animation();