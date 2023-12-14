const readLines = require('../utils/readLines');

const OPERATIONAL = '.';
const DAMAGED = '#';
const UNKNOWN = '?';

const sumNumbers = nums => nums.reduce((a, b) => a + b, 0);

const getMinSpaceForGroups = groupSizes => {
  if (groupSizes.length === 0) {
    return 0;
  }

  return sumNumbers(groupSizes) + groupSizes.length - 1;
};

const parseSprings = line => {
  const [springs, groupsString] = line.split(' ');
  const groupSizes = groupsString.split(',').map(num => Number(num));

  return { springs, groupSizes };
};

const duplicateFiveTimes = ({ springs, groupSizes }) => {
  return {
    springs: Array(5).fill(springs).join(UNKNOWN),
    groupSizes: Array(5)
      .fill(groupSizes)
      .flatMap(x => x),
  };
};

const generateMemo = size => {
  return Array(size + 1)
    .fill()
    .map(() => ({}));
};

const checkSprings = ({ springs, groupSizes }, memo) => {
  const memoizedResult = memo[groupSizes.length][springs];
  if (memoizedResult !== undefined) {
    return memoizedResult;
  }

  if (groupSizes.length === 0) {
    if (springs.includes(DAMAGED)) {
      memo[groupSizes.length][springs] = 0;
      return 0;
    }
    memo[groupSizes.length][springs] = 1;
    return 1;
  }

  const minimumSpaceNeeded = getMinSpaceForGroups(groupSizes);
  const firstGroupSize = groupSizes[0];
  let sumOfOptions = 0;
  for (let i = 0; i <= springs.length - minimumSpaceNeeded; i++) {
    //if any operating springs in groupsize springs from start, do nothing
    if (springs.slice(i, i + firstGroupSize).includes(OPERATIONAL)) {
      continue;
    }

    //if any spring before this is group is damaged, do nothing
    if (springs.slice(0, i).includes(DAMAGED)) {
      memo[groupSizes.length][springs] = sumOfOptions;
      return sumOfOptions;
    }

    //if spring after this group is damaged, do nothing
    if (springs.charAt(i + firstGroupSize) === DAMAGED) {
      continue;
    }

    //place group at start and check rest
    sumOfOptions += checkSprings(
      {
        springs: springs.slice(i + firstGroupSize + 1),
        groupSizes: groupSizes.slice(1),
      },
      memo,
    );
  }

  memo[groupSizes.length][springs] = sumOfOptions;
  return sumOfOptions;
};

const solution = async () => {
  const lines = (await readLines('./12/input.txt')).filter(Boolean);

  const springRows = lines.map(parseSprings);
  const validArrangements = springRows.map(springs =>
    checkSprings(springs, generateMemo(springs.groupSizes.length)),
  );
  const sumOfValidArrangements = sumNumbers(validArrangements);

  //6871
  console.log(sumOfValidArrangements);

  const fiveSpringRows = springRows.map(duplicateFiveTimes);
  const fiveTimeValidArrangements = fiveSpringRows.map(springs =>
    checkSprings(springs, generateMemo(springs.groupSizes.length)),
  );
  const fiveTimeSumOfValidArrangements = sumNumbers(fiveTimeValidArrangements);

  //2043098029844
  console.log(fiveTimeSumOfValidArrangements);
};

solution();
