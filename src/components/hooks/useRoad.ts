import {createRoad, drawRoad, getLaneCenter} from '@/domain/model/Road';
import {useCallback, useRef} from 'react';

const useRoad = (width: number) => {
  const ref = useRef(createRoad(width / 2, width * 0.9));

  const drawRoadWithContext = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      drawRoad(ref.current, ctx);
    },
    [ref]
  );

  const getRoadLaneCenter = useCallback(
    (laneIndex: number) => {
      return getLaneCenter(ref.current, laneIndex);
    },
    [ref]
  );

  return [ref, drawRoadWithContext, getRoadLaneCenter] as const;
};

export {useRoad};
