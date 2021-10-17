import { initStore } from '@toolbox/react/hook';
import { useEffect, useRef } from 'react';
import { useRenderCount } from '../utils/hooks';

const childrenStore = {
  children: [
    {
      name: 'wang',
      age: 20,
      sex: 'male'
    },
    {
      name: 'ring',
      age: 19,
      sex: 'female'
    }
  ]
};

const bookStore = [{
  name: 'book1',
  sale: 21.9
}, {
  name: 'book2',
  sale: 11.3
}];

const calcStore = {
  calc: 20
};

const useChilrenStore = initStore(childrenStore);
const useBookStore = initStore(bookStore);
const useCalcStore = initStore(calcStore);

const Demo = function () {
  const { store: childrenStore } = useChilrenStore();
  const { store: bookStore } = useBookStore();
  const { store: calcStore } = useCalcStore();
  const { CountHtml } = useRenderCount();

  const { children } = childrenStore;

  return (
    <div>
      <div>
        <h1>Demo for initStore(store: object)</h1>
        <CountHtml />
      </div>
      <div>
        {children.map((child, index) => (
          <div key={child.name + index}>
            <p>
              <b>Name: </b>
              <span>{child.name}</span>
            </p>
            <p>
              <b>Sex: </b>
              <span>{child.sex}</span>
            </p>
            <p>
              <b>Age: </b>
              <span>{child.age}</span>
            </p>
          </div>
        ))}
        <div>
          <button onClick={() => {
            children.forEach(child => child.age++);
          }}>Add All Ages</button>
          <button onClick={() => {
            children.forEach(child => child.name = child.name.toUpperCase())
          }}>set name uppercase</button>
          <button onClick={() => {
            children.forEach(child => child.name = child.name.toLowerCase())
          }}>set name lowercase</button>
          <button onClick={() => {
            const child = {
              name: 'new child',
              age: Math.floor(Math.random() * 10 + 10),
              sex: Math.random() > 0.5 ? 'male' : 'female'
            };
            children.push(child);
            // children[1] = child;
          }}>add a child</button>
        </div>
        {bookStore.map((book, index) => (
          <div key={book.name + index}>
            <p>
              <b>Name: </b>
              <span>{book.name}</span>
            </p>
            <p>
              <b>Price: </b>
              <span>{book.sale}</span>
            </p>
          </div>
        ))}
        <div>
          <button onClick={() => {
            bookStore.forEach(book => book.sale = book.sale * 1.1);
          }}>increase 10% sale price</button>
        </div>
        <div>
          <p>
            <b>Calc: </b>
            <span>{calcStore.calc}</span>
          </p>  
        </div>
        <button onClick={() => {
          calcStore.calc = calcStore.calc * 10;
          console.log(calcStore.calc);
          calcStore.calc = calcStore.calc + 4;
          console.log(calcStore.calc);
        }}>do calc</button>
      </div>
    </div>
  )
}

export default Demo;