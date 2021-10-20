import { useForceUpdate } from '@toolbox/react/hook';
import { Component, FC, useEffect } from 'react';

const Parent: FC = props => {
  useEffect(() => {
    console.log('parent effect');
  });
  return (
    <div>
      <h1>parent</h1>
      <div>{props.children}</div>
    </div>
  )
}

const Child: FC = props => {
  useEffect(() => {
    console.log('child effect');
  });
  return (
    <div>
      <h1>child</h1>
    </div>
  )
}

class ParentClass extends Component {
  render() {
    return (
      <div>
        <h1>parent class</h1>
        <div>{this.props.children}</div>
      </div>
    )
  }
  componentDidUpdate() {
    console.log('parent class updated');
  }
  componentDidMount() {
    console.log('parent class mounted');
  }
}

class ChildClass extends Component {
  render() {
    return (
      <div>
        <h1>child class</h1>
      </div>
    )
  }
  componentDidUpdate() {
    console.log('child class updated');
  }
  componentDidMount() {
    console.log('child class mounted');
  }
}

const Lab: FC = props => {
  const { forceUpdate } = useForceUpdate();

  return (
    <div>
      <ParentClass>
        <Child />
        <ChildClass />
      </ParentClass>
      <button onClick={() => forceUpdate()}>force update</button>
    </div>
  )
}

export default Lab;