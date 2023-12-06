const fs = require('fs');

const bag = {
  red: 12,
  green: 13,
  blue: 14,
};

const colors = ['red', 'green', 'blue'];

const parseGame = line => {
  const [gameString, roundsString] = line.split(': ');

  const gameNumber = Number(gameString.split(' ')[1]);
  const rounds = roundsString.split('; ').map(round => {
    const colors = round.split(', ');

    return colors.reduce((accm, colorString) => {
      const [amt, color] = colorString.split(' ');
      return {
        ...accm,
        [color]: Number(amt),
      };
    }, {});
  });

  return {
    gameNumber,
    rounds,
  };
};

const getValidGames = (games, bag) => {
  return games.filter(game => {
    return game.rounds.every(round => {
      return Object.keys(round).every(color => bag[color] >= round[color]);
    });
  });
};

const getMinBag = rounds => {
  return Object.fromEntries(
    colors.map(color => {
      return [color, Math.max(...rounds.map(round => round[color] ?? 0))];
    }),
  );
};

const getMinBags = games => {
  return games.map(({ gameNumber, rounds }) => {
    return {
      gameNumber,
      minBag: getMinBag(rounds),
    };
  });
};

fs.readFile('./2/input.txt', 'utf8', (err, data) => {
  if (err) throw err;

  const inputLines = data.split('\n').filter(line => Boolean(line));

  const games = inputLines.map(parseGame);
  const validGames = getValidGames(games, bag);
  const sumOfValidGames = validGames.reduce(
    (sum, game) => sum + game.gameNumber,
    0,
  );

  //2317
  console.log(sumOfValidGames);

  const minBags = getMinBags(games);
  const powers = minBags.map(({ minBag }) =>
    Object.values(minBag).reduce((a, b) => a * b),
  );
  const sumOfPowers = powers.reduce((a, b) => a + b, 0);

  //74804
  console.log(sumOfPowers);
});
