import {createDummyControls} from '@/components/hooks/useControls';
import {Car, drawCar, updateCar} from '@/domain/model/Car';
import {Road} from '@/domain/model/Road';
import {useCallback, useRef} from 'react';

const dummyControls = createDummyControls();

const useTrafic = (cars: Car[]) => {
  const trafficRef = useRef<Car[]>(cars);

  const drawTrafficInContext = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      trafficRef.current.forEach(car => drawCar(car, ctx));
    },
    [trafficRef]
  );
  const updateTrafficWithControls = useCallback(
    (road: Road) => {
      trafficRef.current = trafficRef.current.map(car => updateCar(car, dummyControls, road, []));
    },
    [trafficRef]
  );

  return [trafficRef, updateTrafficWithControls, drawTrafficInContext] as const;
};

export {useTrafic};
