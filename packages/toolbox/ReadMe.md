### @siyu/toolbox

siyu的私房工具盒

实现了一些抽象的工具函数，方便日常开发使用

#### @siyu/toolbox/base/Sequence

该函数用于为异步函数同步执行回调函数，当某个异步函数未执行完成时，不会执行后续的异步回调，即便后续的异步任务已完成。

```typescript
import { createSeqCtx } from '@siyu/toolbox/base/Sequence';
const seqCtx = createSeqCtx();
const promise1 = new Promise<number>(resolve => {
    setTimeout(() => {
        resolve(1);
    }, 3000);
});
const promise2 = new Promise<number>(resolve => {
    setTimeout(() => {
        resolve(2);
    }, 1000);
});
seqCtx(promise1, function(number) {
    console.log(number);
});
seqCtx(promise2, function(number) {
    console.log(number);
});
//output
//1
//2
```

#### @siyu/toolbox/http/SeqAjax

基于Sequence的Ajax，执行一系列异步请求，同步处理请求返回后的回调。

```typescript
import { seqPost, seqGet } from '@siyu/toolbox/http/SeqAjax';
seqPost(<url>, <data>).then((resp) => {
    //do callback action
});
seqGet(<url>).then((resp) => {
    //do callback action
});
```

#### @siyu/toolbox/react/hook

```tsx
import { useWillMount, useDidMount, useWillUnmount, useDidUpdate, useWillUpdate } from '@siyu/toolbox/react/hook';
import React, { FC } from 'react';

const Component: FC<{}> = function(props) {
    useWillMount(() => {
        console.log('will mount');
    });
    useDidMount(() => {
        console.log('did mount');
    });
    useWillUnmount(() => {
        console.log('will unmount');
    });
    useDidUpdate(() => {
        console.log('did update');
    });
    useWillUpdate(() => {
        console.log('will update');
    });
    return (
    	<div>component</div>
    );
}
```

```tsx
import React, { FC } from 'react';
import { useReactiveState } from '@siyu/toolbox/react/hook';

const Component: FC<{}> = function(props) {
  const reactive = useReactiveState({ hello: 'world' });
  return (
  	<div>
    	<p>{reactive.hello}</p>
      <button onClick={() => reactive.hello = 'changed'}>
        change
      </button>
    </div>
  );
}
```

#### @siyu/toolbox/react/hook initStore

一个轻量级的响应式store，通过initStore初始化store，返回值为一个钩子函数useStore，在函数组件内部使用钩子可以得到store，在store上修改属性可以直接触发本组件以及其他引用该store的组件渲染结果

```tsx
import React, { FC } from 'react';
import { initStore } from '@siyu/toolbox/react/hook';

const store = {
  hello: "world",
  count: {
    c: 0
  }
};

const useStore = initStore(store);

const Component: FC<{}> = function(props) {
  const { store } = useStore();
  return (
  	<div>
    	<p>{store.hello}</p>
      <button onClick={() => store.hello = 'new world'}>change hello</button>
      <button onClick={() => store.count.c++}>add count 1</button>
      <button onClick={() => store.count = { c: 100 }}>add count 2</button>
    </div>
  )
}
```

