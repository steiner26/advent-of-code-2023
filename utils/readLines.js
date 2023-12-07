const fs = require('fs');

module.exports = async function readLines(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      }

      const inputLines = data.split('\n');
      resolve(inputLines);
    });
  });
};
