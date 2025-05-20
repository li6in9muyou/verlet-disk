export function vec2_length(vec2) {
  return Math.sqrt(vec2.x * vec2.x + vec2.y * vec2.y);
}

export function vec2_scale(vec2, scale) {
  return { x: vec2.x * scale, y: vec2.y * scale };
}

export function vec2_add(...operands) {
  return operands.reduce(
    (sum, operand) => {
      sum.x += operand.x;
      sum.y += operand.y;
      return sum;
    },
    { x: 0, y: 0 },
  );
}

export function vec2_subtract(lhs, rhs) {
  return { x: lhs.x - rhs.x, y: lhs.y - rhs.y };
}

class Verlet {
  current_position;
  previous_position;
  acceleration;
  constructor(curr, prev, acc) {
    this.current_position = curr;
    this.previous_position = prev;
    this.acceleration = acc;
  }
}

let iteration = 0;
function renderDisk(position, extra) {
  // document.querySelectorAll("div.disk").forEach((e) => e.remove());
  const disk = document.createElement("div");
  disk.classList.add("disk");
  disk.style.top = `${position.y - extra.height / 2}px`;
  disk.style.left = "50%";
  disk.style.background = extra.color;
  document.body.appendChild(disk);
  disk.textContent = iteration.toString();
  console.log("position at render", position);
}

const VEC2_ZERO = { x: 0, y: 0 };

const dynamics = [
  new Verlet({ x: 100, y: 150 }, { x: 100, y: 100 }, VEC2_ZERO),
];

function updateOne(dt, verlet) { }

const extra = [
  { width: 40, height: 80, color: "red" },
  { width: 40, height: 80, color: "green" },
];

const ITERATION_LIMIT = 30;
function sim() {
  console.groupCollapsed(`iteration ${iteration}`);
  dynamics.forEach((v) => updateOne(1, v));
  dynamics.forEach((v, idx) => renderDisk(v.current_position, extra[idx]));
  console.groupEnd(`iteration ${iteration}`);
  if (iteration < ITERATION_LIMIT) {
    iteration += 1;
    requestAnimationFrame(sim);
  }
}
requestAnimationFrame(sim);
