const readLines = require('../utils/readLines');

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

const progressLoopStep = (lines, step) => {
  const possibleNextPositions = PIPE_TO_CONNECTION_MAP[step.pipe](
    step.position,
  );

  const nextPosition = possibleNextPositions.find(
    coord => !areCoordinatesEqual(coord, step.previousPosition),
  );
  return {
    position: nextPosition,
    pipe: lines[nextPosition.y][nextPosition.x],
    previousPosition: step.position,
    stepNumber: step.stepNumber + 1,
  };
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

  let loopSteps = nextLoopPipes.map(pipe => ({
    ...pipe,
    previousPosition: startingCoordinate,
    stepNumber: 1,
  }));

  while (!areSamePositions(loopSteps) || havePassedPositions(loopSteps)) {
    loopSteps = loopSteps.map(step => progressLoopStep(lines, step));
  }

  // step 7093
  console.log(loopSteps);
};

solution();
