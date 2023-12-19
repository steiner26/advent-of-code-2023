const Coordinate = require('../utils/coordinate');
const { readLines } = require('../utils/io');

const ENCOUNTER_TO_REDIRECTS_MAP = {
  ['.']: {
    [Coordinate.LEFT.name]: [Coordinate.LEFT],
    [Coordinate.RIGHT.name]: [Coordinate.RIGHT],
    [Coordinate.UP.name]: [Coordinate.UP],
    [Coordinate.DOWN.name]: [Coordinate.DOWN],
  },
  ['\\']: {
    [Coordinate.LEFT.name]: [Coordinate.UP],
    [Coordinate.RIGHT.name]: [Coordinate.DOWN],
    [Coordinate.UP.name]: [Coordinate.LEFT],
    [Coordinate.DOWN.name]: [Coordinate.RIGHT],
  },
  ['/']: {
    [Coordinate.LEFT.name]: [Coordinate.DOWN],
    [Coordinate.RIGHT.name]: [Coordinate.UP],
    [Coordinate.UP.name]: [Coordinate.RIGHT],
    [Coordinate.DOWN.name]: [Coordinate.LEFT],
  },
  ['|']: {
    [Coordinate.LEFT.name]: [Coordinate.UP, Coordinate.DOWN],
    [Coordinate.RIGHT.name]: [Coordinate.UP, Coordinate.DOWN],
    [Coordinate.UP.name]: [Coordinate.UP],
    [Coordinate.DOWN.name]: [Coordinate.DOWN],
  },
  ['-']: {
    [Coordinate.LEFT.name]: [Coordinate.LEFT],
    [Coordinate.RIGHT.name]: [Coordinate.RIGHT],
    [Coordinate.UP.name]: [Coordinate.LEFT, Coordinate.RIGHT],
    [Coordinate.DOWN.name]: [Coordinate.LEFT, Coordinate.RIGHT],
  },
};

const generateMemo = lines => {
  return Array(lines.length)
    .fill(0)
    .map(() =>
      Array(lines[0].length)
        .fill(0)
        .map(() => []),
    );
};

const generateAllStartingBeams = lines => {
  return [
    Array(lines.length)
      .fill(0)
      .map((_, y) => ({
        position: new Coordinate(0, y),
        direction: Coordinate.RIGHT,
        step: 0,
      })),

    Array(lines.length)
      .fill(0)
      .map((_, y) => ({
        position: new Coordinate(lines[0].length - 1, y),
        direction: Coordinate.LEFT,
        step: 0,
      })),

    Array(lines[0].length)
      .fill(0)
      .map((_, x) => ({
        position: new Coordinate(x, 0),
        direction: Coordinate.DOWN,
        step: 0,
      })),

    Array(lines[0].length)
      .fill(0)
      .map((_, x) => ({
        position: new Coordinate(x, lines.length - 1),
        direction: Coordinate.UP,
        step: 0,
      })),
  ].flatMap(x => x);
};

const isRepeatBeam = (beam, memo) => {
  const pastBeamsAtLocation = memo[beam.position.y][beam.position.x];
  return pastBeamsAtLocation.some(
    pastBeam => pastBeam.direction === beam.direction,
  );
};

const isInBounds = (beam, lines) => {
  return (
    beam.position.x >= 0 &&
    beam.position.x < lines[0].length &&
    beam.position.y >= 0 &&
    beam.position.y < lines.length
  );
};

const processBeam = (beam, lines, memo) => {
  memo[beam.position.y][beam.position.x].push(beam);

  const encounter = lines[beam.position.y][beam.position.x];

  const newDirections =
    ENCOUNTER_TO_REDIRECTS_MAP[encounter][beam.direction.name];

  return newDirections.map(direction => ({
    position: beam.position.add(direction),
    direction,
    step: beam.step + 1,
  }));
};

const processBeams = (startingBeam, lines) => {
  const memo = generateMemo(lines);
  let activeBeams = [startingBeam];

  while (activeBeams.length > 0) {
    const newActiveBeams = activeBeams.flatMap(beam =>
      processBeam(beam, lines, memo),
    );

    activeBeams = newActiveBeams.filter(
      beam => isInBounds(beam, lines) && !isRepeatBeam(beam, memo),
    );
  }

  return memo
    .map(line =>
      line.map(cell => (cell.length > 0 ? 1 : 0)).reduce((a, b) => a + b, 0),
    )
    .reduce((a, b) => a + b, 0);
};

const solution = async () => {
  const lines = (await readLines('./16/input.txt')).filter(Boolean);

  const startingBeam = {
    position: new Coordinate(0, 0),
    direction: Coordinate.RIGHT,
    step: 0,
  };

  const illuminatedCells = processBeams(startingBeam, lines);

  //7623
  console.log(illuminatedCells);

  const allPossibleStartingBeams = generateAllStartingBeams(lines);
  const illuminatedPerStartingBeam = allPossibleStartingBeams.map(beam => ({
    ...beam,
    illuminatedCells: processBeams(beam, lines),
  }));

  const sortedIlluminatedPerBeam = illuminatedPerStartingBeam.sort(
    (beam1, beam2) => beam2.illuminatedCells - beam1.illuminatedCells,
  );

  //8244 from (104, 109) moving UP
  console.log(sortedIlluminatedPerBeam[0].illuminatedCells);
};

solution();
