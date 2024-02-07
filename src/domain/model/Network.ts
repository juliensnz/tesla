import {Controls} from '@/components/hooks/useControls';

type Level = {
  inputs: number[];
  outputs: number[];
  biases: number[];
  weights: number[][];
};

type Network = {
  levels: Level[];
};

const getNetworkControls = (network: Network): Controls => {
  const outputs = getNetworkOuputs(network);
  return {
    forward: outputs[0] === 1,
    left: outputs[1] === 1,
    right: outputs[2] === 1,
    reverse: outputs[3] === 1,
  };
};

const createNetwork = (neuronCounts: number[]): Network => {
  const levels = neuronCounts
    .map((neuronCount, i) => createLevel(neuronCounts[i - 1] ?? 0, neuronCount))
    .map(randomizeLevel);

  return {levels};
};

const feedNetworkForward = (network: Network, inputs: number[]): Network => {
  return {
    ...network,
    levels: network.levels.reduce((levels: Level[], level, i) => {
      levels[i] = feedLevelForward(updateLevelInputs(level, i === 0 ? inputs : levels[i - 1].outputs));

      return levels;
    }, network.levels),
  };
};

const getNetworkOuputs = (network: Network): number[] => network.levels[network.levels.length - 1].outputs;

const createLevel = (inputCount: number, outputCount: number): Level => ({
  inputs: Array.from({length: inputCount}, () => 0),
  outputs: Array.from({length: outputCount}, () => 0),
  biases: Array.from({length: outputCount}, () => 0),
  weights: Array.from({length: inputCount}, () => Array.from({length: outputCount}, () => 0)),
});

const randomizeLevel = (level: Level): Level => ({
  ...level,
  biases: level.biases.map(() => Math.random() * 2 - 1),
  weights: level.weights.map(row => row.map(() => Math.random() * 2 - 1)),
});

const updateLevelInputs = (level: Level, inputs: number[]) => ({
  ...level,
  inputs,
});

const feedLevelForward = (level: Level) => ({
  ...level,
  outputs: level.outputs.map((_, i) => {
    const sum = level.inputs.reduce((sum, input, j) => sum + input * level.weights[j][i], 0);

    return sum > level.biases[i] ? 1 : 0;
  }),
});

export type {Network};
export {getNetworkControls, createNetwork, feedNetworkForward, getNetworkOuputs};
