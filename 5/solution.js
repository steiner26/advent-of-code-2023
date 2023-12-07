const readLines = require('../utils/readLines');

const mapStartIndicator = 'map';

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

const solution = async () => {
  const lines = await readLines('./5/input.txt');

  const seedsString = lines[0];
  const seedNumbers = seedsString
    .split(': ')[1]
    .split(' ')
    .map(num => Number(num));

  const maps = lines
    .map((line, startLine) => {
      if (line.includes(mapStartIndicator)) {
        return {
          mapName: line.split(' ')[0],
          startLine,
        };
      }
    })
    .filter(Boolean);

  let workingNumbers = [...seedNumbers];

  for (const map of maps) {
    workingNumbers = workingNumbers.map(number => {
      let lineIndex = map.startLine + 1;
      let mapLine = lines[lineIndex];
      while (mapLine) {
        const [destinationStart, sourceStart, rangeLength] = mapLine
          .split(' ')
          .map(num => Number(num));
        const rangeIndex = number - sourceStart;
        if (rangeIndex >= 0 && rangeIndex < rangeLength) {
          return destinationStart + rangeIndex;
        }
        lineIndex += 1;
        mapLine = lines[lineIndex];
      }
      return number;
    });
  }

  const lowestLocation = Math.min(...workingNumbers);

  //165788812
  console.log(lowestLocation);

  const seedRanges = convertToSeedRanges(seedNumbers);

  //TODO this is a mess

  // seed ranges can be split as they pass through maps
  let workingRanges = [...seedRanges];

  for (const map of maps) {
    console.log(map);
    const newWorkingRanges = [];
    workingRanges.forEach(range => {
      //go through the map and convert portions of the range if needed
      //a map entry can potentially cut the current range in two
      let currentRanges = [range];

      let lineIndex = map.startLine + 1;
      let mapLine = lines[lineIndex];
      while (mapLine) {
        const newCurrentRanges = [];
        const [
          mapEntryDestinationStart,
          mapEntrySourceStart,
          mapEntryRangeLength,
        ] = mapLine.split(' ').map(num => Number(num));

        //process all current ranges against this map entry
        //if an entire range matches the map entry, remove it and add the mapped range to newWorkingRanges
        //if a portion matches, add the mapped portion to newWorkingRanges and add any remaining portions to currentRanges
        currentRanges.forEach(currentRange => {
          if (
            mapEntrySourceStart <= currentRange.start &&
            mapEntrySourceStart + mapEntryRangeLength >=
              currentRange.start + currentRange.rangeLength
          ) {
            //entire source range is mapped by map entry
            newWorkingRanges.push({
              start: mapEntryDestinationStart,
              rangeLength: currentRange.rangeLength,
            });
            return;
          }
          if (
            mapEntrySourceStart <= currentRange.start &&
            mapEntrySourceStart + mapEntryRangeLength > currentRange.start
          ) {
            //first portion of the range is mapped by the map entry
            const rangeBorderIndex = mapEntrySourceStart + mapEntryRangeLength;

            newWorkingRanges.push({
              start: mapEntryDestinationStart,
              rangeLength: rangeBorderIndex - currentRange.start,
            });
            currentRanges.push({
              start: rangeBorderIndex,
              rangeLength:
                mapEntryRangeLength - (rangeBorderIndex - currentRange.start),
            });
            return;
          }
          if (
            mapEntrySourceStart >= currentRange.start &&
            mapEntrySourceStart + mapEntryRangeLength <
              currentRange.start + currentRange.rangeLength
          ) {
            //middle portion of the range is mapped by the map entry
            return;
          }
          if (
            mapEntrySourceStart <
              currentRange.start + currentRange.rangeLength &&
            mapEntrySourceStart + mapEntryRangeLength >=
              currentRange.start + currentRange.rangeLength
          ) {
            //last portion of the range is mapped by the map entry
            const rangeBorderIndex = mapEntrySourceStart;

            newWorkingRanges.push({
              start: mapEntryDestinationStart,
              rangeLength:
                currentRange.start +
                currentRange.rangeLength -
                rangeBorderIndex,
            });
            currentRanges.push({
              start: currentRange.start,
              rangeLength: rangeBorderIndex - currentRange.start,
            });
            return;
          }

          newCurrentRanges.push(currentRange);
        });

        lineIndex += 1;
        mapLine = lines[lineIndex];
      }
      //any portions of the range that were not mapped are added directly
      newWorkingRanges.push(...currentRanges);
    });
    workingRanges = newWorkingRanges;
  }

  console.log(Math.min(...workingRanges.map(range => range.start)));
};

solution();
