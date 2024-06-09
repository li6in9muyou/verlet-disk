function vec2_scale(vec2, scale) {
  return { x: vec2.x * scale, y: vec2.y * scale };
}

function vec2_add(...operands) {
  return operands.reduce(
    (sum, operand) => {
      sum.x += operand.x;
      sum.y += operand.y;
      return sum;
    },
    { x: 0, y: 0 },
  );
}

function vec2_subtract(lhs, rhs) {
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

function renderDisk(position) {
  const disk = document.createElement("div");
  disk.classList.add("disk");
  // TODO: compensate for disk radius
  disk.style.top = `${position.y}px`;
  disk.style.left = `${position.x}px`;
  document.body.appendChild(disk);
  console.log("position", position);
}

const VEC2_ZERO = { x: 0, y: 0 };
const VEC2_GRAVITY = { x: 0, y: 10 };

const dynamics = [
  new Verlet({ x: 0, y: 0 }, { x: 0, y: 0 }, VEC2_GRAVITY),
  new Verlet({ x: 200, y: 200 }, { x: 200, y: 200 }, VEC2_GRAVITY),
];

function updateOne(dt, verlet) {
  const velocity = vec2_subtract(
    verlet.current_position,
    verlet.previous_position,
  );
  const next_position = vec2_add(
    verlet.current_position,
    vec2_scale(velocity, dt),
    vec2_scale(verlet.acceleration, dt * dt),
  );

  verlet.previous_position = verlet.current_position;
  verlet.current_position = next_position;
}

renderDisk({ x: 200, y: 200 });
renderDisk({ x: 0, y: 0 });

const ITERATION_LIMIT = 100;
let iteration = 0;
function go() {
  dynamics.forEach((v) => updateOne(16, v));
  dynamics.forEach((v) => renderDisk(v.current_position));
  if (iteration < ITERATION_LIMIT) {
    iteration += 1;
    requestAnimationFrame(go);
  }
}
requestAnimationFrame(go);
