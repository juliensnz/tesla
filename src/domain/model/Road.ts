import {Controls} from '@/components/hooks/useControls';
import {Segment, lerp} from '@/domain/model/utils';

const INFINITY = 1000000000;

type Point = {
  x: number;
  y: number;
};

type Road = {
  position: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
  size: {
    width: number;
    laneCount: number;
  };
  borders: Segment[];
};

const createRoad = (x: number, width: number, laneCount: number = 3): Road => {
  const left = x - width / 2;
  const right = x + width / 2;
  const top = -INFINITY;
  const bottom = INFINITY;
  const topLeft: Point = {x: left, y: top};
  const topRight: Point = {x: right, y: top};
  const bottomLeft: Point = {x: left, y: bottom};
  const bottomRight: Point = {x: right, y: bottom};

  return {
    position: {left, right, top, bottom},
    size: {width, laneCount},
    borders: [
      [topLeft, bottomLeft],
      [topRight, bottomRight],
    ],
  };
};

const getLaneCenter = (road: Road, lane: number): number => {
  const laneWidth = road.size.width / road.size.laneCount;

  return road.position.left + laneWidth * Math.min(lane, road.size.laneCount - 1) + laneWidth / 2;
};

const drawRoad = (road: Road, ctx: CanvasRenderingContext2D) => {
  ctx.lineWidth = 5;
  ctx.strokeStyle = 'white';

  for (let i = 1; i < road.size.laneCount; i++) {
    const x = lerp(road.position.left, road.position.right, i / road.size.laneCount);

    // if (i > 0 && i < road.size.laneCount) {
    // } else {
    //   ctx.setLineDash([]);
    // }

    ctx.beginPath();
    ctx.setLineDash([20, 20]);
    ctx.moveTo(x, road.position.top);
    ctx.lineTo(x, road.position.bottom);
    ctx.stroke();
  }

  road.borders.forEach(border => {
    ctx.beginPath();
    ctx.setLineDash([]);
    ctx.moveTo(border[0].x, border[0].y);
    ctx.lineTo(border[1].x, border[1].y);
    ctx.stroke();
  });
};

const updateRoad = (road: Road, controls: Controls): Road => {
  return road;
};

export type {Road};
export {getLaneCenter, drawRoad, updateRoad, createRoad};
