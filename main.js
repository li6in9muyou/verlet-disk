function vec2_add(lhs, rhs) {
  return { x: lhs.x + rhs.x, y: lhs.y + rhs.y };
}

function vec2_subtract(lhs, rhs) {
  return { x: lhs.x - rhs.x, y: lhs.y - rhs.y };
}

class Verlet {
  current_position;
  previous_position;
  acceleration;
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

renderDisk({ x: 200, y: 200 });
renderDisk({ x: 0, y: 0 });
