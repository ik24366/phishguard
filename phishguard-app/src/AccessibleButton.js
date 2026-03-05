import React, { useRef } from 'react';
import { useButton } from '@react-aria/button';

function AccessibleButton(props) {
  let ref = useRef();
  let { buttonProps } = useButton(props, ref);

  return (
    <button {...buttonProps} ref={ref} style={{ padding: '10px 20px', fontSize: '16px' }}>
      {props.children}
    </button>
  );
}

export default AccessibleButton;
