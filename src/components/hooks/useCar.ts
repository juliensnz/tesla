import {Controls} from '@/components/hooks/useControls';
import {Car, createCar, drawCar, updateCar} from '@/domain/model/Car';
import {MutableRefObject, useCallback, useRef} from 'react';

const useCar = (x: number, y: number, width: number, height: number) => {
  const carRef = useRef<Car>(createCar(x, y, width, height));

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

  return [carRef, updateCarWithControls, drawCarInContext] as const;
};

export {useCar};
