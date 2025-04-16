import { useState } from 'react';

type Tab = 'response' | 'headers' | 'raw';

type Props = {
  response: {
    data: any;
    headers: Record<string, string>;
  };
};

function Tabs({ response }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('response');

  const tabs: Tab[] = ['response', 'headers', 'raw'];

  const tabStyle = (tab: Tab): React.CSSProperties => ({
    padding: '8px 16px',
    marginRight: '8px',
    borderRadius: '20px',
    border: activeTab === tab ? '2px solid #0070f3' : '1px solid #ccc',
    backgroundColor: activeTab === tab ? '#e0f0ff' : '#f9f9f9',
    color: activeTab === tab ? '#0070f3' : '#555',
    fontWeight: activeTab === tab ? 'bold' : 'normal',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
  });

  return (
    <div style={{
      backgroundColor: '#fff',
      borderRadius: '6px',
      boxShadow: '0 0 10px rgba(0,0,0,0.05)',
      padding: '20px',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '16px',
        flexWrap: 'wrap'
      }}>
        {tabs.map((tab) => (
          <div
            key={tab}
            style={tabStyle(tab)}
            onClick={() => setActiveTab(tab)}
          >
            {tab.toUpperCase()}
          </div>
        ))}
      </div>

      <div>
        {activeTab === 'response' && (
          <pre style={{ overflowX: 'auto', fontFamily: 'monospace', fontSize: '14px' }}>
            {JSON.stringify(response.data, null, 2)}
          </pre>
        )}

        {activeTab === 'headers' && (
          <ul style={{ lineHeight: '1.6', fontSize: '14px' }}>
            {Object.entries(response.headers).map(([key, value]) => (
              <li key={key}><strong>{key}:</strong> {value}</li>
            ))}
          </ul>
        )}

        {activeTab === 'raw' && (
          <pre style={{ overflowX: 'auto', fontFamily: 'monospace', fontSize: '14px' }}>
            {typeof response.data === 'object'
              ? JSON.stringify(response.data)
              : String(response.data)}
          </pre>
        )}
      </div>
    </div>
  );
}

export default Tabs;
