import {Controls} from '@/components/hooks/useControls';
import {lerp} from '@/domain/model/utils';

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
    .reduce<Level[]>((levels, neuronCount, i) => {
      if (i === 0) {
        return levels;
      }

      return [...levels, createLevel(neuronCounts[i - 1], neuronCount)];
    }, [])
    .map(randomizeLevel);

  return {levels};
};

const improveNetwork = (network: Network): Network => {
  const levels = network.levels.map(improveLevel);

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
  inputs: Array(inputCount).fill(0),
  outputs: Array(outputCount).fill(0),
  biases: Array(outputCount).fill(0),
  weights: Array(inputCount)
    .fill(0)
    .map(() => Array(outputCount).fill(0)),
});

const randomizeLevel = (level: Level): Level => ({
  ...level,
  biases: level.biases.map(() => Math.random() * 2 - 1),
  weights: level.weights.map(row => row.map(() => Math.random() * 2 - 1)),
});

const improveLevel = (level: Level): Level => ({
  ...level,
  biases: level.biases.map(improveNumber),
  weights: level.weights.map(row => row.map(improveNumber)),
});

const improveNumber = (value: number): number =>
  Math.max(-1, Math.min(1, Math.random() > 0.5 ? value - Math.random() * 0.05 : value + Math.random() * 0.05));

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

const drawNetwork = (ctx: CanvasRenderingContext2D, network: Network) => {
  const margin = 50;
  const left = margin;
  const top = margin;
  const width = ctx.canvas.width - margin * 2;
  const height = ctx.canvas.height - margin * 2;

  const levelHeight = height / network.levels.length;
  [...network.levels].reverse().forEach((level, i) => {
    drawLevel(ctx, level, left, top + levelHeight * i, width, levelHeight);
  });
};

const drawLevel = (
  ctx: CanvasRenderingContext2D,
  level: Level,
  left: number,
  top: number,
  width: number,
  height: number
) => {
  const right = left + width;
  const bottom = top + height;

  const nodeRadius = 10;
  const {inputs, outputs, biases} = level;

  drawConnections(ctx, level, left, top + nodeRadius / 2, width, height - nodeRadius, nodeRadius);
  drawNeurons(ctx, inputs, inputs, left, right, bottom, nodeRadius);
  drawNeurons(ctx, outputs, biases, left, right, top, nodeRadius);
};

const drawNeurons = (
  ctx: CanvasRenderingContext2D,
  neurons: number[],
  biases: number[],
  left: number,
  right: number,
  y: number,
  nodeRadius: number
) => {
  for (let i = 0; i < neurons.length; i++) {
    const x = lerp(left, right, ratio(neurons.length, i));
    drawNeuron(ctx, x, y, nodeRadius, neurons[i], biases[i] ?? 1);
  }
};

const drawConnections = (
  ctx: CanvasRenderingContext2D,
  level: Level,
  left: number,
  top: number,
  width: number,
  height: number,
  nodeRadius: number
) => {
  ctx.setLineDash([7, 3]);
  for (let i = 0; i < level.inputs.length; i++) {
    const inputX = lerp(left, left + width, ratio(level.inputs.length, i));
    for (let j = 0; j < level.outputs.length; j++) {
      const outputX = lerp(left, left + width, ratio(level.outputs.length, j));
      drawConnection(ctx, inputX, top + height - nodeRadius, outputX, top + nodeRadius, level.weights[i][j]);
    }
  }

  ctx.setLineDash([]);
};

const ratio = (count: number, i: number) => (count === 1 ? 0.5 : i / (count - 1));

const drawConnection = (
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  weight: number
) => {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  applyColor(ctx, weight);
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.globalAlpha = 1;
};

const applyColor = (ctx: CanvasRenderingContext2D, value: number) => {
  ctx.strokeStyle = value > 0 ? 'Aquamarine' : 'Crimson';
  ctx.fillStyle = value > 0 ? 'Aquamarine' : 'Crimson';
  ctx.globalAlpha = Math.abs(value);
};

const drawNeuron = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  value: number,
  bias: number
) => {
  ctx.beginPath();
  ctx.arc(x, y, radius, Math.PI, 0);
  applyColor(ctx, value);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI);
  applyColor(ctx, bias);
  ctx.fill();
};

export type {Network};
export {improveNetwork, drawNetwork, getNetworkControls, createNetwork, feedNetworkForward, getNetworkOuputs};
