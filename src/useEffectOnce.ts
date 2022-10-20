/**
 * Used to avoid multiple effect calls due to new React v18 feature in the Strict mode that mounts all components
 * twice to simulate state persistence between mount + unmount + 2nd mount cycle.
 * https://blog.ag-grid.com/avoiding-react-18-double-mount/
 */
import { useEffect, useRef, useState } from 'react';

const useEffectOnce = (effect: () => void | (() => void)) => {
  const effectFn = useRef<() => void | (() => void)>(effect);
  const destroyFn = useRef<void | (() => void)>();
  const effectCalled = useRef(false);
  const rendered = useRef(false);
  const [, setVal] = useState<number>(0);

  if (effectCalled.current) {
    rendered.current = true;
  }

  useEffect(() => {
    // only execute the effect first time around
    if (!effectCalled.current) {
      destroyFn.current = effectFn.current();
      effectCalled.current = true;
    }

    // this forces one render after the effect is run
    setVal((val) => val + 1);

    return () => {
      // if the comp didn't render since the useEffect was called,
      // we know it's the dummy React cycle
      if (!rendered.current) {
        return;
      }

      // otherwise this is not a dummy destroy, so call the destroy func
      if (destroyFn.current) {
        destroyFn.current();
      }
    };
  }, []);
};

export default useEffectOnce;
