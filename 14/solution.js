const { readLines, writeLines } = require('../utils/io');

const ROUNDED = 'O';
const CUBE = '#';
const EMPTY = '.';

const slideRocksUp = lines => {
  const result = Array(lines.length)
    .fill(0)
    .map(() => Array(lines[0].length).fill(EMPTY));

  for (let x = 0; x < lines[0].length; x++) {
    let nextStoppingPoint = 0;
    let numRocksToSlide = 0;
    for (let y = 0; y < lines.length; y++) {
      const rockAtTile = lines[y][x];
      switch (rockAtTile) {
        case ROUNDED:
          numRocksToSlide += 1;
          break;
        case CUBE:
          for (let i = 0; i < numRocksToSlide; i++) {
            result[nextStoppingPoint + i][x] = ROUNDED;
          }
          nextStoppingPoint = y + 1;
          numRocksToSlide = 0;
          result[y][x] = CUBE;
          break;
        default:
          break;
      }
    }

    if (numRocksToSlide > 0) {
      for (let i = 0; i < numRocksToSlide; i++) {
        result[nextStoppingPoint + i][x] = ROUNDED;
      }
    }
  }

  return result.map(line => line.join(''));
};

const calculateLoad = rocks => {
  const loadPerLine = rocks.map((row, i) => {
    return (
      (row.match(new RegExp(ROUNDED, 'g')) || []).length * (rocks.length - i)
    );
  });

  console.log(loadPerLine);

  return loadPerLine.reduce((a, b) => a + b, 0);
};

const solution = async () => {
  const lines = (await readLines('./14/input.txt')).filter(Boolean);

  const movedRocks = slideRocksUp(lines);

  const load = calculateLoad(movedRocks);

  writeLines('./14/output.txt', movedRocks.join('\n'));

  //109654
  console.log(load);
};

solution();
