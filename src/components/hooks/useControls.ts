import {MutableRefObject, useEffect, useRef} from 'react';

type Controls = {
  left: boolean;
  right: boolean;
  forward: boolean;
  reverse: boolean;
};

const createDummyControls = (): Controls => ({left: false, right: false, forward: true, reverse: false});

const updateControls = (originalControls: Controls, updates: Controls) => {
  const userIsControlling =
    originalControls.left || originalControls.right || originalControls.forward || originalControls.reverse;

  return userIsControlling ? originalControls : updates;
};

const handleKeyDown = (event: KeyboardEvent, ref: MutableRefObject<Controls>) => {
  switch (event.key) {
    case 'ArrowLeft':
      ref.current.left = true;
      break;
    case 'ArrowRight':
      ref.current.right = true;
      break;
    case 'ArrowUp':
      ref.current.forward = true;
      break;
    case 'ArrowDown':
      ref.current.reverse = true;
      break;
  }
};

const handleKeyUp = (event: KeyboardEvent, ref: MutableRefObject<Controls>) => {
  switch (event.key) {
    case 'ArrowLeft':
      ref.current.left = false;
      break;
    case 'ArrowRight':
      ref.current.right = false;
      break;
    case 'ArrowUp':
      ref.current.forward = false;
      break;
    case 'ArrowDown':
      ref.current.reverse = false;
      break;
  }
};
const useControls = () => {
  const ref = useRef({left: false, right: false, forward: false, reverse: false});

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

export {useControls, createDummyControls, updateControls};
export type {Controls};
