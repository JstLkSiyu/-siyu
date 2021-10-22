import { FC, useRef, useState } from 'react';
import { useDebounce } from '@toolbox/react/hook';

const Demo: FC = props => {
  const [tick, setTick] = useState(0);
  const debounceCount = useRef(0);
  const intervalRef = useRef<any>(null);
  useDebounce(() => {
    debounceCount.current++;
  }, 300);
  return (
    <div>
      <div>
        <b>tick: {tick}</b>
      </div>
      <div>
        <b>debounce count: {debounceCount.current}</b>
      </div>
      <button onClick={() => {
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