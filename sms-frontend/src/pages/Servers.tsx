type ServerRow = {
  id: number;
  name: string;
  host: string;
  port: number;
  health: 'ok' | 'degraded';
  load: number;
};

const demoServers: ServerRow[] = [
  { id: 1, name: 'GW-Tashkent-1', host: '10.0.2.11', port: 2775, health: 'ok', load: 42 },
  { id: 2, name: 'GW-Tashkent-2', host: '10.0.2.12', port: 2775, health: 'ok', load: 38 },
  { id: 3, name: 'GW-Samarkand', host: '10.0.4.5', port: 2775, health: 'degraded', load: 71 },
];

export default function Servers() {
  return (
    <div className="page">
      <p className="page__lede">
        SMS gateway serverlari — holat va yuklanish (namuna jadval).
      </p>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nomi</th>
              <th>Host</th>
              <th>Port</th>
              <th>Holat</th>
              <th>Yuk %</th>
            </tr>
          </thead>
          <tbody>
            {demoServers.map((row) => (
              <tr key={row.id}>
                <td>{row.name}</td>
                <td className="mono">{row.host}</td>
                <td className="mono">{row.port}</td>
                <td>
                  <span
                    className={`pill pill--${row.health === 'ok' ? 'success' : 'warn'}`}
                  >
                    {row.health === 'ok' ? 'Sog‘lom' : 'Past'}
                  </span>
                </td>
                <td>
                  <div className="bar-cell">
                    <span className="bar-cell__track">
                      <span className="bar-cell__fill" style={{ width: `${row.load}%` }} />
                    </span>
                    {row.load}%
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
