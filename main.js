function vec2_length(vec2) {
  return Math.sqrt(vec2.x * vec2.x + vec2.y * vec2.y);
}

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

function renderDisk(position, extra) {
  const disk = document.createElement("div");
  disk.classList.add("disk");
  // TODO: compensate for disk radius
  disk.style.top = `${position.y - extra.size / 2}px`;
  disk.style.left = `${position.x - extra.size / 2}px`;
  document.body.appendChild(disk);
  console.log("position", position);
}

const VEC2_ZERO = { x: 0, y: 0 };
const VEC2_GRAVITY = { x: 0, y: 10 };

const dynamics = [
  new Verlet({ x: 20, y: 20 }, { x: 20, y: 20 }, VEC2_GRAVITY),
  new Verlet({ x: 300, y: 200 }, { x: 300, y: 200 }, VEC2_GRAVITY),
];

const RAMP_CENTER = { x: 200, y: 500 };
const RAMP_RADIUS = 200;

function updateOne(dt, verlet) {
  dt /= 16;

  // apply constraints
  const belowCenterOfRamp = verlet.current_position.y > RAMP_CENTER.y;
  const toRampCenter = vec2_subtract(RAMP_CENTER, verlet.current_position);
  const distanceDiskToRampCenter = vec2_length(toRampCenter);
  const outOfBounds = distanceDiskToRampCenter > RAMP_RADIUS;
  console.log("belowCenterOfRamp, outOfBounds", belowCenterOfRamp, outOfBounds);
  if (belowCenterOfRamp && outOfBounds) {
    const displacement = distanceDiskToRampCenter - RAMP_RADIUS;
    const displacementDirection = vec2_scale(
      toRampCenter,
      1 / distanceDiskToRampCenter,
    );
    console.log("calculating constraints", displacement, displacementDirection);
    verlet.current_position = vec2_add(
      verlet.current_position,
      vec2_scale(displacementDirection, displacement),
    );
  }

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

const extra = [{ size: 40 }, { size: 40 }];
dynamics.forEach((d, idx) => renderDisk(d.current_position, extra[idx]));

const ITERATION_LIMIT = 100;
let iteration = 0;
function go() {
  dynamics.forEach((v) => updateOne(16, v));
  dynamics.forEach((v, idx) => renderDisk(v.current_position, extra[idx]));
  if (iteration < ITERATION_LIMIT) {
    iteration += 1;
    requestAnimationFrame(go);
  }
}
requestAnimationFrame(go);
