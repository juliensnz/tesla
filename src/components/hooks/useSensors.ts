import {Car} from '@/domain/model/Car';
import {Road} from '@/domain/model/Road';
import {updateSensors, drawSensors, Sensors} from '@/domain/model/Sensors';
import {useCallback, useRef} from 'react';

const useSensors = (count: number, length: number, spread: number) => {
  const ref = useRef<Sensors>({count, length, spread, rays: [], readings: []});

  const updateSensorsWithCar = useCallback(
    (car: Car, road: Road) => {
      ref.current = updateSensors(ref.current, car, road);
    },
    [ref]
  );

  const drawSensorsInContext = useCallback(
    (ctx: CanvasRenderingContext2D, car: Car) => {
      drawSensors(ref.current, ctx);
    },
    [ref]
  );

  return [ref, updateSensorsWithCar, drawSensorsInContext] as const;
};

export {useSensors};
