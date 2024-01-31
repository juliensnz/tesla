import {Controls} from '@/components/hooks/useControls';

type Car = {
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
};

const createCar = (x: number, y: number, width: number, height: number): Car => ({
  position: {x, y},
  size: {width, height},
});

const drawCar = (car: Car, ctx: CanvasRenderingContext2D) => {
  ctx.beginPath();
  ctx.rect(car.position.x - car.size.width / 2, car.position.y - car.size.height / 2, car.size.width, car.size.height);
  ctx.fill();
};

const updateCar = (car: Car, controls: Controls): Car => {
  if (controls.up) {
    return {...car, position: {...car.position, y: car.position.y - 2}};
  }
  if (controls.down) {
    return {...car, position: {...car.position, y: car.position.y + 2}};
  }

  return car;
};

export type {Car};
export {drawCar, updateCar, createCar};
