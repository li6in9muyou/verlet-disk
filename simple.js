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
  if (!getParam("trace")) {
    document.querySelectorAll("div.disk").forEach((e) => e.remove());
  }
  const disk = document.createElement("div");
  disk.classList.add("disk");
  disk.style.top = `${position.y - extra.height / 2}px`;
  disk.style.left = "50%";
  disk.style.background = extra.color;
  disk.style.lineHeight = `${extra.height}px`;
  document.body.appendChild(disk);
  disk.textContent = iteration.toString();
  console.log("position at render", position);
}

const VEC2_ZERO = { x: 0, y: 0 };

const LOWER_BOUND = { x: 0, y: 50 };
const UPPER_BOUND = { x: 0, y: 1000 };

function renderBound(bound) {
  document.querySelectorAll("div.disk").forEach((e) => e.remove());
  const disk = document.createElement("div");
  disk.classList.add("bound");
  disk.style.top = `${bound.y}px`;
  disk.style.left = 0;
  document.body.appendChild(disk);
}
renderBound(LOWER_BOUND);
renderBound(UPPER_BOUND);

const dynamics = [
  new Verlet({ x: 100, y: 150 }, { x: 100, y: 100 }, VEC2_ZERO),
];

function updateOne(dt, verlet, extra) {
  const velocity = vec2_subtract(
    verlet.current_position,
    verlet.previous_position,
  );
  console.log("speed", vec2_length(velocity), velocity);

  verlet.previous_position = verlet.current_position;

  if (verlet.current_position.y + extra.height / 2 > UPPER_BOUND.y) {
    verlet.current_position = {
      ...verlet.current_position,
      y: UPPER_BOUND.y - extra.height / 2,
    };
  } else if (verlet.current_position.y - extra.height / 2 < LOWER_BOUND.y) {
    verlet.current_position = {
      ...verlet.current_position,
      y: LOWER_BOUND.y + extra.height / 2,
    };
  } else {
    verlet.current_position = vec2_add(
      verlet.current_position,
      vec2_scale(velocity, dt),
      vec2_scale(verlet.acceleration, dt * dt),
    );
  }
}

const extra = [
  { width: 40, height: 80, color: "red" },
  { width: 40, height: 80, color: "green" },
];

function getParam(paramName) {
  const urlParams = new URLSearchParams(window.location.search);

  if (urlParams.has(paramName)) {
    const value = urlParams.get(paramName);
    if (value === "") {
      return true;
    }
    return value;
  }

  return null;
}

const ITERATION_LIMIT = getParam("limit") ?? 21;
function sim() {
  console.groupCollapsed(`iteration ${iteration}`);
  dynamics.forEach((v, idx) => updateOne(1, v, extra[idx]));
  dynamics.forEach((v, idx) => renderDisk(v.current_position, extra[idx]));
  console.groupEnd(`iteration ${iteration}`);
  if (iteration < ITERATION_LIMIT) {
    iteration += 1;
    requestAnimationFrame(sim);
  }
}
requestAnimationFrame(sim);
