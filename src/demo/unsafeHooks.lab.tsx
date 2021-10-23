import React, { FC } from 'react';
import { useReactInternal } from '@toolbox/react/unsafeHook';

const Lab: FC = props => {
  const { internal } = useReactInternal();
  console.log(internal);
  return (
    <div>
      Unsafe Hook Lab
    </div>
  )
}

export default Lab;