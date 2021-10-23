import React, { FC } from 'react';
import { initStore } from '@toolbox/react/hook';
import { useRenderCount, useTitle } from '../utils/hooks';

const parentStore = {
  string: 'string',
  number: 0,
  object: {
    test: 'test',
    test2: 'test'
  }
};

const useParentStore = initStore(parentStore);

const Parent: FC = props => {
  const { store: parentStore } = useParentStore();
  const { CountHtml } = useRenderCount();
  return (
    <div>
      <h1>parent</h1>
      <CountHtml />
      <p>{parentStore.string}</p>
      <p>{parentStore.number}</p>
      {/* <p>{parentStore.object.test}</p>
      <p>{parentStore.object.test}</p> */}
      <button onClick={() => parentStore.object.test = 'parent object'}>set object test(parent)</button>
      <button onClick={() => parentStore.object.test2 = 'parent object test2'}>set object test(parent)</button>
      <Child object={parentStore.object} />
    </div>
  )
}

const Child: FC<any> = props => {
  const { CountHtml } = useRenderCount();
  // const { object } = props;
  return (
    <div>
      <h2>Child</h2>
      <CountHtml />
      <p>{props.object.test}</p>
      <p>{props.object.test2}</p>
      <button onClick={() => props.object.test = 'child object'}>set object test(child)</button>
    </div>
  )
}

const Demo: FC = props => {
  const { TitleHtml } = useTitle('Demo2 for initStore(store: object)');
  const { CountHtml } = useRenderCount();
  return (
    <div>
      <div>
        <TitleHtml />
        <CountHtml />
      </div>
      <div>
        <h1>Demo2 for initStore(store: object)</h1>
      </div>
      <Parent />
    </div>
  )
}

export default Demo;