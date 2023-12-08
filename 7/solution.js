const readLines = require('../utils/readLines');

const CARD_RANKING_ORDER = [
  'A',
  'K',
  'Q',
  'J',
  'T',
  '9',
  '8',
  '7',
  '6',
  '5',
  '4',
  '3',
  '2',
];

const CARD_RANKING_ORDER_WITH_JOKERS = [
  'A',
  'K',
  'Q',
  'T',
  '9',
  '8',
  '7',
  '6',
  '5',
  '4',
  '3',
  '2',
  'J',
];

const CARD_TO_CHARACTER_RANK_MAP = Object.fromEntries(
  CARD_RANKING_ORDER.map((card, i) => [card, String.fromCharCode(65 + i)]),
);

const CARD_TO_CHARACTER_RANK_MAP_WITH_JOKERS = Object.fromEntries(
  CARD_RANKING_ORDER_WITH_JOKERS.map((card, i) => [
    card,
    String.fromCharCode(65 + i),
  ]),
);

const HAND_CARD_COUNTS_TEMPLATE = Object.fromEntries(
  CARD_RANKING_ORDER.map(card => [card, 0]),
);

const parseHandAndBid = line => {
  const [handString, bidString] = line.split(' ');

  return {
    hand: handString.split(''),
    // .sort(
    //   (card1, card2) =>
    //     CARD_RANKING_ORDER.indexOf(card1) - CARD_RANKING_ORDER.indexOf(card2),
    // ),
    bid: Number(bidString),
  };
};

const getHandTypeCharacter = hand => {
  const handCardCounts = hand.reduce(
    (counts, card) => ({ ...counts, [card]: counts[card] + 1 }),
    HAND_CARD_COUNTS_TEMPLATE,
  );

  const cardQuantities = Object.values(handCardCounts);

  const maxGroupSize = Math.max(...cardQuantities);

  switch (maxGroupSize) {
    case 5:
      //5 of a kind
      return 'A';
    case 4:
      //4 of a kind
      return 'B';
    case 3:
      if (cardQuantities.includes(2)) {
        //full house
        return 'C';
      }
      //3 of a kind
      return 'D';
    case 2:
      if (cardQuantities.filter(q => q === 2).length === 2) {
        //2 pair
        return 'E';
      }
      //1 pair
      return 'F';
    default:
      //high card
      return 'G';
  }
};

const getHandTypeCharacterWithJokers = hand => {
  const handCardCounts = hand.reduce(
    (counts, card) => ({ ...counts, [card]: counts[card] + 1 }),
    HAND_CARD_COUNTS_TEMPLATE,
  );

  const numJokers = handCardCounts['J'];
  delete handCardCounts['J'];

  const cardQuantities = Object.entries(handCardCounts);
  cardQuantities.sort(
    ([_, quantity1], [__, quantity2]) => quantity2 - quantity1,
  );

  const maxGroupSize = cardQuantities[0][1] + numJokers;
  const otherCards = cardQuantities.slice(1);

  switch (maxGroupSize) {
    case 5:
      //5 of a kind
      return 'A';
    case 4:
      //4 of a kind
      return 'B';
    case 3:
      if (otherCards.some(([_, quantity]) => quantity === 2)) {
        //full house
        return 'C';
      }
      //3 of a kind
      return 'D';
    case 2:
      if (otherCards.some(([_, quantity]) => quantity === 2)) {
        //2 pair
        return 'E';
      }
      //1 pair
      return 'F';
    default:
      //high card
      return 'G';
  }
};

const getHandStrengthString = hand => {
  const handTypeCharacter = getHandTypeCharacter(hand);
  return (
    handTypeCharacter +
    hand.map(card => CARD_TO_CHARACTER_RANK_MAP[card]).join('')
  );
};

const getHandStrengthStringWithJokers = hand => {
  const handTypeCharacter = getHandTypeCharacterWithJokers(hand);
  return (
    handTypeCharacter +
    hand.map(card => CARD_TO_CHARACTER_RANK_MAP_WITH_JOKERS[card]).join('')
  );
};

const solution = async () => {
  const lines = await readLines('./7/input.txt');

  const handsAndBids = lines.filter(Boolean).map(parseHandAndBid);

  //convert each hand into a 6-character string
  //the first character represents the hand type (5 of a kind, full house, etc) in order from A to G
  //the next five characters are the cards converted from A to M in order for tiebreakers
  //sort hands by their ranking, which is just alphabetically by their 6-character string

  const handsWithStrengths = handsAndBids.map(handAndBid => ({
    ...handAndBid,
    strength: getHandStrengthString(handAndBid.hand),
  }));

  handsWithStrengths.sort(
    ({ strength: strength1 }, { strength: strength2 }) => {
      if (strength1 > strength2) {
        return -1;
      }

      if (strength2 > strength1) {
        return 1;
      }

      return 0;
    },
  );

  const handWinnings = handsWithStrengths.map(({ bid }, i) => bid * (i + 1));
  const totalWinnings = handWinnings.reduce((a, b) => a + b);

  //253205868
  console.log(totalWinnings);

  const handsWithStrengths_jokers = handsAndBids.map(handAndBid => ({
    ...handAndBid,
    strength: getHandStrengthStringWithJokers(handAndBid.hand),
  }));

  handsWithStrengths_jokers.sort(
    ({ strength: strength1 }, { strength: strength2 }) => {
      if (strength1 > strength2) {
        return -1;
      }

      if (strength2 > strength1) {
        return 1;
      }

      return 0;
    },
  );

  const handWinnings_jokers = handsWithStrengths_jokers.map(
    ({ bid }, i) => bid * (i + 1),
  );
  const totalWinnings_jokers = handWinnings_jokers.reduce((a, b) => a + b);

  //253907829
  console.log(totalWinnings_jokers);
};

solution();
