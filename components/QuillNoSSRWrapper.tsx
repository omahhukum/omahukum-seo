import dynamic from 'next/dynamic';
import React, { forwardRef } from 'react';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const QuillNoSSRWrapper = forwardRef<any, any>((props, ref) => (
  <ReactQuill {...props} ref={ref} />
));
QuillNoSSRWrapper.displayName = 'QuillNoSSRWrapper';

export default QuillNoSSRWrapper; 