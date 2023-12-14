const { readLines } = require('../utils/io');

const parsePatterns = lines => {
  const emptyLineNumbers = lines
    .map((line, lineNumber) => ({
      line,
      lineNumber,
    }))
    .filter(({ line }) => !line);

  const patterns = [];
  let lineNumber = 0;

  while (lineNumber < lines.length) {
    const nextPuzzleEnd = emptyLineNumbers[patterns.length].lineNumber;
    patterns.push([...lines.slice(lineNumber, nextPuzzleEnd)]);
    lineNumber = nextPuzzleEnd + 1;
  }

  return patterns;
};

const getPatternNoteValue = pattern => {
  console.log(pattern);
  const patternYValues = pattern.map((_, y) => y);
  let noteValue = 0;

  loopY: for (let y = 0; y < pattern.length - 1; y++) {
    // check every horizontal line going across the puzzle for symmetry
    for (let dist = 0; dist + y < pattern.length - 1 && y - dist >= 0; dist++) {
      if (pattern[y - dist] != pattern[y + 1 + dist]) {
        continue loopY;
      }
    }
    noteValue += 100 * (y + 1);
  }

  loopX: for (let x = 0; x < pattern[0].length - 1; x++) {
    //check every vertical line going down the puzzle for symmetry
    for (
      let dist = 0;
      dist + x < pattern[0].length - 1 && x - dist >= 0;
      dist++
    ) {
      if (
        !patternYValues.every(
          y => pattern[y][x - dist] === pattern[y][x + 1 + dist],
        )
      ) {
        continue loopX;
      }
    }
    noteValue += x + 1;
  }

  return noteValue;
};

const solution = async () => {
  const lines = await readLines('./13/input.txt');

  const patterns = parsePatterns(lines);

  const patternNoteValues = patterns.map(getPatternNoteValue);

  const sumOfPatternNoteValues = patternNoteValues.reduce((a, b) => a + b, 0);

  //33520
  console.log(sumOfPatternNoteValues);
};

solution();
