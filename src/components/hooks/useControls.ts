import {MutableRefObject, useEffect, useRef} from 'react';

type Controls = {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
};

const handleKeyDown = (event: KeyboardEvent, ref: MutableRefObject<Controls>) => {
  console.log(event.key);
  switch (event.key) {
    case 'ArrowLeft':
      ref.current.left = true;
      break;
    case 'ArrowRight':
      ref.current.right = true;
      break;
    case 'ArrowUp':
      ref.current.up = true;
      break;
    case 'ArrowDown':
      ref.current.down = true;
      break;
  }
};

const handleKeyUp = (event: KeyboardEvent, ref: MutableRefObject<Controls>) => {
  console.log(event.key);
  switch (event.key) {
    case 'ArrowLeft':
      ref.current.left = false;
      break;
    case 'ArrowRight':
      ref.current.right = false;
      break;
    case 'ArrowUp':
      ref.current.up = false;
      break;
    case 'ArrowDown':
      ref.current.down = false;
      break;
  }
};
const useControls = () => {
  const ref = useRef({left: false, right: false, up: false, down: false});

  useEffect(() => {
    const handleKeyDownRef = (event: KeyboardEvent) => handleKeyDown(event, ref);
    const handleKeyUpRef = (event: KeyboardEvent) => handleKeyUp(event, ref);

    window.addEventListener('keydown', handleKeyDownRef);
    window.addEventListener('keyup', handleKeyUpRef);

    return () => {
      window.removeEventListener('keydown', handleKeyDownRef);
      window.removeEventListener('keyup', handleKeyUpRef);
    };
  }, [ref]);

  return ref;
};

export {useControls};
export type {Controls};
