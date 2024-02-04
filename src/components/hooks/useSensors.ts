import {Car} from '@/domain/model/Car';
import {updateSensors, drawSensors, Sensors} from '@/domain/model/Sensors';
import {useCallback, useRef} from 'react';

const useSensors = (count: number, length: number, spread: number) => {
  const ref = useRef<Sensors>({count, length, spread, rays: []});

  const updateSensorsWithCar = useCallback(
    (car: Car) => {
      ref.current = updateSensors(ref.current, car);
    },
    [ref]
  );

  const drawSensorsInContext = useCallback(
    (ctx: CanvasRenderingContext2D, car: Car) => {
      drawSensors(ref.current, ctx);
    },
    [ref]
  );

  return [updateSensorsWithCar, drawSensorsInContext] as const;
};

export {useSensors};
