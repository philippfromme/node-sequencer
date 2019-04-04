const MEASURES = 16;

function zeros(length) {
  let array = [];

  for(let i = 0; i < length; i++) {
    array = [ ...array, 0 ];
  }

  return array;
}

export function getStepIndex(distance, maxDistance, offsetDistance, timeSignature) {
  let stepIndex = Math.floor(MEASURES / (maxDistance - offsetDistance) * distance);

  stepIndex = Math.min(stepIndex, 15);

  // time signature 1/2 -> length = 8
  // time signature 1/4 -> length = 4
  // time signature 1/8 -> length = 2
  // time signature 1/16 -> length = 1
  const length = MEASURES / timeSignature;

  // index 10, time signature 1/2 -> index = Math.floor(10 / 8) * 8 -> 8
  // index 10, time signature 1/8 -> index = Math.floor(10 / 2) * 2 -> 10
  return Math.floor(stepIndex / length) * length;
}

export function getSequence(distance, maxDistance, offsetDistance, timeSignature) {
  const sequence = zeros(MEASURES);

  const stepIndex = getStepIndex(distance, maxDistance, offsetDistance, timeSignature);

  sequence[stepIndex] = 1;

  return sequence;
}

export function getSequenceFromSequences(sequences) {
  const sequence = zeros(MEASURES);

  Object.values(sequences).forEach(value => {

    value.forEach((step, index) => {
      sequence[index] = step ? step : sequence[index];
    });

  });

  return sequence;
}
