/**
 * Tween a value linear.
 *
 * @param {Number} startValue - start value.
 * @param {Number} endValue - end value.
 * @param {Number} currentTime - current time (starts at 0).
 * @param {Number} duration - duration of tween.
 */
export function tweenLinear(startValue, endValue, currentTime, duration) {

  if (startValue === endValue || duration === 0) {
    return startValue;
  }

  const changeValue = endValue - startValue;

  return changeValue * currentTime / duration + startValue;
}

export function tweenEased(startValue, endValue, currentTime, duration) {

  if (startValue === endValue || duration === 0) {
    return startValue;
  }

	const changeValue = endValue - startValue;

  currentTime /= duration / 2;

	if (currentTime < 1) {
    return changeValue / 2 * currentTime * currentTime + startValue;
  }

	currentTime--;

  const value = -changeValue / 2 * (currentTime * (currentTime - 2) - 1) + startValue;

	return value;
}

export function tweenPoint(a, b, currentTime, duration, method = 'linear') {
  const tweenFunction = method === 'linear' ? tweenLinear : tweenEased;

  return {
    x: tweenFunction(a.x, b.x, currentTime, duration),
    y: tweenFunction(a.y, b.y, currentTime, duration)
  }
}
