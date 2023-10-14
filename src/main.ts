import "./style.css";
import { lerp } from "./utils";
type Point = {
  x: number;
  y: number;
};
const myCanvas = document.getElementById(
  "myCanvas"
) as HTMLCanvasElement | null;
if (myCanvas) {
  myCanvas.width = window.innerWidth;
  myCanvas.height = window.innerHeight;
  const A = {
    x: 200,
    y: 150,
  };
  const B = {
    x: 150,
    y: 250,
  };
  const C = {
    x: 50,
    y: 100,
  };
  const D = {
    x: 250,
    y: 200,
  };
  const ctx = myCanvas.getContext("2d");
  let angle = 0;
  const mouse = {
    x: 0,
    y: 0,
  };
  document.addEventListener("mousemove", (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
  });
  if (ctx) {
    function animate() {
      if (ctx && myCanvas) {
        const radius = 50;
        A.x = mouse.x + Math.cos(angle) * radius;
        A.y = mouse.y - Math.sin(angle) * radius;
        B.x = mouse.x - Math.cos(angle) * radius;
        B.y = mouse.y + Math.sin(angle) * radius;
        angle += 0.02;
        ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
        ctx.beginPath();
        ctx.moveTo(A.x, A.y);
        ctx.lineTo(B.x, B.y);
        ctx.moveTo(C.x, C.y);
        ctx.lineTo(D.x, D.y);
        ctx.stroke();
        drawDot({ point: A, label: "A", ctx: ctx });
        drawDot({ point: B, label: "B", ctx: ctx });
        drawDot({ point: C, label: "C", ctx: ctx });
        drawDot({ point: D, label: "D", ctx: ctx });

        const I = getIntersection(A, B, C, D);
        if (I) {
          drawDot({ point: I, label: "I", ctx: ctx, isRed: false });
        }
      }
      requestAnimationFrame(animate);
    }
    animate();
  }
}

function getIntersection(A: Point, B: Point, C: Point, D: Point) {
  const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
  const uTop = (C.x - A.x) * (B.y - A.y) - (C.y - A.y) * (B.x - A.x);
  const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);
  if (bottom != 0) {
    const t = tTop / bottom;
    const u = uTop / bottom;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: lerp(A.x, B.x, t),
        y: lerp(A.y, B.y, t),
        offset: t,
      };
    }
  }
  return null;
}

function drawDot({
  point,
  label,
  ctx,
  isRed,
}: {
  point: {
    x: number;
    y: number;
  };
  label: string;
  ctx: CanvasRenderingContext2D;
  isRed?: boolean;
}) {
  ctx.beginPath();
  ctx.fillStyle = isRed ? "red" : "white";
  ctx.arc(point.x, point.y, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "bold 14px Arial";
  ctx.fillText(label, point.x, point.y);
}
