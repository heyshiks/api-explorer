import { useState } from 'react';
import axios from 'axios';

type Props = {
  setResponse: (data: {
    data: any;
    status: number;
    time: number;
    headers: Record<string, string>;
  } | null) => void;
  url: string;
  setUrl: (url: string) => void;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  setMethod: (method: 'GET' | 'POST' | 'PUT' | 'DELETE') => void;
  body: string;
  setBody: (body: string) => void;
  customHeaders: { key: string; value: string }[];
  setCustomHeaders: (headers: { key: string; value: string }[]) => void;
};

function ApiForm({
  setResponse,
  url,
  setUrl,
  method,
  setMethod,
  body,
  setBody,
  customHeaders,
  setCustomHeaders
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const start = performance.now();

    try {
      const headers = customHeaders.reduce((acc, { key, value }) => {
        if (key.trim()) acc[key] = value;
        return acc;
      }, {} as Record<string, string>);

      const res = await axios({
        method,
        url,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        data: method !== 'GET' ? JSON.parse(body || '{}') : undefined,
      });

      const end = performance.now();

      setResponse({
        data: res.data,
        status: res.status,
        time: Math.round(end - start),
        headers: Object.entries(res.headers).reduce((acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        }, {} as Record<string, string>),
      });
      const historyItem = {
        id: crypto.randomUUID(),
        method,
        url,
        headers: customHeaders,
        body,
        timestamp: Date.now(),
      };
      
      const prev = JSON.parse(localStorage.getItem('api-history') || '[]');
      const updated = [historyItem, ...prev.slice(0, 9)];
      localStorage.setItem('api-history', JSON.stringify(updated));
    } catch (err: any) {
      setError('Failed to fetch data. Please check the URL or body.');
      setResponse(null);
    } finally {
      setLoading(false);
    }
  };

  const updateHeader = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...customHeaders];
    updated[index][field] = value;
    setCustomHeaders(updated);
  };

  const addHeader = () => setCustomHeaders([...customHeaders, { key: '', value: '' }]);
  const removeHeader = (index: number) => setCustomHeaders(customHeaders.filter((_, i) => i !== index));

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value as any)}
          style={{
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '16px',
          }}
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>

        <input
          type="text"
          placeholder="Enter API endpoint"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{
            padding: '10px',
            flex: 1,
            minWidth: '300px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>

      {(method === 'POST' || method === 'PUT') && (
        <textarea
          placeholder='Enter JSON body'
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={6}
          style={{
            width: '100%',
            padding: '10px',
            fontFamily: 'monospace',
            borderRadius: '6px',
            border: '1px solid #ccc',
            marginBottom: '10px',
          }}
        />
      )}

      <div style={{ marginBottom: '10px' }}>
        <p><strong>Headers:</strong></p>
        {customHeaders.map((header, index) => (
          <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
            <input
              type="text"
              placeholder="Key"
              value={header.key}
              onChange={(e) => updateHeader(index, 'key', e.target.value)}
              style={{
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                flex: 1,
              }}
            />
            <input
              type="text"
              placeholder="Value"
              value={header.value}
              onChange={(e) => updateHeader(index, 'value', e.target.value)}
              style={{
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                flex: 2,
              }}
            />
            <button
              type="button"
              onClick={() => removeHeader(index)}
              style={{
                padding: '8px',
                border: 'none',
                backgroundColor: '#eee',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              ❌
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addHeader}
          style={{
            padding: '8px 12px',
            marginTop: '6px',
            border: '1px dashed #aaa',
            backgroundColor: '#fafafa',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          ➕ Add Header
        </button>
      </div>

      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
    </form>
  );
}

export default ApiForm;
