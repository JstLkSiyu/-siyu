import { initStore  } from '@toolbox/react/hook';
import React, { FC } from 'react';
import { useRenderCount, useTitle } from '../utils/hooks';

const store = {
  obj: {
    name: 'hello',
    obj1: {} as any
  },
  obj1: {
    name: 'world',
    obj: {} as any
  }
}

const useStore = initStore(store);

const Demo: FC = props => {
  const { store } = useStore();
  const { obj, obj1 } = store;
  const { TitleHtml } = useTitle('Demo5 for initStore(store: object)');
  const { CountHtml } = useRenderCount();
  return (
    <div>
      <div>
        <TitleHtml />
        <CountHtml />
      </div>
      <div style={{ color: 'red' }}>
        <h3>{obj.name}</h3>
        <h3>{obj.obj1?.name}</h3>
      </div>
      <div style={{ color: 'blue' }}>
        <h3>{obj1.name}</h3>
        <h3>{obj1.obj?.name}</h3>
      </div>
      <button onClick={() => {
        console.log(obj.obj1.obj, obj1.obj.obj1);
        obj.obj1 = obj1;
        obj1.obj = obj;
        console.log(obj.obj1.obj, obj1.obj.obj1);
      }}>do</button>
    </div>
  )
}

export default Demo;