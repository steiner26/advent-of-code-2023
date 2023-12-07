const readLines = require('../utils/readLines');

const parseNumbers = arr => {
  return arr
    .split(' ')
    .filter(Boolean)
    .map(num => Number(num));
};

const getRaceSolutions = race => {
  const b = race.time;
  const c = -race.distance;

  const sqrtDiscriminant = Math.sqrt(b * b + 4 * c);

  const root1 = (-b + sqrtDiscriminant) / -2;
  const root2 = (-b - sqrtDiscriminant) / -2;

  const minSolution = Math.ceil(root1);
  const maxSolution = Math.floor(root2);

  return { ...race, numSolutions: maxSolution - minSolution + 1 };
};

const solution = async () => {
  const lines = await readLines('./6/input.txt');

  const times = parseNumbers(lines[0].split(':')[1]);

  const distances = parseNumbers(lines[1].split(':')[1]);

  const races = times.map((time, i) => ({ time, distance: distances[i] }));

  //solve for roots of -x^2 + tx - d
  //where x is time spent holding button, t is total time for race and d is required distance
  //round smaller root R1 up, round larger root R2 down
  //there are R2 - R1 + 1 integer solutions
  const raceSolutions = races.map(getRaceSolutions);

  const marginOfError = raceSolutions.reduce(
    (accm, race) => accm * race.numSolutions,
    1,
  );

  //1312850
  console.log(marginOfError);

  const bigRaceTime = times.map(num => String(num)).join('');
  const bigRaceDistance = distances.map(num => String(num)).join('');

  const bigRaceSolutions = getRaceSolutions({
    time: bigRaceTime,
    distance: bigRaceDistance,
  });

  //36749103
  console.log(bigRaceSolutions.numSolutions);
};

solution();
