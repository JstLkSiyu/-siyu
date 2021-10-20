import { FC } from 'react';
import { initStore } from '@toolbox/react/hook';

const store = {
  obj1: {
    name: 'wang',
    age: 20
  },
  obj2: {
    name: 'kirito',
    age: 17
  },
  arr: [1,2,3]
};

const useStore = initStore(store);

const Demo: FC<any> = props => {
  const { store } = useStore();
  const { arr, obj1, obj2 } = store;
  return (
    <div>
      <div>
        <h3>{obj1.name}</h3>
        <b>{obj1.age} years</b>
      </div>
      <div>
        <h3>{obj2.name}</h3>
        <b>{obj2.age} years</b>
      </div>
      <div>
        <button onClick={() => {
          [store.obj2, store.obj1] = [store.obj1, store.obj2];
        }}>exchange obj1 and obj2</button>
      </div>
    </div>
  )
}

export default Demo;