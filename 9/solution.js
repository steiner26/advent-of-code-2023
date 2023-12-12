const readLines = require('../utils/readLines');

const isAllZero = array => {
  return array.every(val => val === 0);
};

const getFirstItem = array => {
  return array[0];
};

const getLastItem = array => {
  return array[array.length - 1];
};

const generateSteps = values => {
  const steps = [];
  for (let i = 0; i < values.length - 1; i++) {
    steps.push(values[i + 1] - values[i]);
  }
  return steps;
};

const predictNextValue = values => {
  const sequences = [[...values]];
  while (!isAllZero(sequences[sequences.length - 1])) {
    sequences.push(generateSteps(getLastItem(sequences)));
  }

  sequences[sequences.length - 1].push(0);
  for (let i = sequences.length - 2; i >= 0; i--) {
    const nextValue = getLastItem(sequences[i]) + getLastItem(sequences[i + 1]);
    sequences[i].push(nextValue);
  }

  return sequences[0][sequences[0].length - 1];
};

const predictPreviousValue = values => {
  const sequences = [values];
  while (!isAllZero(sequences[sequences.length - 1])) {
    sequences.push(generateSteps(getLastItem(sequences)));
  }

  sequences[sequences.length - 1].unshift(0);

  for (let i = sequences.length - 2; i >= 0; i--) {
    const previousValue =
      getFirstItem(sequences[i]) - getFirstItem(sequences[i + 1]);
    sequences[i].unshift(previousValue);
  }

  return sequences[0][0];
};

const solution = async () => {
  const lines = (await readLines('./9/input.txt')).filter(Boolean);

  const numbers = lines.map(line => line.split(' ').map(num => Number(num)));

  const nextValues = numbers.map(predictNextValue);
  const sumOfNextValues = nextValues.reduce((a, b) => a + b, 0);

  //1901217887
  console.log(sumOfNextValues);

  const previousValue = numbers.map(predictPreviousValue);
  const sumOfPreviousValues = previousValue.reduce((a, b) => a + b, 0);

  //905
  console.log(sumOfPreviousValues);
};

solution();
