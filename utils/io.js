const fs = require('fs');

async function readLines(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      }

      const inputLines = data.split('\n');
      resolve(inputLines);
    });
  });
}

async function writeLines(filename, lines) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, lines, err => {
      if (err) {
        reject(err);
      }

      resolve();
    });
  });
}

module.exports = {
  readLines,
  writeLines,
};
