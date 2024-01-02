const { readLines } = require('../utils/io');
const Coordinate = require('../utils/coordinate');

/**
 * a step is unique by its
 * position
 * direction
 * steps left before a turn
 *
 * maintain edge list and memo for visited + edge
 * memo at each coordinate has
 * {left: [0 steps left, 1 step left, 2 steps left]}
 * start all array entries as undefined
 * take edge with least minHeatLoss (keep sorted)
 * check memo for min distance
 * for each possible neighboring space (exclude moving straight if stepsRemaining is 0)
 *   update memo for that space, direction & steps remaining
 *   add each of those options to edge list
 * if memo for bottom right has any entries, stop loop
 * sort edge list by minHeatLoss
 */

const VALID_DIRECTIONS_MAP = {
  [Coordinate.UP.name]: [Coordinate.RIGHT, Coordinate.LEFT],
  [Coordinate.DOWN.name]: [Coordinate.RIGHT, Coordinate.LEFT],
  [Coordinate.RIGHT.name]: [Coordinate.UP, Coordinate.DOWN],
  [Coordinate.LEFT.name]: [Coordinate.UP, Coordinate.DOWN],
};

const generateMemoItem = () => ({
  [Coordinate.UP.name]: Array(3).fill(undefined),
  [Coordinate.DOWN.name]: Array(3).fill(undefined),
  [Coordinate.LEFT.name]: Array(3).fill(undefined),
  [Coordinate.RIGHT.name]: Array(3).fill(undefined),
});

const generateMemo = lines => {
  return Array(lines.length)
    .fill(0)
    .map(() => {
      return Array(lines[0].length).fill(0).map(generateMemoItem);
    });
};

const isDone = memo =>
  Object.values(memo[memo.length - 1][memo[0].length - 1]).some(arr =>
    arr.some(Boolean),
  );

const isInBounds = (coord, map) =>
  coord.x >= 0 &&
  coord.x < map[0].length &&
  coord.y >= 0 &&
  coord.y < map.length;

const getMinHeatLoss = (node, memo) => {
  if (!node.position || !node.direction || node.stepsRemaining === undefined) {
    return 0;
  }

  return memo[node.position.y][node.position.x][node.direction.name][
    node.stepsRemaining
  ];
};

const findMinHeatLoss = (edge, heatLossMap, memo) => {
  while (!isDone(memo)) {
    const currentNode = edge.shift();

    let nextDirections = VALID_DIRECTIONS_MAP[currentNode.direction?.name] ?? [
      Coordinate.DOWN,
      Coordinate.RIGHT,
    ];
    if (currentNode.stepsRemaining) {
      nextDirections = [...nextDirections, currentNode.direction];
    }

    const nextNodes = nextDirections
      .map(direction => {
        const position = currentNode.position.add(direction);

        if (!isInBounds(position, heatLossMap)) {
          return null;
        }

        return {
          position,
          direction,
          stepsRemaining:
            direction.name === currentNode.direction?.name
              ? currentNode.stepsRemaining - 1
              : 2,
        };
      })
      .filter(Boolean)
      .filter(node => {
        const currentMin = getMinHeatLoss(node, memo);

        const potentialMin =
          getMinHeatLoss(currentNode, memo) +
          heatLossMap[node.position.y][node.position.x];

        const newMin = currentMin
          ? Math.min(currentMin, potentialMin)
          : potentialMin;

        memo[node.position.y][node.position.x][node.direction.name][
          node.stepsRemaining
        ] = newMin;

        return !currentMin;
      });

    edge = edge
      .concat(nextNodes)
      .sort(
        (node1, node2) =>
          getMinHeatLoss(node1, memo) - getMinHeatLoss(node2, memo),
      );

    x -= 1;
  }
};

x = {
  position: Coordinate,
  direction: Coordinate,
  stepsRemaining: Number,
  minHeatLoss: Number,
};

const solution = async () => {
  const lines = (await readLines('./17/input.txt')).filter(Boolean);
  const heatLossMap = lines.map(line => line.split('').map(num => Number(num)));

  const memo = generateMemo(heatLossMap);

  const startingEdge = [
    {
      position: new Coordinate(0, 0),
      minHeatLoss: 0,
    },
  ];

  findMinHeatLoss(startingEdge, heatLossMap, memo);

  //686
  console.log(memo[memo.length - 1][memo[0].length - 1]);
};

solution();
