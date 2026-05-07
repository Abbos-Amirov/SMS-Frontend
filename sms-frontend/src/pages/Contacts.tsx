type ContactRow = {
  id: string;
  name: string;
  phone: string;
  group: string;
  last: string;
};

const demo: ContactRow[] = [
  { id: 'c1', name: 'Ali Valiyev', phone: '+998901112233', group: 'VIP', last: '2026-05-06' },
  { id: 'c2', name: 'Dilshoda Karimova', phone: '+998909998877', group: 'Oddiy', last: '2026-05-05' },
  { id: 'c3', name: 'Sardor Toshmatov', phone: '+998771100220', group: 'VIP', last: '2026-05-07' },
];

export default function Contacts() {
  return (
    <div className="page">
      <p className="page__lede">Kontaktlar ro‘yxati — guruh va oxirgi faollik.</p>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Ism</th>
              <th>Telefon</th>
              <th>Guruh</th>
              <th>Oxirgi faol</th>
            </tr>
          </thead>
          <tbody>
            {demo.map((row) => (
              <tr key={row.id}>
                <td>{row.name}</td>
                <td className="mono">{row.phone}</td>
                <td>
                  <span className={`pill ${row.group === 'VIP' ? 'pill--accent' : 'pill--neutral'}`}>
                    {row.group}
                  </span>
                </td>
                <td className="muted">{row.last}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
