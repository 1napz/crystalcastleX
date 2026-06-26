import React, { useEffect, useState } from 'react';

function UiLogPanel() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await fetch('/logs/ui_log.json'); // เส้นทางไฟล์ log
        const data = await res.json();
        setLogs(Array.isArray(data) ? data : [data]);
      } catch (err) {
        console.error('Error loading UI logs:', err);
      }
    }
    fetchLogs();
  }, []);

  return (
    <div className="ui-log-panel">
      <h2>CrystalCastle UI Logs</h2>
      <table>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Event</th>
            <th>Status</th>
            <th>Latency (ms)</th>
            <th>Screenshot</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, idx) => (
            <tr key={idx}>
              <td>{log.timestamp}</td>
              <td>{log.event}</td>
              <td>{log.status}</td>
              <td>{log.latency_ms}</td>
              <td>
                {log.screenshot ? (
                  <a href={log.screenshot} target="_blank" rel="noopener noreferrer">
                    View
                  </a>
                ) : (
                  'N/A'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UiLogPanel;
