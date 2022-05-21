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
