import React, { FC, useRef, useState } from 'react';
import { useThrottle } from '@toolbox/react/hook';

const Demo: FC = props => {
  const [tick, setTick] = useState(0);
  const intervalRef = useRef<any>(null);
  const throttleCount = useRef(0);
  useThrottle(() => {
    throttleCount.current++;
  }, 1000);
  return (
    <div>
      <div>
        <b>tick: {tick}</b>
      </div>
      <div>
        <b>throttle count: {throttleCount.current}</b>
      </div>
      <button onClick={() => {
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
          setTick(tick => tick + 1);
        }, 200);
      }}>start</button>
      <button onClick={() => {
        clearInterval(intervalRef.current);
      }}>stop</button>
    </div>
  )
}

export default Demo;