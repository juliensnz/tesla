import {Network, createNetwork, feedNetworkForward, getNetworkControls} from '@/domain/model/Network';
import {useCallback, useRef} from 'react';
import {Sensors} from '@/domain/model/Sensors';

const useNetwork = (neuronCounts: number[]) => {
  const ref = useRef<Network>(createNetwork(neuronCounts));

  const updateNetworkWithSensors = useCallback(
    (sensors: Sensors) => {
      ref.current = feedNetworkForward(
        ref.current,
        sensors.readings.map(reading => (null === reading ? 0 : 1 - reading.distance))
      );
    },
    [ref]
  );

  const getNetworkControlsFromRef = useCallback(() => getNetworkControls(ref.current), [ref]);

  return [ref, updateNetworkWithSensors, getNetworkControlsFromRef] as const;
};

export {useNetwork};
