import {useCar} from '@/components/hooks/useCar';
import {useControls} from '@/components/hooks/useControls';
import {useRoad} from '@/components/hooks/useRoad';
import {useTrafic} from '@/components/hooks/useTraffic';
import {createCar} from '@/domain/model/Car';
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

const ROAD_WIDTH = 200;
const NETWORK_WIDTH = 300;

const Scene = () => {
  const roadCanvasRef = useRef<HTMLCanvasElement>(null);
  const networkCanvasRef = useRef<HTMLCanvasElement>(null);
  const controls = useControls();

  const [roadRef, drawRoad, getLaneCenter] = useRoad(ROAD_WIDTH);
  const [carRef, networkRef, updateCar, drawCar] = useCar(createCar(getLaneCenter(1), 100, 30, 50));
  const [trafficRef, updateTraffic, drawTraffic] = useTrafic([createCar(getLaneCenter(1), -100, 30, 50, 2)]);

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

      const car = carRef.current;
      const road = roadRef.current;
      const traffic = trafficRef.current;
      const network = networkRef.current;

      roadCtx.save();
      roadCtx.translate(0, -car.position.y + roadCanvas.height * 0.7);

      updateCar(controls.current, road, traffic);
      updateTraffic(road);
      drawRoad(roadCtx);
      drawCar(roadCtx);
      drawTraffic(roadCtx);

      networkCtx.lineDashOffset = -time / 50;
      drawNetwork(networkCtx, network);

      roadCtx.restore();

      requestRef.current = requestAnimationFrame(animate);
    },
    [carRef, roadRef, trafficRef, networkRef, updateCar, controls, updateTraffic, drawRoad, drawCar, drawTraffic]
  );

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [animate]);

  return (
    <Container>
      <GreyCanvas ref={roadCanvasRef}></GreyCanvas>
      <BlackCanvas ref={networkCanvasRef}></BlackCanvas>
    </Container>
  );
};

export {Scene};
