import dynamic from 'next/dynamic';
import { forwardRef } from 'react';
import type { ReactQuillProps } from 'react-quill';

const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false,
  loading: () => <p>Loading...</p>
});

const QuillNoSSRWrapper = forwardRef<unknown, ReactQuillProps>((props, ref) => (
  <ReactQuill {...props} />
));

QuillNoSSRWrapper.displayName = 'QuillNoSSRWrapper';

export default QuillNoSSRWrapper; 