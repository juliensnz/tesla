import {Controls} from '@/components/hooks/useControls';
import {Car, createCar, drawCar, updateCar} from '@/domain/model/Car';
import {Road} from '@/domain/model/Road';
import {useCallback, useRef} from 'react';

const useCar = (x: number, y: number, width: number, height: number) => {
  const carRef = useRef<Car>(createCar(x, y, width, height));

  const drawCarInContext = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      drawCar(carRef.current, ctx);
    },
    [carRef]
  );
  const updateCarWithControls = useCallback(
    (controls: Controls, road: Road) => {
      carRef.current = updateCar(carRef.current, controls, road);
    },
    [carRef]
  );

  return [carRef, updateCarWithControls, drawCarInContext] as const;
};

export {useCar};
