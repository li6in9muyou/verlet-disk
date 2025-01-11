import { it, expect } from "vitest";
import { vec2_length, vec2_scale, vec2_add, vec2_subtract } from "./main";

it("vector length, scale, add, subtract", () => {
  expect(vec2_length({ x: 3, y: 4 })).toEqual(5);
  expect(vec2_scale({ x: 3, y: 4 }, 3)).toEqual({ x: 9, y: 12 });
  expect(vec2_add({ x: 0, y: 0 }, { x: -2, y: 10 }, { x: 0, y: 0 })).toEqual({
    x: -2,
    y: 10,
  });
  expect(vec2_subtract({ x: 0, y: 0 }, { x: -2, y: 10 })).toEqual({
    x: 2,
    y: -10,
  });
});
