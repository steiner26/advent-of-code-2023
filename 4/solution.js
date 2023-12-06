const readLines = require('../utils/readLines');

const parseNumbers = line => {
  return line
    .split(' ')
    .filter(str => str !== '')
    .map(num => Number(num));
};

const generateCard = line => {
  const [cardNumberString, numbersString] = line.split(': ');
  const [winningNumbersString, yourNumbersString] = numbersString.split(' | ');

  return {
    cardNumber: Number(cardNumberString.match(/\d+/g)[0]),
    winningNumbers: parseNumbers(winningNumbersString),
    yourNumbers: parseNumbers(yourNumbersString),
  };
};

const getPointValue = matches => {
  return matches ? 2 ** (matches - 1) : 0;
};

const solution = async () => {
  const lines = await readLines('./4/input.txt');

  const cards = lines.map(generateCard);
  const winningCards = cards.map(
    ({ cardNumber, winningNumbers, yourNumbers }) => {
      return {
        cardNumber,
        matchingNumbers: yourNumbers.filter(num =>
          winningNumbers.includes(num),
        ),
      };
    },
  );

  const pointValues = winningCards.map(({ cardNumber, matchingNumbers }) => ({
    cardNumber,
    matchingNumbers,
    pointValue: getPointValue(matchingNumbers.length),
  }));

  const totalPoints = pointValues.reduce(
    (accm, { pointValue }) => accm + pointValue,
    0,
  );

  //123356
  console.log(totalPoints);

  const obtainedCards = winningCards.map(card => ({
    ...card,
    quantity: 1,
  }));

  for (const card of obtainedCards) {
    for (let i = 0; i < card.matchingNumbers.length; i++) {
      obtainedCards[card.cardNumber + i].quantity += card.quantity;
    }
  }

  const totalCards = obtainedCards.reduce(
    (accm, card) => accm + card.quantity,
    0,
  );

  //9997537
  console.log(totalCards);
};

solution();
