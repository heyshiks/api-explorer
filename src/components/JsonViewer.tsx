// @ts-ignore
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// @ts-ignore
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function JsonViewer({ data }: { data: any }) {
  return (
    <div style={{ background: '#1e1e1e', borderRadius: '5px', padding: '20px', marginTop: '20px' }}>
      <SyntaxHighlighter language="json" style={oneDark}>
        {JSON.stringify(data, null, 2)}
      </SyntaxHighlighter>
    </div>
  );
}

export default JsonViewer;
