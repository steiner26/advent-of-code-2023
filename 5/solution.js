const readLines = require('../utils/readLines');

const mapStartIndicator = 'map';

const getMaps = lines => {
  const mapStarts = lines
    .map((line, startLine) => {
      if (line.includes(mapStartIndicator)) {
        return {
          mapName: line.split(' ')[0],
          startLine,
        };
      }
    })
    .filter(Boolean);

  return mapStarts.map(({ name, startLine }) => {
    const entries = [];
    let lineIndex = startLine + 1;
    let mapLine = lines[lineIndex];
    while (mapLine) {
      const [destinationStart, sourceStart, rangeLength] = mapLine
        .split(' ')
        .map(num => Number(num));
      entries.push({ destinationStart, sourceStart, rangeLength });
      lineIndex += 1;
      mapLine = lines[lineIndex];
    }

    return {
      name,
      startLine,
      entries,
    };
  });
};

const convertToSeedRanges = seedNumbers => {
  const reducedArray = seedNumbers.reduce(
    (accm, val) => {
      if (accm.next) {
        return {
          result: [...accm.result, { start: accm.next, rangeLength: val }],
          next: null,
        };
      }
      return { ...accm, next: val };
    },
    {
      result: [],
      next: null,
    },
  );
  return reducedArray.result;
};

//range is {start, rangeLength}
//entries is {destinationStart, sourceStart, rangeLength}
const processRangeThroughEntry = (range, entry) => {
  const entryStartIndex = entry.sourceStart - range.start;
  const entryEndIndex = entryStartIndex + entry.rangeLength;

  // console.log({ entryStartIndex, entryEndIndex });

  if (entryStartIndex <= 0 && entryEndIndex >= range.rangeLength) {
    //entry covers entire range, map completely
    return {
      mapped: [
        {
          start: entry.destinationStart,
          rangeLength: range.rangeLength,
        },
      ],
      unmapped: [],
    };
  }

  if (
    entryStartIndex <= 0 &&
    entryEndIndex > 0 &&
    entryEndIndex < range.rangeLength
  ) {
    //beginning portion of range is mapped,
    return {
      mapped: [
        {
          start: entry.destinationStart,
          rangeLength: entryEndIndex,
        },
      ],
      unmapped: [
        {
          start: range.start + entryEndIndex,
          rangeLength: range.rangeLength - entryEndIndex,
        },
      ],
    };
  }

  if (
    entryStartIndex > 0 &&
    entryStartIndex < range.rangeLength &&
    entryEndIndex >= range.rangeLength
  ) {
    //end portion of range is mapped,
    return {
      unmapped: [
        {
          start: range.start,
          rangeLength: entryStartIndex,
        },
      ],
      mapped: [
        {
          start: entry.destinationStart + entryStartIndex,
          rangeLength: range.rangeLength - entryStartIndex,
        },
      ],
    };
  }

  if (entryStartIndex > 0 && entryEndIndex < range.rangeLength) {
    //middle portion of range is mapped,
    return {
      unmapped: [
        {
          start: range.start,
          rangeLength: entryStartIndex,
        },

        {
          start: range.start + entryEndIndex,
          rangeLength: range.rangeLength - entryEndIndex,
        },
      ],
      mapped: [
        {
          start: entry.destinationStart + entryStartIndex,
          rangeLength: range.rangeLength - entryStartIndex,
        },
      ],
    };
  }

  if (entryEndIndex <= 0 || entryStartIndex >= range.rangeLength) {
    //range is completely skew to the entry, no mapping done
    return { unmapped: [range], mapped: [] };
  }

  console.log('no response!', { range, entry });
};

const processRangeThroughMap = (range, entries) => {
  let workingRanges = [range];
  let result = [];
  for (const entry of entries) {
    let newWorkingRanges = [];
    for (const workingRange of workingRanges) {
      const { mapped, unmapped } = processRangeThroughEntry(
        workingRange,
        entry,
      );
      // console.log({ workingRange, entry });
      // console.log({ result, mapped });
      // console.log({ newWorkingRanges, unmapped });
      result = result.concat(mapped);
      newWorkingRanges = newWorkingRanges.concat(unmapped);
    }
    workingRanges = newWorkingRanges;
  }

  console.log({ range, entries, result, workingRanges });

  return result.concat(workingRanges);
};

const solution = async () => {
  const lines = await readLines('./5/input.txt');

  const seedsString = lines[0];
  const seedNumbers = seedsString
    .split(': ')[1]
    .split(' ')
    .map(num => Number(num));

  const maps = getMaps(lines);

  let workingNumbers = [...seedNumbers];

  for (const map of maps) {
    workingNumbers = workingNumbers.map(number => {
      for (const {
        destinationStart,
        sourceStart,
        rangeLength,
      } of map.entries) {
        const rangeIndex = number - sourceStart;
        if (rangeIndex >= 0 && rangeIndex < rangeLength) {
          return destinationStart + rangeIndex;
        }
      }
      return number;
    });
  }

  const lowestLocation = Math.min(...workingNumbers);

  //165788812
  console.log(lowestLocation);

  const seedRanges = convertToSeedRanges(seedNumbers);

  let workingRanges = [...seedRanges];

  for (const map of maps) {
    // seed ranges can be split as they pass through maps
    workingRanges = workingRanges.flatMap(range =>
      processRangeThroughMap(range, map.entries),
    );
  }

  workingRanges.sort(({ start: start1 }, { start: start2 }) => start1 - start2);

  console.log(workingRanges);
};

solution();
