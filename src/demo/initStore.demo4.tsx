import { FC } from 'react';
import { initStore } from '@toolbox/react/hook';
import { useRenderCount } from '../utils/hooks';

const store1 = {
  obj: {
    name: 'store1'
  }
}

const store2 = {
  obj: {
    name: 'store2'
  }
}

const useStore1 = initStore(store1);
const useStore2 = initStore(store2);

const Component1: FC = props => {
  const { store: store1 } = useStore1();
  const { obj } = store1;
  return (
    <div>
      <h3>Component1</h3>
      <b>{obj.name}</b>
      <button onClick={() => {
        const store2 = useStore2.current!;
        [store1.obj, store2.obj] = [store2.obj, store1.obj];
      }}>exchange store1 and store2</button>
      <button onClick={() => {
        obj.name += 1;
      }}>extend object</button>
      <button onClick={() => {
        const store2 = useStore2.current!;
        store2.obj.name = 'from store 1';
      }}>set component2</button>
    </div>
  )
}

const Component2: FC = props => {
  const { store: store2 } = useStore2();
  const { obj } = store2;
  return (
    <div>
      <h3>Component2</h3>
      <b>{obj.name}</b>
      <button onClick={() => {
        obj.name += 1;
      }}>extend object</button>
    </div>
  )
}

const Demo: FC<any> = props => {
  const { CountHtml } = useRenderCount();
  return (
    <div>
      <div>
        <h1>Demo4 for initStore(store: object)</h1>
        <CountHtml />
      </div>
      <Component1 />
      <Component2 />
    </div>
  )
}

export default Demo;