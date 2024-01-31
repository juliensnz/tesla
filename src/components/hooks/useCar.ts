import {Controls} from '@/components/hooks/useControls';
import {Car, createCar, drawCar, updateCar} from '@/domain/model/Car';
import {MutableRefObject, useCallback, useRef} from 'react';

const useCar = () => {
  const carRef = useRef<Car>(createCar(100, 100, 30, 50));

  const drawCarInContext = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      drawCar(carRef.current, ctx);
    },
    [carRef]
  );
  const updateCarWithControls = useCallback(
    (controls: MutableRefObject<Controls>) => {
      carRef.current = updateCar(carRef.current, controls.current);
    },
    [carRef]
  );

  return [updateCarWithControls, drawCarInContext] as const;
};

export {useCar};
