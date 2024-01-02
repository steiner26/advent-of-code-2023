const { readLines } = require('../utils/io');
const Coordinate = require('../utils/coordinate');

const DIRECTION_TO_COORDINATE_NAME_MAP = {
  R: 'RIGHT',
  D: 'DOWN',
  L: 'LEFT',
  U: 'UP',
};

const parseDigInstruction = line => {
  const [directionString, lengthString, colorString] = line.split(' ');
  const color = colorString.slice(2, 8);
  const length = Number(lengthString);
  const direction = DIRECTION_TO_COORDINATE_NAME_MAP[directionString];

  return { color, direction, length };
};

const parseNewDigInstruction = line => {
  const [_, __, colorString] = line.split(' ');
  const color = colorString.slice(2, 8);
  const length = Number.parseInt(color.slice(0, 5), 16);
  const direction = Object.values(DIRECTION_TO_COORDINATE_NAME_MAP)[color[5]];
  return { color, direction, length };
};

const processInstructions = instructions => {
  const dugTrench = [];
  let currentCoord = new Coordinate(0, 0);
  for (const { color, direction, length } of instructions) {
    console.log('digging', color);
    const step = Coordinate[direction];
    for (let i = 0; i < length; i++) {
      currentCoord = currentCoord.add(step);
      dugTrench.push({ color, position: currentCoord, direction });
    }
  }

  const middleOfTrench = [];
  let currentDirection = undefined;
  // inside of trench starts up from the first instruction
  let checkingDirection = Coordinate.UP;
  let i = 0;
  for (const { color, direction, length } of instructions) {
    console.log('filling', color);
    if (currentDirection) {
      const angle = currentDirection.angle(direction);
      currentDirection = direction;
      checkingDirection = checkingDirection.rotate(angle);
    }
    currentDirection = Coordinate[direction];
    // console.log({ currentDirection, checkingDirection });

    for (let j = 0; j < length; j++) {
      const trenchPosition = dugTrench[i].position;
      let middlePosition = trenchPosition.add(checkingDirection);
      while (
        !dugTrench.some(({ position }) => position.equals(middlePosition))
      ) {
        if (!middleOfTrench.some(position => position.equals(middlePosition))) {
          middleOfTrench.push(middlePosition);
        }
        middlePosition = middlePosition.add(checkingDirection);
      }
      i++;
    }
  }

  return dugTrench.length + middleOfTrench.length;
};

const solution = async () => {
  const lines = (await readLines('./18/input.txt')).filter(Boolean);
  const instructions = lines.map(parseDigInstruction);

  //72821
  // console.log(processInstructions(instructions));

  const newInstructions = lines.map(parseNewDigInstruction);
  // node runs out of memory!!!!
  console.log(processInstructions(newInstructions));
};

solution();
