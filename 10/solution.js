const readLines = require('../utils/readLines');
const { writeLines } = require('../utils/io');

const VERTICAL = 'V';
const HORIZONTAL = 'H';
const BOTH = 'B';
const NOT_IN_LOOP = '.';

const ENCLOSED = 'I';

const areCoordinatesEqual = (coordinate1, coordinate2) => {
  return coordinate1.x == coordinate2.x && coordinate1.y === coordinate2.y;
};

const PIPE_TO_CONNECTION_MAP = {
  '|': ({ x, y }) => [
    { x: x, y: y + 1 },
    { x: x, y: y - 1 },
  ],
  '-': ({ x, y }) => [
    { x: x + 1, y: y },
    { x: x - 1, y: y },
  ],
  L: ({ x, y }) => [
    { x: x + 1, y: y },
    { x: x, y: y - 1 },
  ],
  J: ({ x, y }) => [
    { x: x - 1, y: y },
    { x: x, y: y - 1 },
  ],
  7: ({ x, y }) => [
    { x: x, y: y + 1 },
    { x: x - 1, y: y },
  ],
  F: ({ x, y }) => [
    { x: x, y: y + 1 },
    { x: x + 1, y: y },
  ],
  '.': () => [],
};

const getNeighboringPipes = (lines, { x, y }) => {
  return [
    { x: x, y: y + 1 },
    { x: x, y: y - 1 },
    { x: x + 1, y: y },
    { x: x - 1, y: y },
  ].map(position => ({
    position,
    pipe: lines[position.y][position.x],
  }));
};

const areSamePositions = positions => {
  if (positions.length === 0) {
    return true;
  }

  const firstPosition = positions[0].position;

  return positions.every(pos =>
    areCoordinatesEqual(firstPosition, pos.position),
  );
};

const havePassedPositions = positions => {
  const firstPosition = positions[0];
  const secondPosition = positions[1];

  return (
    areCoordinatesEqual(
      firstPosition.position,
      secondPosition.previousPosition,
    ) ||
    areCoordinatesEqual(firstPosition.previousPosition, secondPosition.position)
  );
};

const getDirectionForPipe = pipe => {
  switch (pipe) {
    case '|':
      return HORIZONTAL;
    case '-':
      return VERTICAL;
    case 'L':
    case 'J':
    case '7':
    case 'F':
      return BOTH;
    default:
      return NOT_IN_LOOP;
  }
};

const progressLoopStep = (lines, step, loopTracker) => {
  const possibleNextPositions = PIPE_TO_CONNECTION_MAP[step.pipe](
    step.position,
  );

  const nextPosition = possibleNextPositions.find(
    coord => !areCoordinatesEqual(coord, step.previousPosition),
  );
  const pipe = lines[nextPosition.y][nextPosition.x];

  loopTracker[nextPosition.y][nextPosition.x] = getDirectionForPipe(pipe);

  return {
    position: nextPosition,
    pipe,
    previousPosition: step.position,
    stepNumber: step.stepNumber + 1,
  };
};

const isPositionEnclosedByLoop = ({ x, y }, loopTracker) => {
  const tile = loopTracker[y][x];

  if (tile !== NOT_IN_LOOP) {
    return false;
  }

  let enclosedLeft = false;

  for (let i = x; i >= 0; i--) {
    if (loopTracker[y][i] === HORIZONTAL || loopTracker[y][i] === BOTH) {
      enclosedLeft = !enclosedLeft;
    }
  }

  let enclosedRight = false;

  for (let i = x; i < loopTracker[0].length; i++) {
    if (loopTracker[y][i] === HORIZONTAL || loopTracker[y][i] === BOTH) {
      enclosedRight = !enclosedRight;
    }
  }

  let enclosedUp = false;

  for (let i = y; i >= 0; i--) {
    if (loopTracker[i][x] === VERTICAL || loopTracker[i][x] === BOTH) {
      enclosedUp = !enclosedUp;
    }
  }

  let enclosedDown = false;

  for (let i = y; i < loopTracker.length; i++) {
    if (loopTracker[i][x] === VERTICAL || loopTracker[i][x] === BOTH) {
      enclosedDown = !enclosedDown;
    }
  }

  console.log(
    { enclosedLeft, enclosedRight, enclosedUp, enclosedDown },
    { x, y },
  );

  const enclosed = enclosedLeft && enclosedRight && enclosedUp && enclosedDown;
  if (enclosed) {
    loopTracker[y][x] = ENCLOSED;
  }

  return enclosed;
};

const solution = async () => {
  const lines = (await readLines('./10/input.txt')).filter(Boolean);
  const lineIndexWithStart = lines.findIndex(line => line.includes('S'));
  const indexOfStart = lines[lineIndexWithStart].indexOf('S');

  const startingCoordinate = { x: indexOfStart, y: lineIndexWithStart };

  const neighboringPipes = getNeighboringPipes(lines, startingCoordinate);
  const nextLoopPipes = neighboringPipes.filter(({ position, pipe }) => {
    const connections = PIPE_TO_CONNECTION_MAP[pipe](position);
    return connections.some(pos =>
      areCoordinatesEqual(pos, startingCoordinate),
    );
  });

  const loopTracker = Array(lines.length)
    .fill(0)
    .map(() => Array(lines[0].length).fill(NOT_IN_LOOP));

  loopTracker[startingCoordinate.y][startingCoordinate.x] = HORIZONTAL; // starting pipe is a vertical pipe |

  let loopSteps = nextLoopPipes.map(pipe => ({
    ...pipe,
    previousPosition: startingCoordinate,
    stepNumber: 1,
  }));

  loopSteps.forEach(step => {
    loopTracker[step.position.y][step.position.x] = getDirectionForPipe(
      step.pipe,
    );
  });

  while (!areSamePositions(loopSteps) || havePassedPositions(loopSteps)) {
    loopSteps = loopSteps.map(step =>
      progressLoopStep(lines, step, loopTracker),
    );
  }

  // step 7093
  console.log(loopSteps);

  let tilesEnclosedByLoop = 0;
  for (let y = 0; y < loopTracker.length; y++) {
    for (let x = 0; x < loopTracker[0].length; x++) {
      if (isPositionEnclosedByLoop({ x, y }, loopTracker)) {
        tilesEnclosedByLoop += 1;
      }
    }
  }

  writeLines(
    './10/output.txt',
    loopTracker.map(line => line.join('')).join('\n'),
  );

  console.log(tilesEnclosedByLoop);

  /** TODO part 2
   *
   * go from each piece in the cardinal directions to the edge of the area
   * and count the number of pipes you cross that are in the loop and have
   * a perpendicular component to your direction of movement. So if you are
   * moving up/down and cross a | pipe, that does not count.
   * If a tile crosses an even number of pipes in the loop, it must be outside the loop
   * and if it crosses an odd number of pipes, it must be within the loop
   *
   */
};

solution();
