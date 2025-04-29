
// This file provides mock implementations of testing-library/react-hooks for tests
import React from 'react';

export function renderHook<P, R>(callback: (props: P) => R): {
  result: { current: R };
  waitForNextUpdate: () => Promise<void>;
  rerender: (props: P) => void;
  unmount: () => void;
} {
  const resultRef = React.useRef<R | null>(null);
  
  const TestComponent: React.FC<P> = (props) => {
    const result = callback(props);
    resultRef.current = result;
    return null;
  };
  
  const div = document.createElement('div');
  
  // Render the component
  React.render(React.createElement(TestComponent, {} as P), div);
  
  return {
    result: { current: resultRef.current as R },
    waitForNextUpdate: () => Promise.resolve(),
    rerender: (props: P) => {
      React.render(React.createElement(TestComponent, props), div);
    },
    unmount: () => {
      React.unmountComponentAtNode(div);
    }
  };
}

export function act(callback: () => void) {
  callback();
}
