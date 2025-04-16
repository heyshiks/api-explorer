import { useState } from 'react';
import ApiForm from './components/ApiForm';
import Tabs from './components/Tabs';
import CodeExport from './components/CodeExport';
import { useTheme } from './ThemeContext';
import RequestHistory from './components/RequestHistory';

type ApiResult = {
  data: any;
  status: number;
  time: number;
  headers: Record<string, string>;
};

function App() {
  const [response, setResponse] = useState<ApiResult | null>(null);
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('GET');
  const [body, setBody] = useState('');
  const [customHeaders, setCustomHeaders] = useState([{ key: '', value: '' }]);
  const { theme, toggleTheme } = useTheme();
  const handleHistorySelect = (item: any) => {
    setUrl(item.url);
    setMethod(item.method);
    setCustomHeaders(item.headers);
    setBody(item.body || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  

  return (
    <div className="app-container" style={{
      maxWidth: '900px',
      margin: '0 auto',
      padding: '30px 20px',
      fontFamily: 'Segoe UI, Roboto, sans-serif',
      color: '#333'
    }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
  <button
    onClick={toggleTheme}
    style={{
      padding: '6px 12px',
      borderRadius: '6px',
      fontSize: '14px',
      cursor: 'pointer',
      backgroundColor: theme === 'dark' ? '#333' : '#eee',
      color: theme === 'dark' ? '#fff' : '#000',
      border: '1px solid #ccc'
    }}
  >
    {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
  </button>
</div>
      <h1 style={{
        fontSize: '28px',
        fontWeight: 600,
        textAlign: 'center',
        marginBottom: '24px',
        color: '#1f2937'
      }}>
        🔍 API Explorer
      </h1>

      <ApiForm
        setResponse={setResponse}
        url={url}
        setUrl={setUrl}
        method={method}
        setMethod={setMethod}
        body={body}
        setBody={setBody}
        customHeaders={customHeaders}
        setCustomHeaders={setCustomHeaders}
      />

      {response && (
        <>
          <div style={{
            backgroundColor: '#fff',
            padding: '16px 20px',
            borderRadius: '8px',
            boxShadow: '0 0 10px rgba(0,0,0,0.05)',
            marginBottom: '20px',
          }}>
            <p><strong>Status:</strong> {response.status}</p>
            <p><strong>Time:</strong> {response.time} ms</p>
          </div>

          <Tabs response={{ data: response.data, headers: response.headers }} />

          <CodeExport
            url={url}
            method={method}
            headers={customHeaders.reduce((acc, { key, value }) => {
              if (key.trim()) acc[key] = value;
              return acc;
            }, {} as Record<string, string>)}
            body={method !== 'GET' ? body ? JSON.parse(body) : {} : undefined}
          />
        </>
      )}
      <RequestHistory onSelect={handleHistorySelect} />
    </div>
  );
}

export default App;
