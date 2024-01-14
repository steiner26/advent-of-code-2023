const { readLines } = require('../utils/io');

const parseBrick = line => {
  const [start, end] = line.split('~');
  const [startX, startY, startZ] = start.split(',').map(num => Number(num));
  const [endX, endY, endZ] = end.split(',').map(num => Number(num));

  if (startX !== endX) {
    //X horizontal brick
    return Array(endX - startX + 1)
      .fill(0)
      .map((_, i) => ({ x: startX + i, y: startY, z: startZ }));
  }

  if (startY !== endY) {
    //Y horizontal brick
    return Array(endY - startY + 1)
      .fill(0)
      .map((_, i) => ({ x: startX, y: startY + i, z: startZ }));
  }

  if (startZ !== endZ) {
    //Z vertical brick
    return Array(endZ - startZ + 1)
      .fill(0)
      .map((_, i) => ({ x: startX, y: startY, z: startZ + i }));
  }

  //one tile brick
  return [{ x: startX, y: startY, z: startZ }];
};

const generatePlane = () => {
  return Array(10)
    .fill(0)
    .map(() => Array(10).fill(undefined));
};

const moveBricksDown = bricks => {
  const stack = Array(337)
    .fill(0)
    .map(() => generatePlane());
  bricks.forEach(({ locations, id }) => {
    locations.forEach(({ x, y, z }) => {
      stack[z][y][x] = id;
    });
  });

  let hasNotMoved = false;
  while (!hasNotMoved) {
    hasNotMoved = true;
    let movedBricks = 0;

    for (let x = 0; x <= 9; x++) {
      for (let y = 0; y <= 9; y++) {
        for (let z = 1; z <= 336; z++) {
          const brickId = stack[z][y][x];
          if (brickId !== undefined) {
            const brick = bricks[brickId];
            if (
              !brick.hasMoved &&
              brick.locations.every(location => {
                if (location.z === 1) {
                  return false;
                }
                const below = stack[location.z - 1][location.y][location.x];
                return below ? below === brickId : true;
              })
            ) {
              // move brick down
              brick.locations = brick.locations.map(location => {
                stack[location.z][location.y][location.x] = undefined;
                stack[location.z - 1][location.y][location.x] = brickId;
                return {
                  ...location,
                  z: location.z - 1,
                };
              });
              brick.hasMoved = true;
              movedBricks += 1;
              hasNotMoved = false;
            }
          }
        }
      }
    }

    bricks.forEach(brick => {
      brick.hasMoved = false;
    });
    console.log(movedBricks);
  }
  return stack;
};

const solution = async () => {
  const lines = (await readLines('./22/input.txt')).filter(Boolean);
  const bricks = lines.map((line, id) => ({
    locations: parseBrick(line),
    id: id,
    hasMoved: false,
  }));

  const settledBricks = moveBricksDown(bricks);
  console.log(bricks[6]);
};

solution();
