export function* range(start: number, stop?: number, step = 1) {
  let loopStart = start;
  let loopEnd = stop || 0;

  if (stop === undefined) {
    [loopStart, loopEnd] = [0, start];
  }

  if (!step) {
    throw new RangeError('range() step argument invalid');
  }

  if (step > 0) {
    while (loopStart < loopEnd) {
      yield loopStart;
      loopStart += step;
    }
  } else if (step < 0) {
    while (loopStart > loopEnd) {
      yield loopStart;
      loopStart += step;
    }
  }
}

export function inRange(n: number, lower: number, upper?: number) {
  if (upper === undefined) {
    return n >= 0 && n <= lower;
  }
  return n >= lower && n <= upper;
}

export function clamp(n: number, min = 0, max?: number) {
  if (max === undefined) {
    return Math.min(Math.max(n, 0), min);
  }
  return Math.min(Math.max(n, min), max);
}
