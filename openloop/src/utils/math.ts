export const clamp = (value: number, min: number, max: number) => {
  return Math.max(min, Math.min(max, value));
};

export const lerp = (start: number, end: number, t: number) => {
  return start + (end - start) * t;
};

export const normalize = (value: number, min: number, max: number) => {
  return clamp((value - min) / (max - min), 0, 1);
};

export const mapRange = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
) => {
  return lerp(outMin, outMax, normalize(value, inMin, inMax));
};
