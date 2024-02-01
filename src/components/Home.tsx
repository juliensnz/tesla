import {useCar} from '@/components/hooks/useCar';
import {useControls} from '@/components/hooks/useControls';
import {createRoad, drawRoad, getLaneCenter} from '@/domain/model/Road';
import {useEffect, useRef} from 'react';
import styled from 'styled-components';

const Canvas = styled.canvas`
  background-color: grey;
`;

const CANVAS_WIDTH = 200;

const Home = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const controls = useControls();

  const road = createRoad(CANVAS_WIDTH / 2, CANVAS_WIDTH * 0.9);
  const [carRef, updateCar, drawCar] = useCar(getLaneCenter(road, 1), 100, 30, 50);
  const requestRef = useRef<number>(0);

  const animate = () => {
    const canvas = ref.current;
    if (!canvas) return;
    canvas.height = window.innerHeight;
    canvas.width = CANVAS_WIDTH;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    ctx.save();
    ctx.translate(0, -carRef.current.position.y + 300);
    updateCar(controls);
    drawRoad(road, ctx);
    drawCar(ctx);
    ctx.restore();
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  return <Canvas ref={ref}></Canvas>;
};

export {Home};
