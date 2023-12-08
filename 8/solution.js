const readLines = require('../utils/readLines');

const START_NODE = 'AAA';
const END_NODE = 'ZZZ';

const parseNode = nodeString => {
  const [name, elements] = nodeString.split(' = ');
  const [L, R] = elements.slice(1, 9).split(', ');

  return { name, L, R };
};

const getNumberOfSteps = (network, instructions, start, isEnd) => {
  let i = 0;
  let totalSteps = 0;
  let currentNode = start;

  do {
    currentNode = network[currentNode][instructions[i]];
    totalSteps += 1;
    i = (i + 1) % instructions.length;
  } while (!isEnd(currentNode));

  return { totalSteps, currentNode };
};

const solution = async () => {
  const lines = (await readLines('./8/input.txt')).filter(Boolean);

  const instructions = lines[0];
  const network = lines
    .slice(1)
    .map(parseNode)
    .reduce(
      (map, { name, L, R }) => ({
        ...map,
        [name]: { L, R },
      }),
      {},
    );

  const totalSteps = getNumberOfSteps(
    network,
    instructions,
    START_NODE,
    node => node === END_NODE,
  );

  //24253
  console.log(totalSteps);

  let currentNodes_ghost = Object.keys(network).filter(
    name => name.charAt(2) === 'A',
  );

  const numberOfSteps_ghost = currentNodes_ghost.map(node =>
    getNumberOfSteps(
      network,
      instructions,
      node,
      node => node.charAt(2) === 'Z',
    ),
  );

  //24253 21797 14429 16271 20569 13201
  //LCM is 12357789728873
  console.log(numberOfSteps_ghost);
};

solution();
