const readLines = require('../utils/readLines');

const numberRegex = /\d+/g;
const symbolRegex = /[^\d.]/g;

const convertNumberMatch = (match, lineNumber) => {
  const value = match[0];
  return {
    lineNumber,
    start: match.index,
    end: match.index + value.length - 1,
    value: Number(value),
  };
};

const convertSymbolMatch = (match, lineNumber) => {
  const value = match[0];
  return {
    lineNumber,
    index: match.index,
    value: value,
  };
};

const isTouching = (number, symbol) => {
  return (
    Math.abs(symbol.lineNumber - number.lineNumber) <= 1 &&
    symbol.index >= number.start - 1 &&
    symbol.index <= number.end + 1
  );
};

const solution = async () => {
  const lines = await readLines('./3/input.txt');

  const numbers = lines
    .map((line, lineNumber) =>
      [...line.matchAll(numberRegex)].map(match =>
        convertNumberMatch(match, lineNumber),
      ),
    )
    .reduce((accm, lineMatches) => [...accm, ...lineMatches]);

  const symbols = lines
    .map((line, lineNumber) =>
      [...line.matchAll(symbolRegex)].map(match =>
        convertSymbolMatch(match, lineNumber),
      ),
    )
    .reduce((accm, lineMatches) => [...accm, ...lineMatches]);

  const partNumbers = numbers.filter(number => {
    return symbols.some(symbol => isTouching(number, symbol));
  });

  const sumOfPartNumbers = partNumbers
    .map(({ value }) => value)
    .reduce((a, b) => a + b, 0);

  //498559
  console.log(sumOfPartNumbers);

  const potentialGears = symbols.filter(({ value }) => value === '*');
  const gears = potentialGears
    .map(potentialGear => {
      return {
        ...potentialGear,
        touchingPartNumbers: partNumbers.filter(partNumber =>
          isTouching(partNumber, potentialGear),
        ),
      };
    })
    .filter(potentialGear => potentialGear.touchingPartNumbers.length === 2);

  const gearRatios = gears.map(
    ({ touchingPartNumbers: [{ value: value1 }, { value: value2 }] }) =>
      value1 * value2,
  );
  const sumOfGearRatios = gearRatios.reduce((a, b) => a + b, 0);

  //72246648
  console.log({ gearRatios, sumOfGearRatios });
};

solution();
