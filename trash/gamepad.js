const { useState, useLayoutEffect, useRef } = require("react");

const getGamepadsData = () => navigator.getGamepads();
const objectToArray = list => Object.keys(list).map(i => list[i]);

export default function useGamepads(shouldPoll = false) {
  const [readGamepads, setGamepads] = useState([]);
  const raf = useRef(null);

  useLayoutEffect(() => {
    const onChange = () => {
      const data = getGamepadsData();
      setGamepads(data);

      if (shouldPoll) {
        raf.current = requestAnimationFrame(onChange);
      }
    };

    window.addEventListener("gamepadconnected", onChange);
    window.addEventListener("gamepaddisconnected", onChange);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("gamepadconnected", onChange);
      window.removeEventListener("gamepaddisconnected", onChange);
    };
  }, [shouldPoll]);

  const mapped = objectToArray(readGamepads);
  return mapped;
}
