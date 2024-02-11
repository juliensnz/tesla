import {useCar} from '@/components/hooks/useCar';
import {useControls} from '@/components/hooks/useControls';
import {useRoad} from '@/components/hooks/useRoad';
import {useTrafic} from '@/components/hooks/useTraffic';
import {createCars, getBestCar} from '@/domain/model/Car';
import {drawNetwork} from '@/domain/model/Network';
import {useCallback, useEffect, useRef} from 'react';
import styled from 'styled-components';

const GreyCanvas = styled.canvas`
  background-color: grey;
`;
const BlackCanvas = styled.canvas`
  background-color: black;
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ButtonContainer = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: column;
`;

const ROAD_WIDTH = 200;
const NETWORK_WIDTH = 300;

const Scene = () => {
  const roadCanvasRef = useRef<HTMLCanvasElement>(null);
  const networkCanvasRef = useRef<HTMLCanvasElement>(null);
  const controls = useControls();

  const loadNetwork = useCallback(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }
    const network = localStorage.getItem('bestNetwork');
    if (!network) return undefined;

    return JSON.parse(network);
  }, []);

  const [roadRef, drawRoad, getLaneCenter] = useRoad(ROAD_WIDTH);
  const [carsRef, updateCars, drawCars] = useCar(createCars(100, getLaneCenter(1), 100, 30, 50, loadNetwork()));
  const [trafficRef, updateTraffic, drawTraffic] = useTrafic(30, getLaneCenter);

  const save = useCallback(() => {
    const bestCar = getBestCar(carsRef.current);
    if (!bestCar) return;

    const network = bestCar.network;

    localStorage.setItem('bestNetwork', JSON.stringify(network));
  }, [carsRef]);
  const clear = useCallback(() => {
    localStorage.removeItem('bestNetwork');
  }, []);

  const requestRef = useRef<number>(0);

  const animate = useCallback(
    (time: number) => {
      const roadCanvas = roadCanvasRef.current;
      const networkCanvas = networkCanvasRef.current;
      if (!roadCanvas || !networkCanvas) return;

      roadCanvas.height = window.innerHeight;
      roadCanvas.width = ROAD_WIDTH;

      networkCanvas.height = window.innerHeight;
      networkCanvas.width = NETWORK_WIDTH;

      const roadCtx = roadCanvas?.getContext('2d');
      const networkCtx = networkCanvas?.getContext('2d');
      if (!roadCtx || !networkCtx) return;

      const cars = carsRef.current;
      const road = roadRef.current;
      const traffic = trafficRef.current;

      const bestCar = getBestCar(cars);

      if (!bestCar) {
        window.location.reload();
        return;
      }

      roadCtx.save();
      roadCtx.translate(0, -bestCar.position.y + roadCanvas.height * 0.7);

      updateCars(controls.current, road, traffic);
      updateTraffic(road);
      drawRoad(roadCtx);
      drawCars(roadCtx, bestCar.uuid);
      drawTraffic(roadCtx);

      networkCtx.lineDashOffset = -time / 50;
      drawNetwork(networkCtx, bestCar.network);

      roadCtx.restore();

      requestRef.current = requestAnimationFrame(animate);
    },
    [carsRef, roadRef, trafficRef, updateCars, controls, updateTraffic, drawRoad, drawCars, drawTraffic]
  );

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [animate]);

  return (
    <Container>
      <ButtonContainer>
        <button onClick={save}>💾</button>
        <button onClick={clear}>🗑️</button>
        Cars still alive: {carsRef.current.filter(car => !car.damaged).length}
      </ButtonContainer>

      <GreyCanvas ref={roadCanvasRef}></GreyCanvas>
      <BlackCanvas ref={networkCanvasRef}></BlackCanvas>
    </Container>
  );
};

export {Scene};
