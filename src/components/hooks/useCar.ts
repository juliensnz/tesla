import {Controls, updateControls} from '@/components/hooks/useControls';
import {useNetwork} from '@/components/hooks/useNetwork';
import {useSensors} from '@/components/hooks/useSensors';
import {Car, drawCar, updateCar} from '@/domain/model/Car';
import {Road} from '@/domain/model/Road';
import {useCallback, useRef} from 'react';

const useCar = (car: Car) => {
  const carRef = useRef<Car>(car);
  const [sensorRef, updateSensors, drawSensors] = useSensors(5, 150, Math.PI / 2);
  const [networkRef, updateNetwork, getNetworkControls] = useNetwork([sensorRef.current.count, 6, 4]);

  const drawCarInContext = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      drawCar(carRef.current, ctx);
      drawSensors(ctx, carRef.current);
    },
    [carRef, drawSensors]
  );
  const updateCarWithControls = useCallback(
    (controls: Controls, road: Road, traffic: Car[]) => {
      updateSensors(carRef.current, road, traffic);
      updateNetwork(sensorRef.current);

      const updatedControls = updateControls(controls, getNetworkControls());

      carRef.current = updateCar(carRef.current, updatedControls, road, traffic);
    },
    [updateSensors, updateNetwork, sensorRef, getNetworkControls]
  );

  return [carRef, networkRef, updateCarWithControls, drawCarInContext] as const;
};

export {useCar};
