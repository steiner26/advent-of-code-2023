const { readLines } = require('../utils/io');
const Coordinate = require('../utils/coordinate');

const ROCK = '#';

const DIRECTIONS = [
  Coordinate.UP,
  Coordinate.DOWN,
  Coordinate.LEFT,
  Coordinate.RIGHT,
];

const getStartingCoordinate = lines => {
  const y = lines.findIndex(line => line.includes('S'));
  const x = lines[y].indexOf('S');
  return new Coordinate(x, y);
};

const isInBounds = (coordinate, lines) => {
  return (
    coordinate.x >= 0 &&
    coordinate.x < lines[0].length &&
    coordinate.y >= 0 &&
    coordinate.y < lines.length
  );
};

const processSteps = (lines, start, numSteps) => {
  const pastSteps = {
    0: {
      new: [start],
      old: [],
    },
    1: {
      new: [],
      old: [],
    },
  };

  for (let i = 1; i <= numSteps; i++) {
    const nextIteration = pastSteps[i % 2];
    const priorIteration = pastSteps[(i + 1) % 2];

    for (const coord of priorIteration.new) {
      for (const direction of DIRECTIONS) {
        const nextCoord = coord.add(direction);
        if (
          isInBounds(nextCoord, lines) &&
          lines[nextCoord.y][nextCoord.x] !== ROCK &&
          !nextIteration.old.some(other => nextCoord.equals(other)) &&
          !nextIteration.new.some(other => nextCoord.equals(other))
        ) {
          nextIteration.new.push(nextCoord);
        }
      }
    }

    priorIteration.old = priorIteration.old.concat(priorIteration.new);
    priorIteration.new = [];
  }

  return pastSteps[numSteps % 2].new.concat(pastSteps[numSteps % 2].old);
};

const solution = async () => {
  const lines = (await readLines('./21/input.txt')).filter(Boolean);

  const start = getStartingCoordinate(lines);

  const possiblePlots = processSteps(lines, start, 64);

  //3820
  console.log(possiblePlots.length);
};

solution();
