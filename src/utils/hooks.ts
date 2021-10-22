import React, { useEffect, useMemo, useRef } from 'react';

export function useRenderCount() {
  const countRef = useRef(0);
  useEffect(() => {
    countRef.current++;
  });
  const CountHtml = () => {
    return useMemo(() => React.createElement(
      'div',
      {},
      [
        React.createElement(
          'b',
          { key: 'b' },
          'render count: '
        ),
        React.createElement(
          'span',
          { key: 'span' },
          countRef.current
        )
      ]
    ), [countRef.current]);
  }
  return { CountHtml };
}

export function useTitle(title: string) {
  const TitleHtml = () => {
    return useMemo(() => React.createElement(
      'div',
      {},
      [
        React.createElement(
          'h1',
          { key: 'h1' },
          title
        )
      ]
    ), [title]);
  }
  return { TitleHtml };
}