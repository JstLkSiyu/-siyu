import { FC } from 'react';
import { initStore } from '@toolbox/react/hook';
import { useRenderCount, useTitle } from '../utils/hooks';

const store = {
  obj1: {
    name: 'wang',
    age: 20
  },
  obj2: {
    name: 'kirito',
    age: 17
  },
  arr: [1,2,3],
  obj: {
    hello: 'world'
  }
};

const useStore = initStore(store);

const Demo: FC<any> = props => {
  const { store } = useStore();
  const { arr, obj1, obj2, obj } = store;
  const { CountHtml } = useRenderCount();
  const { TitleHtml } = useTitle('Demo3 for initStore(store: object)');
  return (
    <div>
      <div>
        <TitleHtml />
        <CountHtml />
      </div>
      <div>
        <h3>{obj1.name}</h3>
        <b>{obj1.age} years</b>
      </div>
      <div>
        <h3>{obj2.name}</h3>
        <b>{obj2.age} years</b>
      </div>
      <h3>{arr.join(',')}</h3>
      <h3>{Object.values(obj).join(',')}</h3>
      <div>
        <button onClick={() => {
          [store.obj2, store.obj1] = [store.obj1, store.obj2];
        }}>exchange obj1 and obj2</button>
        <button onClick={() => {
          store.arr = arr;
        }}>set arr to itself</button>
        <button onClick={() => {
          store.arr.push(4);
        }}>extend arr</button>
        <button onClick={() => {
          store.obj = Object.assign(obj, { [Math.random()]: 'world' });
        }}>extend obj</button>
      </div>
    </div>
  )
}

export default Demo;