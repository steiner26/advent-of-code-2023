const { readLines } = require('../utils/io');

const parseResult = resultString => {
  return {
    type: resultString.length > 1 ? 'jump' : 'complete',
    value: resultString,
  };
};

const parseInstruction = instructionString => {
  if (instructionString.indexOf(':') >= 0) {
    const [conditional, resultString] = instructionString.split(':');
    const comparision = conditional.indexOf('<') >= 0 ? 'LT' : 'GT';
    const field = conditional[0];
    let target = Number(conditional.slice(2, conditional.length));
    return {
      type: 'conditional',
      field,
      comparision,
      target,
      result: parseResult(resultString),
    };
  }

  return parseResult(instructionString);
};

const parseWorkflows = workflowLines => {
  return workflowLines.reduce((accm, workflowLine) => {
    const [name, body] = workflowLine.split('{');
    const instructions = body.slice(0, body.length - 1).split(',');

    return {
      ...accm,
      [name]: instructions.map(parseInstruction),
    };
  }, {});
};

const parsePart = partLine => {
  const fields = partLine.slice(1, partLine.length - 1).split(',');
  return fields.reduce((accm, field) => {
    const [key, value] = field.split('=');
    return {
      ...accm,
      [key]: Number(value),
    };
  }, {});
};

const parseInput = lines => {
  const borderIndex = lines.indexOf('');

  const workflowLines = lines.slice(0, borderIndex);
  const partsLines = lines.slice(borderIndex + 1, lines.length);

  return {
    workflows: parseWorkflows(workflowLines),
    parts: partsLines.map(parsePart),
  };
};

const isAccepted = (workflows, part) => {
  let currentWorkflow = workflows['in'];
  while (true) {
    instructionLoop: for (const instruction of currentWorkflow) {
      switch (instruction.type) {
        case 'conditional':
          const partValue = part[instruction.field];
          const isTrue =
            instruction.comparision === 'LT'
              ? partValue < instruction.target
              : partValue > instruction.target;
          if (!isTrue) {
            continue instructionLoop;
          }

          if (instruction.result.type === 'complete') {
            return instruction.result.value === 'A';
          }
          currentWorkflow = workflows[instruction.result.value];
          break instructionLoop;

        case 'jump':
          currentWorkflow = workflows[instruction.value];
          break instructionLoop;

        case 'complete':
          return instruction.value === 'A';
      }
    }
  }
};

const processRangeToNewInstruction = (
  ranges,
  result,
  { unacceptedRanges, acceptedRanges, rejectedRanges },
) => {
  switch (result.type) {
    case 'jump':
      unacceptedRanges.push({
        instruction: result.value,
        ranges: ranges,
      });
      break;

    case 'complete':
      if (result.value === 'A') {
        acceptedRanges.push(ranges);
      } else {
        rejectedRanges.push(ranges);
      }
  }
};

const solution = async () => {
  const lines = await readLines('./19/input.txt');

  const { workflows, parts } = parseInput(lines);

  const acceptedParts = parts.filter(part => isAccepted(workflows, part));

  const sumOfAcceptedParts = acceptedParts.reduce((accm, part) => {
    return accm + Object.values(part).reduce((a, b) => a + b, 0);
  }, 0);

  //476889
  console.log(sumOfAcceptedParts);

  const unacceptedRanges = [
    {
      instruction: 'in',
      ranges: {
        x: {
          min: 1,
          max: 4000,
        },
        m: {
          min: 1,
          max: 4000,
        },
        a: {
          min: 1,
          max: 4000,
        },
        s: {
          min: 1,
          max: 4000,
        },
      },
    },
  ];

  const acceptedRanges = [];
  const rejectedRanges = [];

  while (unacceptedRanges.length) {
    let currentRanges = unacceptedRanges.shift();
    for (const instruction of workflows[currentRanges.instruction]) {
      switch (instruction.type) {
        case 'conditional':
          if (instruction.comparision === 'LT') {
            // currentRange[instruction.field].min to instruction.target - 1
            // goes to instruction.result
            processRangeToNewInstruction(
              {
                ...currentRanges.ranges,
                [instruction.field]: {
                  min: currentRanges.ranges[instruction.field].min,
                  max: instruction.target - 1,
                },
              },
              instruction.result,
              {
                unacceptedRanges,
                acceptedRanges,
                rejectedRanges,
              },
            );

            currentRanges = {
              instruction: currentRanges.instruction,
              ranges: {
                ...currentRanges.ranges,
                [instruction.field]: {
                  min: instruction.target,
                  max: currentRanges.ranges[instruction.field].max,
                },
              },
            };
          } else {
            // instruction.target + 1 to currentRange[instruction.field].max
            // goes to instruction.result
            processRangeToNewInstruction(
              {
                ...currentRanges.ranges,
                [instruction.field]: {
                  min: instruction.target + 1,
                  max: currentRanges.ranges[instruction.field].max,
                },
              },
              instruction.result,
              {
                unacceptedRanges,
                acceptedRanges,
                rejectedRanges,
              },
            );

            currentRanges = {
              instruction: currentRanges.instruction,
              ranges: {
                ...currentRanges.ranges,
                [instruction.field]: {
                  min: currentRanges.ranges[instruction.field].min,
                  max: instruction.target,
                },
              },
            };
          }
        default:
          processRangeToNewInstruction(currentRanges.ranges, instruction, {
            unacceptedRanges,
            acceptedRanges,
            rejectedRanges,
          });
          break;
      }
    }
  }

  const totalAcceptedRanges = acceptedRanges
    .map(ranges => {
      return Object.values(ranges).reduce(
        (accm, { min, max }) => accm * (max - min + 1),
        1,
      );
    })
    .reduce((a, b) => a + b, 0);

  //132380153677887
  console.log(totalAcceptedRanges);
};

solution();
