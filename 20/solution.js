const { readLines } = require('../utils/io');

const FLIP_FLOP = '%';
const CONJUNCTION = '&';
const BROADCASTER = 'broadcaster';
const OFF = false;
const ON = true;
const LOW = false;
const HIGH = true;

const parseModules = lines => {
  const inputModules = {};

  const modules = lines
    .map(line => {
      const [nameString, destinationString] = line.split(' -> ');
      const type = nameString[0] === 'b' ? BROADCASTER : nameString[0];
      const name = type === BROADCASTER ? BROADCASTER : nameString.slice(1);
      const destinations = destinationString.split(', ');

      let otherFields = {};
      if (type === FLIP_FLOP) {
        otherFields = {
          value: OFF,
        };
      } else if (type === CONJUNCTION) {
        inputModules[name] = [];
      }

      return { type, name, destinations, ...otherFields };
    })
    .map(module => {
      for (const destination of module.destinations) {
        if (inputModules[destination]) {
          inputModules[destination].push(module.name);
        }
      }
      return module;
    })
    .reduce((accm, module) => {
      return {
        ...accm,
        [module.name]: module,
      };
    }, {});

  for (const [moduleName, inputs] of Object.entries(inputModules)) {
    modules[moduleName].memory = inputs.reduce(
      (accm, inputName) => ({
        ...accm,
        [inputName]: LOW,
      }),
      {},
    );
  }

  return modules;
};

const processPulses = (modules, pulses, pulsesSent) => {
  while (pulses.length) {
    const nextPulse = pulses.shift();
    pulsesSent[nextPulse.type] += 1;
    const targetModule = modules[nextPulse.destination];

    if (!targetModule) {
      continue;
    }

    switch (targetModule.type) {
      case BROADCASTER:
        for (const destination of targetModule.destinations) {
          pulses.push({
            destination,
            type: nextPulse.type,
            source: targetModule.name,
          });
        }
        break;
      case FLIP_FLOP:
        if (nextPulse.type === LOW) {
          targetModule.value = !targetModule.value;
          for (const destination of targetModule.destinations) {
            pulses.push({
              destination,
              type: targetModule.value,
              source: targetModule.name,
            });
          }
        }
        break;
      case CONJUNCTION:
        targetModule.memory[nextPulse.source] = nextPulse.type;
        const newPulseType = !Object.values(targetModule.memory).every(Boolean);
        for (const destination of targetModule.destinations) {
          pulses.push({
            destination,
            type: newPulseType,
            source: targetModule.name,
          });
        }
        break;
    }
  }

  return false;
};

const solution = async () => {
  const lines = (await readLines('./20/input.txt')).filter(Boolean);

  const modules = parseModules(lines);

  const pulsesSent = {
    [LOW]: 0,
    [HIGH]: 0,
  };

  for (let i = 0; i < 1000; i++) {
    processPulses(
      modules,
      [{ type: LOW, destination: BROADCASTER, source: null }],
      pulsesSent,
      false,
    );
  }

  //944750144
  console.log(pulsesSent[LOW] * pulsesSent[HIGH]);
};

solution();
