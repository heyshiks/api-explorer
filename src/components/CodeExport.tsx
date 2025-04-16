import { useState } from 'react';

type Props = {
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: any;
};

function CodeExport({ url, method, headers, body }: Props) {
  const [type, setType] = useState<'axios' | 'fetch' | 'curl'>('axios');

  const generateSnippet = () => {
    const formattedHeaders = JSON.stringify(headers, null, 2);
    const bodyString = body ? JSON.stringify(body, null, 2) : null;

    switch (type) {
      case 'axios':
        return `axios.${method.toLowerCase()}('${url}'${
          bodyString ? `, ${bodyString}` : ''
        }, {
  headers: ${formattedHeaders}
})`;

      case 'fetch':
        return `fetch('${url}', {
  method: '${method}',
  headers: ${formattedHeaders}${
          bodyString ? `,\n  body: JSON.stringify(${bodyString})` : ''
        }
});`;

      case 'curl':
        const headerLines = Object.entries(headers)
          .map(([key, value]) => `-H "${key}: ${value}"`)
          .join(' \\\n  ');
        const dataLine = bodyString ? `--data '${bodyString}'` : '';
        return `curl -X ${method} \\\n  ${headerLines} \\\n  ${dataLine} \\\n  '${url}'`;

      default:
        return '';
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateSnippet());
    alert(`${type.toUpperCase()} snippet copied!`);
  };

  return (
    <div style={{
      backgroundColor: '#fff',
      padding: '16px',
      marginTop: '20px',
      borderRadius: '8px',
      boxShadow: '0 0 8px rgba(0,0,0,0.05)',
    }}>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'center' }}>
        <label htmlFor="type"><strong>Export as:</strong></label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value as any)}
          style={{
            padding: '8px',
            fontSize: '14px',
            borderRadius: '6px',
            border: '1px solid #ccc',
          }}
        >
          <option value="axios">Axios</option>
          <option value="fetch">Fetch</option>
          <option value="curl">cURL</option>
        </select>
        <button
          onClick={copyToClipboard}
          style={{
            padding: '8px 14px',
            backgroundColor: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Copy
        </button>
      </div>

      <pre style={{
        fontFamily: 'monospace',
        fontSize: '13px',
        backgroundColor: '#f9f9f9',
        padding: '12px',
        borderRadius: '6px',
        overflowX: 'auto',
      }}>
        {generateSnippet()}
      </pre>
    </div>
  );
}

export default CodeExport;
