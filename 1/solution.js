const fs = require('fs');

const digitRegex = /[0-9]/g;
//TODO this does not work for overlapping digit names eg. eighthree
const digitOrWordRegex =
  /(?=[0-9]|one|two|three|four|five|six|seven|eight|nine)/g;

const WORD_TO_DIGIT_MAP = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function convertToNumber(digit) {
  if (isNumeric(digit)) {
    return Number(digit);
  }

  return WORD_TO_DIGIT_MAP[digit];
}

function calculateCalibrationDoc(lines, regex) {
  const digitMatches = lines.map(line => [...line.matchAll(regex)]);
  console.log(digitMatches[0]);

  const lineValues = digitMatches.map(
    matches =>
      10 * convertToNumber(matches[0]) +
      convertToNumber(matches[matches.length - 1]),
  );
  console.log([...lineValues.slice(0, 10)]);

  return lineValues.reduce((a, b) => a + b, 0);
}

fs.readFile(
  './1/adventofcode.com_2023_day_1_input.txt',
  'utf8',
  (err, data) => {
    if (err) throw err;

    const inputLines = data.split('\n').filter(line => Boolean(line));

    //54940
    console.log(calculateCalibrationDoc(inputLines, digitRegex));

    console.log(calculateCalibrationDoc(inputLines, digitOrWordRegex));
  },
);
