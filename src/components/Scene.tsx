import {useCar} from '@/components/hooks/useCar';
import {useControls} from '@/components/hooks/useControls';
import {useRoad} from '@/components/hooks/useRoad';
import {useTrafic} from '@/components/hooks/useTraffic';
import {createCar} from '@/domain/model/Car';
import {useCallback, useEffect, useRef} from 'react';
import styled from 'styled-components';

const Canvas = styled.canvas`
  background-color: grey;
`;

const CANVAS_WIDTH = 200;

const Scene = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const controls = useControls();

  const [roadRef, drawRoad, getLaneCenter] = useRoad(CANVAS_WIDTH);
  const [carRef, updateCar, drawCar] = useCar(createCar(getLaneCenter(1), 100, 30, 50));
  const [trafficRef, updateTraffic, drawTraffic] = useTrafic([createCar(getLaneCenter(1), -100, 30, 50, 2)]);
  const requestRef = useRef<number>(0);

  const animate = useCallback(() => {
    const canvas = ref.current;
    if (!canvas) return;
    canvas.height = window.innerHeight;
    canvas.width = CANVAS_WIDTH;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const car = carRef.current;
    const road = roadRef.current;
    const traffic = trafficRef.current;

    ctx.save();
    ctx.translate(0, -car.position.y + canvas.height * 0.7);

    updateCar(controls.current, road, traffic);
    updateTraffic(road);
    drawRoad(ctx);
    drawCar(ctx);
    drawTraffic(ctx);

    ctx.restore();
    requestRef.current = requestAnimationFrame(animate);
  }, [carRef, roadRef, trafficRef, updateCar, controls, updateTraffic, drawRoad, drawCar, drawTraffic]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [animate]);

  return <Canvas ref={ref}></Canvas>;
};

export {Scene};
