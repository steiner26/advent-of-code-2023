const readLines = require('../utils/readLines');

const getExpandedUniverse = lines => {
  const expandedRows = lines
    .map((line, i) => {
      if (line.indexOf('#') === -1) {
        return i;
      }
    })
    .filter(i => i !== undefined);

  const expandedColumns = [];
  for (let i = 0; i < lines[0].length; i++) {
    if (lines.every(line => line.charAt(i) !== '#')) {
      expandedColumns.push(i);
    }
  }

  return { expandedRows, expandedColumns };
};

const getGalaxyPositions = lines => {
  const positions = [];
  lines.forEach((line, y) => {
    for (let x = 0; x < line.length; x++) {
      if (line.charAt(x) === '#') {
        positions.push({ x, y });
      }
    }
  });
  return positions;
};

const getMinAndMax = (num1, num2) => {
  return { min: Math.min(num1, num2), max: Math.max(num1, num2) };
};

const calculateDistance = (
  pos1,
  pos2,
  expandedRows,
  expandedColumns,
  emptyRowMultiplier,
) => {
  const { min: minX, max: maxX } = getMinAndMax(pos1.x, pos2.x);
  const extraX = expandedColumns.filter(rowNum => {
    return rowNum > minX && rowNum < maxX;
  }).length;

  const { min: minY, max: maxY } = getMinAndMax(pos1.y, pos2.y);
  const extraY = expandedRows.filter(rowNum => {
    return rowNum > minY && rowNum < maxY;
  }).length;

  return (
    maxX + maxY + (extraX + extraY) * (emptyRowMultiplier - 1) - minX - minY
  );
};

const getDistances = (
  galaxyPositions,
  expandedRows,
  expandedColumns,
  emptyRowMultiplier,
) => {
  const result = [];

  for (let i = 0; i < galaxyPositions.length; i++) {
    for (let j = i + 1; j < galaxyPositions.length; j++) {
      result.push(
        calculateDistance(
          galaxyPositions[i],
          galaxyPositions[j],
          expandedRows,
          expandedColumns,
          emptyRowMultiplier,
        ),
      );
    }
  }

  return result;
};

const solution = async () => {
  const lines = (await readLines('./11/input.txt')).filter(Boolean);
  const { expandedRows, expandedColumns } = getExpandedUniverse(lines);
  const galaxyPositions = getGalaxyPositions(lines);

  const distances = getDistances(
    galaxyPositions,
    expandedRows,
    expandedColumns,
    2,
  );

  const sumOfDistances = distances.reduce((a, b) => a + b, 0);

  //9734203
  console.log(sumOfDistances);

  const expandedDistances = getDistances(
    galaxyPositions,
    expandedRows,
    expandedColumns,
    1000000,
  );

  const sumOfExpandedDistances = expandedDistances.reduce((a, b) => a + b, 0);

  //568914596391
  console.log(sumOfExpandedDistances);
};

solution();
