import {useCar} from '@/components/hooks/useCar';
import {useControls} from '@/components/hooks/useControls';
import {useRoad} from '@/components/hooks/useRoad';
import {useSensors} from '@/components/hooks/useSensors';
import {useCallback, useEffect, useRef} from 'react';
import styled from 'styled-components';

const Canvas = styled.canvas`
  background-color: grey;
`;

const CANVAS_WIDTH = 200;

const Scene = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const controls = useControls();
  const [_sensorsRef, updateSensors, drawSensors] = useSensors(5, 150, Math.PI / 4);

  const [roadRef, drawRoad, getLaneCenter] = useRoad(CANVAS_WIDTH);
  const [carRef, updateCar, drawCar] = useCar(getLaneCenter(1), 100, 30, 50);
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

    ctx.save();
    ctx.translate(0, -car.position.y + canvas.height * 0.7);

    updateCar(controls.current, road);
    updateSensors(car, road);
    drawRoad(ctx);
    drawCar(ctx);
    drawSensors(ctx, car);

    ctx.restore();
    requestRef.current = requestAnimationFrame(animate);
  }, [carRef, updateCar, roadRef, controls, updateSensors, drawRoad, drawSensors, drawCar]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [animate]);

  return <Canvas ref={ref}></Canvas>;
};

export {Scene};
