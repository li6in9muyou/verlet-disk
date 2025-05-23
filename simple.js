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
function renderDisk(positions, extras) {
  if (!getParam("trace")) {
    document.querySelectorAll("div.disk").forEach((e) => e.remove());
  }
  for (let idx = 0; idx < positions.length; idx++) {
    const position = positions[idx];
    const extra = extras[idx];

    const disk = document.createElement("div");
    disk.classList.add("disk");
    disk.style.top = `${position.y - extra.height / 2}px`;
    disk.style.left = `${position.x - extra.width / 2}px`;
    disk.style.background = extra.color;
    disk.style.lineHeight = `${extra.height}px`;
    document.body.appendChild(disk);
    disk.textContent = iteration.toString();
    console.log("position at render", position);
  }
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
  new Verlet({ x: 100, y: 900 }, { x: 100, y: 950 }, VEC2_ZERO),
];

function updateOne(dt, verlet, extra) {
  const velocity = vec2_subtract(
    verlet.current_position,
    verlet.previous_position,
  );
  console.log("speed", vec2_length(velocity), velocity);

  const velocityBeforeConstraint = vec2_subtract(
    verlet.current_position,
    verlet.previous_position,
  );
  const speedBeforeConstraint = vec2_length(velocityBeforeConstraint);
  verlet.previous_position = verlet.current_position;

  const hitUpperBound =
    verlet.current_position.y + extra.height / 2 > UPPER_BOUND.y;
  const hitLowerBound =
    verlet.current_position.y - extra.height / 2 < LOWER_BOUND.y;
  if (hitUpperBound || hitLowerBound) {
    if (hitUpperBound) {
      verlet.current_position = {
        ...verlet.current_position,
        y: UPPER_BOUND.y - extra.height / 2,
      };
    } else if (hitLowerBound) {
      verlet.current_position = {
        ...verlet.current_position,
        y: LOWER_BOUND.y + extra.height / 2,
      };
    }

    const velocityAfterConstraint = vec2_subtract(
      verlet.current_position,
      verlet.previous_position,
    );
    const speedAfterConstraint = vec2_length(velocityAfterConstraint);
    const dirVelocityAfterConstraint = vec2_scale(
      velocityAfterConstraint,
      1 / speedAfterConstraint,
    );

    const diffSpeed = speedAfterConstraint - speedBeforeConstraint;
    verlet.previous_position = vec2_add(
      verlet.previous_position,
      vec2_scale(dirVelocityAfterConstraint, +1 * diffSpeed),
    );
  } else {
    verlet.current_position = vec2_add(
      verlet.current_position,
      vec2_scale(velocity, dt),
      vec2_scale(verlet.acceleration, dt * dt),
    );
    const collision = findCollision(verlet, extra, dynamics, extras);
    console.log("libq colli/fond", collision);
  }
}

const extras = [
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
  console.group(`iteration ${iteration}`);
  dynamics.forEach((v, idx) => updateOne(1, v, extras[idx]));
  renderDisk(
    dynamics.map((d) => d.current_position),
    extras,
  );
  console.groupEnd(`iteration ${iteration}`);
  if (iteration < ITERATION_LIMIT) {
    iteration += 1;
    requestAnimationFrame(sim);
  }
}
requestAnimationFrame(sim);

function findCollision(v, myExtra, allV, allExtra) {
  const myPos = v.current_position;
  const left = myPos.x - myExtra.width / 2;
  const right = myPos.x + myExtra.width / 2;
  const top = myPos.y - myExtra.height / 2;
  const bottom = myPos.y + myExtra.height / 2;

  const collideWith = [];

  for (const [index, other] of allV.entries()) {
    if (other === v) {
      continue;
    }

    const otherPos = other.current_position;
    const otherExtra = allExtra[index];

    const otherLeft = otherPos.x - otherExtra.width / 2;
    const otherRight = otherPos.x + otherExtra.width / 2;
    const otherTop = otherPos.y - otherExtra.height / 2;
    const otherBottom = otherPos.y + otherExtra.height / 2;

    console.log("libq colli", top, otherTop);
    if (
      left < otherRight &&
      right > otherLeft &&
      top < otherBottom &&
      bottom > otherTop
    ) {
      collideWith.push(other);
    }
  }

  return collideWith;
}
