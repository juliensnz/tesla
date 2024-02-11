import {createDummyControls} from '@/components/hooks/useControls';
import {Car, createCar, drawCar, updateCar} from '@/domain/model/Car';
import {Road} from '@/domain/model/Road';
import {useCallback, useRef} from 'react';

const dummyControls = createDummyControls();

const createTraffic = (carCount: number, getLaneCenter: (lane: number) => number) => {
  return Array(carCount)
    .fill(0)
    .map((_, i) => createCar(getLaneCenter(Math.floor(Math.random() * 3)), -i * 150, 30, 50, undefined, false, 2));
};

const useTrafic = (carCount: number, getLaneCenter: (lane: number) => number) => {
  const trafficRef = useRef<Car[]>(createTraffic(carCount, getLaneCenter));

  const drawTrafficInContext = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      trafficRef.current.forEach(car => drawCar(car, false, ctx));
    },
    [trafficRef]
  );
  const updateTrafficWithRoad = useCallback(
    (road: Road) => {
      trafficRef.current = trafficRef.current.map(car => updateCar(car, dummyControls, road, trafficRef.current));
    },
    [trafficRef]
  );

  return [trafficRef, updateTrafficWithRoad, drawTrafficInContext] as const;
};

export {useTrafic};
