// const colors = ["#ECA400", "#343434"];

let sections = [];
let canvas = null;
let wheels = null;
let frame = null;
let angle = -0.1;
let running = false;
let winSection = 0;
let csz = null;

export function drawWheel(canvasElement, customSections) {
  canvas = canvasElement;
  sections = customSections || [];
  repaint(angle);
}

export async function spinWheel() {
  if (!running) {
    return await spinTo((Math.random() * sections.length) | 0, 5000);
  }
}

function getSize() {
  const { width, height } = canvas.getBoundingClientRect();
  return {
    innerWidth: width,
    innerHeight: height,
  };
}

function repaint(angle) {
  const { innerWidth } = getSize();
  // let r = (Math.min(innerWidth, innerHeight) / 2.35) | 0;
  const r = (innerWidth / 2.35) | 0;
  if (wheels === null) {
    wheels = [];
    for (let selected = 0; selected < sections.length; selected++) {
      let wheel = document.createElement("canvas");
      wheel.width = wheel.height = 2 * r + 10;
      let ctx = wheel.getContext("2d"),
        cx = 5 + r,
        cy = 5 + r;

      let g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, "#fbff1c");
      g.addColorStop(1, "#ECA400");
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, 2 * Math.PI, false);
      ctx.fillStyle = g;
      ctx.fill();
      for (let i = 0; i < sections.length; i++) {
        let a0 = (2 * Math.PI * i) / sections.length;
        a0 = (a0 + (3 * Math.PI) / 2) % (2 * Math.PI);

        let a1 = a0 + (2 * Math.PI) / (i == 0 ? 1 : sections.length);
        a1 = a1 % (2 * Math.PI);

        let a = (2 * Math.PI * (i + 0.5)) / sections.length;
        // if (a0 === a1) a1 = a0 + 2 * Math.PI;

        if (i % 2 === 1) {
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.arc(cx, cy, r, a0, a1, false);
          ctx.fillStyle = "#343434";
          ctx.fill();
        }

        ctx.save();

        ctx.fillStyle = "#FFF";
        ctx.font = "bold " + (r / sections.length) * 1.5 + "px serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.translate(cx, cy);
        if (sections[i].length > 3) {
          ctx.rotate(a - (Math.PI / 2) * 3);
          ctx.fillText(sections[i], -r * 0.56, 0);
        } else {
          ctx.rotate(a);
          ctx.fillText(sections[i], 0, -r * 0.8);
        }
        ctx.restore();
      }
      wheels.push(wheel);
    }
  }
  if (frame === null) {
    frame = document.createElement("canvas");
    frame.width = frame.height = (10 + 2 * r * 1.25) | 0;
    let ctx = frame.getContext("2d"),
      cx = frame.width / 2,
      cy = frame.height / 2;
    ctx.shadowOffsetX = r / 80;
    ctx.shadowOffsetY = r / 80;
    ctx.shadowBlur = r / 40;
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.05, 0, 2 * Math.PI, true);
    ctx.arc(cx, cy, r * 0.95, 0, 2 * Math.PI, false);
    ctx.fillStyle = "#949494";
    ctx.fill();

    ctx.translate(cx, cy);
    ctx.rotate(Math.PI / 2);
    ctx.beginPath();
    // ctx.moveTo(-r * 1.1, -r * 0.05);
    // ctx.lineTo(-r * 0.9, 0);
    // ctx.lineTo(-r * 1.1, r * 0.05);
    ctx.arc(
      -r * 1.07,
      -r * 0.01,
      r * 0.07,
      Math.PI / 2,
      (Math.PI * 3) / 2,
      false
    );
    ctx.lineTo(-r * 0.9, -r * 0.01);
    // ctx.fillStyle = "#F44";
    let g = ctx.createLinearGradient(
      -r * (1.07 + 0.07),
      -r * 0.01,
      -r * 0.9,
      -r * 0.01
    );
    g.addColorStop(0, "#72A0C1");
    g.addColorStop(0.5, "#002244");
    ctx.fillStyle = g;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-r * 1.08, -r * 0.01, r * 0.035, 0, 2 * Math.PI);
    ctx.fillStyle = "#FFF";
    ctx.fill();
  }
  canvas.width = innerWidth;
  canvas.height = innerWidth;
  let cx = innerWidth / 2,
    cy = cx;
  let ctx = canvas.getContext("2d");
  winSection =
    Math.floor((-angle * sections.length) / (2 * Math.PI)) % sections.length;
  if (winSection < 0) winSection += sections.length;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  ctx.translate(-wheels[winSection].width / 2, -wheels[winSection].height / 2);
  ctx.drawImage(wheels[winSection], 0, 0);
  ctx.restore();
  ctx.drawImage(frame, cx - frame.width / 2, cy - frame.height / 2);
}

async function spinTo(winner, duration) {
  return new Promise((resolve) => {
    let final_angle = ((0.5 + winner) * 2 * Math.PI) / sections.length;
    let start_angle =
      angle - Math.floor(angle / (2 * Math.PI)) * 2 * Math.PI - 5 * 2 * Math.PI;
    let start = performance.now();
    function frame() {
      let now = performance.now();
      let t = Math.min(1, (now - start) / duration);
      t = 3 * t * t - 2 * t * t * t; // ease in out
      angle = start_angle + t * (final_angle - start_angle);
      repaint(angle);
      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        running = false;
        resolve(winSection);
      }
    }
    requestAnimationFrame(frame);
    running = true;
  });
}

setInterval(function () {
  const { innerWidth, innerHeight } = getSize();
  let sz = innerWidth + "/" + innerHeight;
  if (csz !== sz) {
    csz = sz;
    wheels = frame = null;
    repaint(angle);
  }
}, 10);
