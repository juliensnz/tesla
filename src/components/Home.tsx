import {useCar} from '@/components/hooks/useCar';
import {useControls} from '@/components/hooks/useControls';
import {useEffect, useRef} from 'react';
import styled from 'styled-components';

const Canvas = styled.canvas`
  background-color: white;
`;

const Home = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const controls = useControls();
  const [updateCar, drawCar] = useCar();
  const requestRef = useRef<number>(0);

  const animate = () => {
    const canvas = ref.current;
    if (!canvas) return;
    canvas.height = window.innerHeight;
    canvas.width = 200;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    console.log(controls.current);

    updateCar(controls);
    drawCar(ctx);
    requestRef.current = requestAnimationFrame(animate);
  };

  // useEffect(() => {
  //   const canvas = ref.current;
  //   if (!canvas) return;
  //   canvas.height = window.innerHeight;
  //   canvas.width = 200;
  //   const ctx = canvas?.getContext('2d');
  //   if (!ctx) return;

  //   console.log(controls);

  //   updateCar(controls);
  //   drawCar(ctx);
  // }, [ref.current, controls]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  return <Canvas ref={ref}></Canvas>;
};

export {Home};
