import { useEffect, useState } from 'react';

type HistoryItem = {
  id: string;
  method: string;
  url: string;
  headers: { key: string; value: string }[];
  body?: string;
  timestamp: number;
};

type Props = {
  onSelect: (item: HistoryItem) => void;
};

function RequestHistory({ onSelect }: Props) {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('api-history');
    if (stored) setHistory(JSON.parse(stored));
  }, []);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div style={{
      backgroundColor: '#fff',
      padding: '16px',
      borderRadius: '8px',
      boxShadow: '0 0 6px rgba(0,0,0,0.05)',
      marginTop: '20px'
    }}>
      <h3 style={{ marginBottom: '10px' }}>🕒 Request History</h3>
      {history.length === 0 ? (
        <p style={{ fontStyle: 'italic' }}>No requests saved yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {history.map((item) => (
            <li
              key={item.id}
              onClick={() => onSelect(item)}
              style={{
                cursor: 'pointer',
                marginBottom: '8px',
                padding: '8px 10px',
                borderRadius: '6px',
                border: '1px solid #ccc',
                backgroundColor: '#fafafa',
              }}
            >
              <strong>{item.method}</strong> {item.url}
              <div style={{ fontSize: '12px', color: '#555' }}>
                {formatTime(item.timestamp)}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RequestHistory;
