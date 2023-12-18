const { readLines } = require('../utils/io');

const REMOVE = 'remove';
const ADD = 'add';

const HASH = str => {
  let val = 0;
  for (const char of str) {
    val += char.charCodeAt(0);
    val *= 17;
    val = val % 256;
  }
  return val;
};

const generateBoxes = () => {
  return Array(256)
    .fill(0)
    .map(() => []);
};

const parseStep = step => {
  if (step.includes('-')) {
    const label = step.slice(0, step.length - 1);
    return {
      operation: REMOVE,
      label,
      box: HASH(label),
    };
  }

  const [label, focalLength] = step.split('=');

  return {
    operation: ADD,
    label,
    box: HASH(label),
    focalLength: Number(focalLength),
  };
};

const processStep = (step, boxes) => {
  const targetBox = boxes[step.box];
  if (step.operation === ADD) {
    const matchingLens = targetBox.find(lens => lens.label === step.label);
    if (matchingLens) {
      matchingLens.focalLength = step.focalLength;
    } else {
      targetBox.push({ label: step.label, focalLength: step.focalLength });
    }
  }

  if (step.operation === REMOVE) {
    boxes[step.box] = targetBox.filter(lens => lens.label !== step.label);
  }
};

const getFocusingPower = (box, boxNumber) => {
  const focusingPowerPerSlot = box.map(
    (lens, lensNumber) => (boxNumber + 1) * (lensNumber + 1) * lens.focalLength,
  );

  return focusingPowerPerSlot.reduce((a, b) => a + b, 0);
};

const solution = async () => {
  const line = (await readLines('./15/input.txt'))[0];

  const steps = line.split(',');

  const hashedSteps = steps.map(HASH);

  const sumOfHashedSteps = hashedSteps.reduce((a, b) => a + b, 0);

  //507769
  console.log(sumOfHashedSteps);

  const boxes = generateBoxes();
  const parsedSteps = steps.map(parseStep);

  for (const step of parsedSteps) {
    processStep(step, boxes);
  }

  const totalFocusingPowerPerBox = boxes.map(getFocusingPower);
  const totalFocusingPower = totalFocusingPowerPerBox.reduce(
    (a, b) => a + b,
    0,
  );

  //269747
  console.log(totalFocusingPower);
};

solution();
