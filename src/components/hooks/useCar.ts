import {Controls} from '@/components/hooks/useControls';
import {Car, drawCar, updateCar} from '@/domain/model/Car';
import {Road} from '@/domain/model/Road';
import {useCallback, useRef} from 'react';

const useCar = (cars: Car[]) => {
  const carsRef = useRef<Car[]>(cars);

  const drawCarInContext = useCallback(
    (ctx: CanvasRenderingContext2D, bestCarUuid: string) => {
      carsRef.current.forEach(car => {
        drawCar(car, bestCarUuid === car.uuid, ctx);
      });
    },
    [carsRef]
  );
  const updateCarWithControls = useCallback(
    (controls: Controls, road: Road, traffic: Car[]) => {
      carsRef.current = carsRef.current.map(car => {
        return updateCar(car, controls, road, traffic);
      });
    },
    [carsRef]
  );

  return [carsRef, updateCarWithControls, drawCarInContext] as const;
};

export {useCar};
